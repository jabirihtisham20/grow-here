const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const matter=require('gray-matter');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const root=process.cwd();
const destination=path.join(root,'data/migration-backups',new Date().toISOString().replace(/[:.]/g,'-'));
fs.mkdirSync(destination,{recursive:true});
const files=[];
function copy(relative){
 const absolute=path.join(root,relative);if(!fs.existsSync(absolute))return;
 if(fs.statSync(absolute).isDirectory()){for(const name of fs.readdirSync(absolute))copy(path.join(relative,name));return;}
 const bytes=fs.readFileSync(absolute),target=path.join(destination,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});
 if(hash(fs.readFileSync(target))!==hash(bytes))throw Error(`Backup verification failed: ${relative}`);
 files.push({file:relative.replaceAll('\\','/'),bytes:bytes.length,sha256:hash(bytes)});
}
for(const dir of ['app','components','lib','content','public','scripts','database'])copy(dir);
for(const file of ['package.json','package-lock.json','next.config.mjs','tsconfig.json','tailwind.config.ts','keystatic.config.ts','.env.example','.gitignore','.eslintrc.json','CONTENT-PUBLISHING.md','DATABASE-MIGRATION.md'])copy(file);
const articles=files.filter(r=>r.file.startsWith('content/')&&/\.mdx?$/.test(r.file)).map(r=>{
 const raw=fs.readFileSync(path.join(root,r.file),'utf8'),parsed=matter(raw);
 return {...r,metadata:parsed.data,body:parsed.content,raw,mediaReferences:[parsed.data.image,parsed.data.author?.avatar,...[...parsed.content.matchAll(/(?:src=\"|\]\()([^"\s)]+)/g)].map(m=>m[1])].filter(Boolean)};
});
fs.writeFileSync(path.join(destination,'articles-export.json'),JSON.stringify(articles,null,2));
fs.writeFileSync(path.join(destination,'manifest.json'),JSON.stringify({createdAt:new Date().toISOString(),files,articleCount:articles.length,excludes:'Secrets, .git, node_modules, .next and database data; Neon untouched'},null,2));
fs.mkdirSync('reports/mdx-migration',{recursive:true});
fs.writeFileSync('reports/mdx-migration/backup.json',JSON.stringify({directory:path.relative(root,destination).replaceAll('\\','/'),files:files.length,articles:articles.length,bytes:files.reduce((n,r)=>n+r.bytes,0),allCopiedHashesVerified:true,productionDatabaseModified:false},null,2));
console.log(`Verified rollback snapshot: ${files.length} files, ${articles.length} articles at ${path.relative(root,destination)}. No secrets or database exports copied.`);
