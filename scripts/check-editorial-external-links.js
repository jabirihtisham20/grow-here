const fs=require('node:fs');
const batch=require('./editorial-batch');
const urls=[...new Set(batch.flatMap(([c,s])=>[...fs.readFileSync(`content/${c}/${s}.mdx`,'utf8').matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1])))];
async function check(url){
 try{const r=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'GrowHere-Editorial-LinkCheck/1.0'},redirect:'follow'});await r.body?.cancel();return {url,status:r.status,finalUrl:r.url,reachable:r.ok};}
 catch(e){return {url,status:null,reachable:false,error:e.cause?.code||e.name};}
}
(async()=>{
 const previous=process.argv.includes('--retry-failed')?JSON.parse(fs.readFileSync('reports/uk-editorial/external-links.json','utf8')).results:[];
 const results=previous.filter(r=>r.reachable&&urls.includes(r.url));
 const pending=urls.filter(url=>!results.some(r=>r.url===url));
 for(let i=0;i<pending.length;i+=4)results.push(...await Promise.all(pending.slice(i,i+4).map(check)));
 fs.writeFileSync('reports/uk-editorial/external-links.json',JSON.stringify({checkedAt:new Date().toISOString(),method:'Direct HTTPS GET with redirects, no authentication',results},null,2));
 console.log(`Checked ${results.length} unique external links; ${results.filter(r=>r.reachable).length} return 2xx.`);
 for(const r of results.filter(r=>!r.reachable))console.log(r.status||r.error,r.url);
})().catch(e=>{console.error(e.name);process.exitCode=1});
