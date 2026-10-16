// One-time scoped retirement, gated by successful recovery and file-site HTTP QA.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const recovery=require('../reports/mdx-migration/recovery-validation.json');
const qa=require('../reports/mdx-migration/pre-removal-http.json');
const backup=require('../reports/mdx-migration/backup.json');
assert(recovery.allGenuineRecovered&&qa.originalsPreserved===recovery.genuineOriginalCount&&qa.sitemapExactMatch);
const manifest=JSON.parse(fs.readFileSync(path.join(backup.directory,'manifest.json'),'utf8'));
const targets=['app/admin','app/api/admin','app/api/auth','app/keystatic','app/api/keystatic','app/api/pages','components/admin','lib/cms','keystatic.config.ts',
 'scripts/create-admin.js','scripts/migrate-db.js','scripts/import-mdx-to-postgres.js','scripts/diagnose-cms-connection.js',
 'scripts/editorial-db-backup.js','scripts/import-editorial-drafts.js','scripts/test-editorial-import.js','scripts/validate-editorial-drafts.js','scripts/check-editorial-http.js'];
const root=path.resolve(process.cwd());const removed=[];
for(const target of targets){
 const resolved=path.resolve(target);if(!resolved.startsWith(root+path.sep))throw Error('Retirement target escapes workspace');
 if(!fs.existsSync(resolved))continue;
 const records=manifest.files.filter(r=>r.file===target||r.file.startsWith(target+'/'));
 if(!records.length)throw Error(`No rollback copy: ${target}`);
 for(const r of records){const copy=path.join(backup.directory,r.file);if(!fs.existsSync(copy)||crypto.createHash('sha256').update(fs.readFileSync(copy)).digest('hex')!==r.sha256)throw Error(`Unverified rollback copy: ${r.file}`);}
 // This checks the resolved absolute targets immediately before recursive removal.
 if(!resolved.startsWith(root+path.sep)||resolved===root)throw Error('Unsafe removal target');
 fs.rmSync(resolved,{recursive:fs.statSync(resolved).isDirectory()});removed.push({target,rollbackFiles:records.length});
}
fs.writeFileSync('reports/mdx-migration/retired-files.json',JSON.stringify({checkedAt:new Date().toISOString(),backup:backup.directory,removed,neonModified:false},null,2));
console.log(`Retired ${removed.length} scoped CMS runtime/script paths; verified rollback copies retained. Neon untouched.`);
