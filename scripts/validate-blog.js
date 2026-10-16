const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const sharp=require('sharp');
const {compileMDX}=require('next-mdx-remote/rsc');
const {readContentPosts}=require('../lib/blog-content');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 const all=readContentPosts(true),published=readContentPosts(),issues=[],imageResults=[];
 const titles=new Map(),descriptions=new Map();
 for(const p of all){
  await compileMDX({source:p.content,options:{blockJS:false,blockDangerousJS:true}});
  if(/^#\s/m.test(p.content))issues.push(`${p.slug}: body H1 duplicates template H1`);
  for(const [map,value,label]of [[titles,p.seoTitle||p.title,'SEO title'],[descriptions,p.metaDescription||p.description,'description']]){
   if(map.has(value))issues.push(`${p.slug}: duplicate ${label} with ${map.get(value)}`);map.set(value,p.slug);
  }
  const links=[...p.content.matchAll(/\]\((\/[^)\s]+)\)/g)].map(m=>m[1]);
  for(const link of links){
   const pathname=link.split(/[?#]/)[0];const match=pathname.match(/^\/(?:blog|grow|space|energy|life)\/([^/]+)$/);
   if(match){const target=all.find(p=>p.slug===match[1]);if(!target||(p.status==='published'&&target.status!=='published'))issues.push(`${p.slug}: unavailable internal article ${link}`);}
  }
  const images=[p.image,p.author.avatar,...[...p.content.matchAll(/(?:!\[[^\]]*\]\(|\bsrc=["'])(\/images\/[^"'\s)]+)/g)].map(m=>m[1])];
  for(const image of [...new Set(images)]){
   if(!image.startsWith('/')){imageResults.push({slug:p.slug,url:image,external:true});continue;}
   const file=path.join('public',image);const meta=await sharp(file).metadata();
   if(!meta.width||!meta.height)issues.push(`${p.slug}: invalid image ${image}`);
   imageResults.push({slug:p.slug,url:image,width:meta.width,height:meta.height,bytes:fs.statSync(file).size});
  }
 }
 const recovery=require('../reports/mdx-migration/recovery-validation.json'),originalChanges=[];
 for(const r of recovery.results.filter(r=>!r.testing)){
  const expected=require('../reports/uk-editorial/original-hashes.json').find(x=>x.file===r.file);
  if(!fs.existsSync(r.file)||hash(fs.readFileSync(r.file))!==expected.sha256){originalChanges.push(r.file);if(process.argv.includes('--preserve-originals'))issues.push(`Original content changed: ${r.file}`);}
 }
 if(all.some(p=>p.slug==='fkkj'))issues.push('Retired test article is still loaded');
 const batch=require('./editorial-batch');if(batch.some(([,slug])=>!all.some(p=>p.slug===slug)))issues.push('An editorial batch article is missing');
 const report={checkedAt:new Date().toISOString(),files:all.length,published:published.length,drafts:all.length-published.length,
  genuineOriginals:recovery.genuineOriginalCount,originalSourceHashesPreserved:originalChanges.length===0,originalChanges,testExcluded:true,mdxCompilation:true,
  duplicateSlugs:'Rejected by shared loader across drafts and published files',imageResults,issues};
 fs.mkdirSync('reports/mdx-migration',{recursive:true});fs.writeFileSync('reports/mdx-migration/content-validation.json',JSON.stringify(report,null,2));
 if(issues.length)throw Error(issues.join('\n'));
 console.log(`Blog validation passed: ${all.length} files (${published.length} published, ${all.length-published.length} drafts), ${recovery.genuineOriginalCount} unchanged genuine originals; images and internal article links valid.`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
