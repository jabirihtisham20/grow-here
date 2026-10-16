const fs=require('node:fs');
async function main(){
 const results=[];
 for(const route of ['/blog','/blog/fkkj','/sitemap.xml','/api/posts?limit=50']){
  try{
   const r=await fetch(`https://growhere.online${route}`,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'GrowHere-Editorial-Audit/1.0'}});
   const body=await r.text();
   const item={route,status:r.status,finalUrl:r.url,contentType:r.headers.get('content-type')};
   if(route==='/sitemap.xml')item.blogUrls=[...body.matchAll(/<loc>(https:\/\/growhere\.online\/blog\/[^<]+)<\/loc>/g)].map(m=>m[1]);
   if(route==='/blog/fkkj')item.placeholderObserved=/flqsnlsl|jnjfjfnkfnknfklanf/.test(body);
   if(route.startsWith('/api/posts')&&r.ok){try{const j=JSON.parse(body);item.total=j.total;item.posts=j.posts;}catch{item.jsonParseFailed=true;}}
   results.push(item);
  }catch(e){results.push({route,error:e.cause?.code||e.name});}
 }
 fs.writeFileSync('reports/uk-editorial/live-readonly-check.json',JSON.stringify({checkedAt:new Date().toISOString(),method:'Public read-only HTTP GET; no credentials, writes or publication',results},null,2));
 console.log(results.map(r=>({route:r.route,status:r.status,error:r.error,blogUrlCount:r.blogUrls?.length,total:r.total,placeholderObserved:r.placeholderObserved})));
}
main().catch(e=>{console.error(e.name);process.exitCode=1});
