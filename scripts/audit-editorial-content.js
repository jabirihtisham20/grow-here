/* Read-only inventory and recoverable file export. Never connects to or modifies PostgreSQL. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const matter = require('gray-matter');
const out = path.join(process.cwd(), 'reports', 'uk-editorial');
fs.mkdirSync(out, { recursive: true });
const rows = [];
for (const category of ['grow', 'space', 'energy', 'life']) {
  for (const name of fs.readdirSync(path.join('content', category)).filter(n => /\.mdx?$/.test(n))) {
    const file = `content/${category}/${name}`;
    const raw = fs.readFileSync(file, 'utf8');
    const {data, content} = matter(raw);
    rows.push({file, slug: name.replace(/\.mdx?$/, ''), category, ...data,
      headings: content.split('\n').filter(l => /^#{1,3} /.test(l)),
      internalLinks: [...content.matchAll(/\]\((\/[^)]+)\)/g)].map(m => m[1]),
      sha256: crypto.createHash('sha256').update(raw).digest('hex'), content});
  }
}
const snapshot = rows.map(r => ({file:r.file, sha256:r.sha256, raw:fs.readFileSync(r.file, 'utf8')}));
// Immutable, content-addressed snapshots allow reruns without replacing earlier backups.
const hash = crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex').slice(0,16);
const backupDir = path.join('data', 'editorial-backups');
fs.mkdirSync(backupDir, {recursive:true});
const backup = path.join(backupDir, `${hash}.json`);
if (!fs.existsSync(backup)) fs.writeFileSync(backup, JSON.stringify(snapshot, null, 2), {flag:'wx'});
fs.writeFileSync(path.join(out, 'inventory.json'), JSON.stringify(rows,null,2));
const tests = rows.filter(r => r.slug === 'fkkj' || r.title === 'fkkj');
fs.writeFileSync(path.join(out, 'test-record.json'), JSON.stringify({
  databaseVerified:false, deletionPerformed:false, reason:'Database authentication failed (28P01); no database backup or unique record/relationship verification possible.',
  localMatches:tests, fileBackup:backup.replaceAll('\\','/')
}, null, 2));
console.log(`Inventoried ${rows.length} files; recoverable snapshot: ${backup}. No records deleted.`);
