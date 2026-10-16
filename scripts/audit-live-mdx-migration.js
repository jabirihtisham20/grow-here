// Read-only before-cutover capture. Content is kept in the private rollback directory.
const fs=require('node:fs');
const path=require('node:path');
const original=require('../reports/uk-editorial/original-hashes.json');
const backup=require('../reports/mdx-migration/backup.json').directory;
async function get(url){const r=await fetch(url,{signal:AbortSignal.timeout(30000)});return {status:r.status,url:r.url,html:await r.text()};}
(async()=>{
 const capture=path.join(backup,'live-comparison');fs.mkdirSync(capture,{recursive:true});
 const sitemap=await get('https://growhere.online/sitemap.xml');fs.writeFileSync(path.join(capture,'sitemap.xml'),sitemap.html);
 const liveUrls=[...sitemap.html.matchAll(/<loc>(https:\/\/growhere\.online\/blog\/[^<]+)<\/loc>/g)].map(m=>m[1]);
 const expected=original.map(r=>`https://growhere.online/blog/${path.basename(r.file,'.mdx')}`);
 if(JSON.stringify([...liveUrls].sort())!==JSON.stringify([...expected].sort()))throw Error('Live URL inventory differs from saved original inventory. Do not remove CMS.');
 const rows=[];
 for(let i=0;i<original.length;i+=4){
  rows.push(...await Promise.all(original.slice(i,i+4).map(async r=>{
   const slug=path.basename(r.file,'.mdx'),route=`/blog/${slug}`;
   const [live,local]=await Promise.all([get(`https://growhere.online${route}`),get(`http://127.0.0.1:3007${route}`)]);
   fs.writeFileSync(path.join(capture,`${slug}.live.html`),live.html);
   fs.writeFileSync(path.join(capture,`${slug}.local.html`),local.html);
   return {slug,file:r.file,liveStatus:live.status,localStatus:local.status,testing:slug==='fkkj'};
  })));
 }
 fs.writeFileSync('reports/mdx-migration/preflight.json',JSON.stringify({checkedAt:new Date().toISOString(),captureDirectory:capture.replaceAll('\\','/'),liveUrls,rows},null,2));
 console.log(`Captured ${rows.length} live and local article pairs; includes ${rows.filter(r=>r.testing).length} test article. No writes to production.`);
})().catch(e=>{console.error(e.code||e.message);process.exitCode=1});
