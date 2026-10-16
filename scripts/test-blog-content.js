const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const assert=require('node:assert/strict');
const matter=require('gray-matter');
const workspace=process.cwd();
const fixture=path.resolve('data/migration-backups',`loader-test-${Date.now()}`);
if(!fixture.startsWith(path.resolve('data/migration-backups')+path.sep))throw Error('Unsafe fixture path');
const loader=path.resolve('lib/blog-content.js');
const source=matter(fs.readFileSync('content/grow/balcony-herb-garden.mdx','utf8'));
fs.mkdirSync(path.join(fixture,'content/grow'),{recursive:true});fs.mkdirSync(path.join(fixture,'content/space'),{recursive:true});
fs.writeFileSync(path.join(fixture,'content/removed-posts.json'),'[]');
for(const image of [source.data.image,source.data.author.avatar]){const target=path.join(fixture,'public',image);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join('public',image),target);}
const entry=path.join(fixture,'content/grow/balcony-herb-garden.mdx');
const write=data=>fs.writeFileSync(entry,matter.stringify(source.content,data));
const run=()=>spawnSync(process.execPath,['-e',`require(${JSON.stringify(loader)}).readContentPosts(true)`],{cwd:fixture,encoding:'utf8'});
const tests=[];
try{
 write(source.data);assert.equal(run().status,0);tests.push('Legacy fields preserved');
 const aliases={...source.data};aliases.datePublished=aliases.publishedAt;delete aliases.publishedAt;aliases.featuredImage=aliases.image;delete aliases.image;
 write(aliases);assert.equal(run().status,0);tests.push('Date/image aliases accepted');
 write({...source.data,title:''});assert.match(run().stderr,/title must/);tests.push('Missing required metadata rejected');
 write({...source.data,slug:'different-url'});assert.match(run().stderr,/slug differs/);tests.push('Silent URL drift rejected');
 write({...source.data,publishedAt:'2026-02-30'});assert.match(run().stderr,/invalid publishedAt/);tests.push('Impossible dates rejected');
 write({...source.data,relatedPosts:['missing-target']});assert.match(run().stderr,/relatedPosts target/);tests.push('Missing related target rejected');
 write(source.data);const second=path.join(fixture,'content/space/balcony-herb-garden.mdx');fs.writeFileSync(second,matter.stringify(source.content,{...source.data,category:'space',status:'draft'}));
 assert.match(run().stderr,/duplicate slug/);fs.unlinkSync(second);tests.push('Duplicate draft/published slugs rejected across collections');
 const {slugify}=require(loader);assert.equal(slugify('Café: UK Garden!'),'cafe-uk-garden');tests.push('Deterministic safe slug helper');
 fs.writeFileSync('reports/mdx-migration/loader-tests.json',JSON.stringify({tests,passed:tests.length},null,2));console.log(`Shared loader tests passed: ${tests.length}.`);
}finally{if(fixture.startsWith(path.join(workspace,'data','migration-backups')+path.sep))fs.rmSync(fixture,{recursive:true});}
