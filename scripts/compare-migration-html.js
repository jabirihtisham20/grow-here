const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {parse}=require('next/dist/compiled/node-html-parser');
const normal=value=>value.replace(/\s+/g,' ').trim();
function extract(html){
 const root=parse(html),prose=root.querySelector('div.prose');
 const schemas=root.querySelectorAll('script[type="application/ld+json"]').map(n=>JSON.parse(n.rawText));
 const article=schemas.find(s=>s['@type']==='BlogPosting')||{};
 const meta=name=>root.querySelector(`meta[name="${name}"]`)?.getAttribute('content')||root.querySelector(`meta[property="${name}"]`)?.getAttribute('content');
 return {body:normal(prose?.text||''),h1:normal(root.querySelector('h1')?.text||''),title:root.querySelector('title')?.text,
  description:meta('description'),canonical:root.querySelector('link[rel="canonical"]')?.getAttribute('href'),
  links:prose?.querySelectorAll('a').map(n=>n.getAttribute('href')),
  inlineImages:prose?.querySelectorAll('img').map(n=>Object.fromEntries(['src','alt','width','height'].map(k=>[k,n.getAttribute(k)]))),
  image:article.image,headline:article.headline,publishedAt:article.datePublished,updatedAt:article.dateModified,
  authorNames:article.author?.map(a=>a.name),ogImage:meta('og:image'),ogDescription:meta('og:description')};
}
const pre=require('../reports/mdx-migration/preflight.json');
const results=pre.rows.map(r=>{
 const live=extract(fs.readFileSync(path.join(pre.captureDirectory,`${r.slug}.live.html`),'utf8'));
 const local=extract(fs.readFileSync(path.join(pre.captureDirectory,`${r.slug}.local.html`),'utf8'));
 const differences=Object.keys(live).filter(k=>JSON.stringify(live[k])!==JSON.stringify(local[k]));
 return {...r,differences,bodyCharacters:live.body.length,bodySha256:crypto.createHash('sha256').update(live.body).digest('hex'),
  metadata:Object.fromEntries(Object.entries(live).filter(([k])=>k!=='body')),verified:r.liveStatus===200&&r.localStatus===200&&!differences.length&&!!live.body};
});
const report={genuineOriginalCount:results.filter(r=>!r.testing).length,testCount:results.filter(r=>r.testing).length,
 allGenuineRecovered:results.filter(r=>!r.testing).every(r=>r.verified),
 method:'Live vs local production SSR: full visible prose, links/inline images, H1, title, description, canonical, author names, dates and social metadata',results};
fs.writeFileSync('reports/mdx-migration/recovery-validation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,results:undefined}));
for(const r of results.filter(r=>!r.verified))console.log(r.slug,r.differences,r.liveStatus,r.localStatus);
if(!report.allGenuineRecovered)process.exitCode=1;
module.exports={extract};
