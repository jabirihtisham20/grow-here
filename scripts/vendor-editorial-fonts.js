// Fetch the exact existing families, Latin subset only, and their OFL licences.
const fs=require('node:fs');
async function main(){
 const dir='app/fonts';fs.mkdirSync(dir,{recursive:true});
 const response=await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap', {headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
 if(!response.ok)throw Error(`Font CSS HTTP ${response.status}`);
 const css=await response.text();
 fs.writeFileSync(`${dir}/google-fonts-source.css`,css);
 const records=[];
 for(const [family,key] of [['Inter','inter'],['Playfair Display','playfair-display']]){
  for(const weight of (key==='inter'?[400,500,600,700]:[400,600,700])){
   const blocks=css.split('}').filter(b=>b.includes(`font-family: '${family}'`)&&b.includes(`font-weight: ${weight};`));
   const block=blocks.find(b=>b.includes('/* latin */'))||blocks.find(b=>!b.includes('unicode-range'));
   const url=block?.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)?.[1];
   if(!url)throw Error(`Missing exact font ${family} ${weight}`);
   const r=await fetch(url);if(!r.ok)throw Error(`Font HTTP ${r.status}`);
   const ext=url.endsWith('.woff2')?'woff2':url.endsWith('.woff')?'woff':'ttf';
   const file=`${key}-${weight}.${ext}`;fs.writeFileSync(`${dir}/${file}`,Buffer.from(await r.arrayBuffer()));records.push({family,weight,file,source:url});
  }
 }
 for(const [key,folder]of [['inter','inter'],['playfair-display','playfairdisplay']]){
  const url=`https://raw.githubusercontent.com/google/fonts/main/ofl/${folder}/OFL.txt`;
  const r=await fetch(url);if(!r.ok)throw Error(`Licence HTTP ${r.status}`);
  fs.writeFileSync(`${dir}/${key}-OFL.txt`,await r.text());
 }
 fs.writeFileSync(`${dir}/sources.json`,JSON.stringify({fetched:new Date().toISOString(),records},null,2));
 console.log('Saved original Inter and Playfair Display faces and OFL licences.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
