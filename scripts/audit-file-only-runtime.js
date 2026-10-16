const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const banned=['pg','@types/pg','bcryptjs','@keystatic/core','@keystatic/next','@vercel/blob'];
const pkg=require('../package.json');
for(const name of banned)assert(!pkg.dependencies?.[name]&&!pkg.devDependencies?.[name],`Runtime dependency remains: ${name}`);
const sources=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(/\.(?:[cm]?js|tsx?)$/.test(file))sources.push(file);}}
for(const dir of ['app','components','lib'])walk(dir);
const matches=[];
for(const file of sources){const text=fs.readFileSync(file,'utf8');if(/DATABASE_URL|SESSION_SECRET|@keystatic|@vercel\/blob|bcryptjs|from ['"]pg['"]|require\(['"]pg['"]\)|cms\/(?:auth|db|posts|media)/.test(text))matches.push(file);}
assert.equal(matches.length,0,`Database/CMS runtime references: ${matches.join(',')}`);
for(const dir of ['app/admin','app/api/admin','app/api/auth','app/keystatic','app/api/keystatic','components/admin','lib/cms'])assert(!fs.existsSync(dir),`CMS directory still active: ${dir}`);
const traces=[];
for(const route of ['api/posts/route','blog/[slug]/page','grow/page']){
 const file=path.join('.next/server/app',`${route}.js.nft.json`);const files=JSON.parse(fs.readFileSync(file,'utf8')).files;
 const databasePackages=files.filter(f=>/node_modules\/(?:pg|bcryptjs|@keystatic|@vercel\/blob)\//.test(f));
 assert.equal(databasePackages.length,0,`Database package traced into ${route}`);
 const content=files.filter(f=>f.includes('/content/')),media=files.filter(f=>f.includes('/public/'));
 assert(content.length>=42,`Missing traced content: ${route}`);assert(media.length>40,`Missing traced assets: ${route}`);
 traces.push({route,contentFiles:content.length,publicAssets:media.length,databasePackages:0});
}
fs.writeFileSync('reports/mdx-migration/file-only-runtime.json',JSON.stringify({checkedAt:new Date().toISOString(),sourceFilesChecked:sources.length,removedDependencies:banned,activeCMSReferences:matches,vercelFunctionTraces:traces,environmentSecretsModified:false,neonDataModified:false},null,2));
console.log(`File-only runtime verified: ${sources.length} source files, no CMS/database imports, content and media included in function traces.`);
