const fs=require('node:fs');
const assert=require('node:assert/strict');
const {parse}=require('next/dist/compiled/node-html-parser');
const {readContentPosts}=require('../lib/blog-content');
const recovery=require('../reports/mdx-migration/recovery-validation.json');
const origin=process.env.MIGRATION_QA_ORIGIN||'http://127.0.0.1:3007';
const retired=process.argv.includes('--retired');
const preserveOriginals=process.argv.includes('--preserve-originals');
const normal=s=>s.replace(/\s+/g,' ').trim();
async function get(route){const r=await fetch(`${origin}${route}`);return {status:r.status,text:await r.text()};}
async function main(){
 const published=readContentPosts(),all=readContentPosts(true),results=[];
 for(const post of published){
  const route=`/blog/${post.slug}`,r=await get(route),dom=parse(r.text);
  assert.equal(r.status,200,route);assert.equal(dom.querySelectorAll('h1').length,1,`${route} H1`);
  const body=normal(dom.querySelector('div.prose')?.text||'');assert(body.length>100,`${route} SSR prose`);
  const original=recovery.results.find(p=>p.slug===post.slug);
  let bodyPreserved=false;
  if(original){const hash=require('node:crypto').createHash('sha256').update(body).digest('hex');bodyPreserved=hash===original.bodySha256;if(preserveOriginals)assert(bodyPreserved,`${route} original body`);}
  const canonical=`https://growhere.online${route}`;assert.equal(dom.querySelector('link[rel="canonical"]')?.getAttribute('href'),canonical,`${route} canonical`);
  assert.equal(dom.querySelector('meta[name="description"]')?.getAttribute('content'),post.metaDescription||post.description,`${route} description`);
  const schema=dom.querySelectorAll('script[type="application/ld+json"]').map(n=>JSON.parse(n.rawText));
  const article=schema.find(s=>s['@type']==='BlogPosting');assert.equal(article?.headline,post.title);assert.equal(article?.mainEntityOfPage?.['@id'],canonical);assert.equal(article?.datePublished,post.publishedAt);
  assert(schema.some(s=>s['@type']==='BreadcrumbList'));assert.equal(dom.querySelectorAll(`img[alt="${post.imageAlt}"]`).length>0,true);
  const legacy=await get(`/${post.category}/${post.slug}`);assert.equal(legacy.status,200);assert(legacy.text.includes(canonical));
  results.push({slug:post.slug,canonical,publicStatus:200,legacyStatus:200,bodyPreserved,ssr:true,metadata:true,schema:true});
 }
 const sitemap=await get('/sitemap.xml');assert.equal(sitemap.status,200);
 const urls=[...sitemap.text.matchAll(/<loc>(https:\/\/growhere\.online\/blog\/[^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.deepEqual(urls.sort(),published.filter(p=>!p.noindex).map(p=>`https://growhere.online/blog/${p.slug}`).sort());
 const search=await get('/api/search-index'),feed=await get('/feed.xml');assert.equal(search.status,200);assert.equal(feed.status,200);
 for(const p of all.filter(p=>p.status==='draft')){assert.equal((await get(`/blog/${p.slug}`)).status,404);const preview=await get(`/preview/${p.category}/${p.slug}`);assert.equal(preview.status,200);assert(preview.text.includes('noindex'));assert(!sitemap.text.includes(`/blog/${p.slug}`));}
 const missing=['/blog/fkkj','/grow/fkkj','/blog/this-article-does-not-exist'];
 if(retired)missing.push('/admin','/admin/login','/admin/posts','/admin/media','/api/admin/posts','/api/admin/media','/api/auth/me','/keystatic','/api/keystatic/example','/api/pages/not-present');
 for(const route of missing)assert.equal((await get(route)).status,404,route);
 const pagination=[];
 for(const category of ['grow','space','energy','life','blog','latest']){
  const discovered=new Set(),visited=new Set();let route=`/${category}`;
  while(route&&!visited.has(route)){
   visited.add(route);assert(visited.size<=20,'Pagination loop');const archive=await get(route);assert.equal(archive.status,200);
   const dom=parse(archive.text),anchors=dom.querySelectorAll('a').map(n=>n.getAttribute('href')||'');
   for(const href of anchors.filter(h=>h.startsWith('/blog/')))discovered.add(href);
   const next=anchors.find(h=>h.startsWith('?page='));route=next?`/${category}${next.split('#')[0]}`:null;
  }
  for(const p of published.filter(p=>['blog','latest'].includes(category)||p.category===category))assert(discovered.has(`/blog/${p.slug}`),`Orphan archive post ${category}/${p.slug}`);
  pagination.push({archive:category,pages:visited.size,realArticleAnchors:discovered.size});
 }
 for(const route of ['/','/blog','/latest','/search','/about','/contact','/editorial-policy','/privacy-policy','/terms-and-conditions'])assert.equal((await get(route)).status,200,route);
 const robots=await get('/robots.txt');assert(robots.text.includes('Allow: /'));assert(robots.text.includes('https://growhere.online/sitemap.xml'));
 if(retired){const api=await get('/api/posts?limit=50');assert.equal(api.status,200);assert.equal(JSON.parse(api.text).total,published.length);assert.equal((await get('/api/posts/fkkj')).status,404);assert.equal((await get('/api/categories')).status,200);}
 const report={checkedAt:new Date().toISOString(),origin,published:published.length,drafts:all.length-published.length,originalsPreserved:results.filter(r=>r.bodyPreserved).length,
  sitemapExactMatch:true,categoryDiscovery:true,pagination,removedRoute404:missing,retiredCMS:retired,results,browserQA:'Not executed; HTTP HTML validation only'};
 fs.writeFileSync(`reports/mdx-migration/${retired?'final-http':'pre-removal-http'}.json`,JSON.stringify(report,null,2));
 console.log(`HTTP migration checks passed: ${published.length} public posts, ${report.originalsPreserved} original bodies preserved, exact sitemap, categories and 404 checks${retired?' including retired CMS':''}.`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
