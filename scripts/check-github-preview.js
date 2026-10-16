// Read-only GitHub deployment discovery; credentials stay in memory and are never logged.
const fs=require('node:fs');
const {spawnSync}=require('node:child_process');
const repo='jabirihtisham20/grow-here';
const sha=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim();
let token=process.env.GITHUB_TOKEN||process.env.GH_TOKEN;
async function api(endpoint){
 const url=`https://api.github.com/repos/${repo}/${endpoint}`;
 const request=()=>fetch(url,{headers:{Accept:'application/vnd.github+json','User-Agent':'GrowHere-Migration-Verification',...(token?{Authorization:`Bearer ${token}`}:{})},signal:AbortSignal.timeout(20000)});
 let response=await request();
 if([401,404].includes(response.status)&&!token){
  const credential=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',timeout:10000,env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'}});
  token=credential.stdout?.split(/\r?\n/).find(line=>line.startsWith('password='))?.slice(9);
  if(token)response=await request();
 }
 if(!response.ok)return {http:response.status};
 return response.json();
}
(async()=>{
 const status=await api(`commits/${sha}/status`),deployments=await api(`deployments?sha=${sha}&per_page=10`);
 const previews=[];
 if(Array.isArray(deployments))for(const deployment of deployments){
  const statuses=await api(`deployments/${deployment.id}/statuses?per_page=5`);
  previews.push({id:deployment.id,environment:deployment.environment,statuses:Array.isArray(statuses)?statuses.map(s=>({state:s.state,environmentUrl:s.environment_url,logUrl:s.log_url,description:s.description})):statuses});
 }
 const report={checkedAt:new Date().toISOString(),sha,readOnly:true,combinedState:status.state||null,http:status.http,
  checks:status.statuses?.map(s=>({state:s.state,context:s.context,targetUrl:s.target_url,description:s.description})),deployments:previews,deploymentHttp:deployments.http};
 fs.writeFileSync('reports/mdx-migration/github-preview.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error('GitHub preview lookup failed:',e.cause?.code||e.name);process.exitCode=1});
