const fs = require('node:fs');
const sharp = require('sharp');
const specs = [
  {slug:'peat-free-compost-watering-diagnosis',label:'Look below the surface',art:'<path d="M430 250H770L725 550H475Z" fill="#bf825c"/><path d="M449 300H751L725 550H475Z" fill="#55473b"/><path d="M449 300H751V350H455Z" fill="#a29170"/><path d="M600 270V150Q520 90 510 170Q560 220 600 200M600 210Q680 110 710 150Q710 220 600 240" fill="#7fa988" stroke="#7fa988" stroke-width="12"/><path d="M560 385V470M600 360V500M640 385V470" stroke="#9db2a2" stroke-width="8"/><circle cx="640" cy="325" r="11" fill="#dfc9a0"/> '},
  {slug:'winter-condensation-observation-checklist',label:'Record the pattern',art:'<rect x="390" y="150" width="420" height="380" rx="12" fill="#9dbbc1" stroke="#eadfc6" stroke-width="20"/><path d="M600 160V520M400 340H800" stroke="#eadfc6" stroke-width="14"/><rect x="430" y="178" width="170" height="18" rx="8" fill="#203b35"/><path d="M450 400Q425 440 450 448Q475 440 450 400M530 440Q505 480 530 488Q555 480 530 440M690 380Q665 420 690 428Q715 420 690 380" fill="#e5f1ed"/><path d="M470 100Q490 60 510 100M530 100Q550 60 570 100" fill="none" stroke="#96be9c" stroke-width="8"/>'}
];
(async()=>{
  for(const s of specs){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#18332b"/>${s.art}<text x="600" y="620" fill="#eadfc6" text-anchor="middle" font-family="sans-serif" font-size="34">${s.label}</text></svg>`;
    const base=`public/images/posts/${s.slug}`;
    fs.writeFileSync(`${base}.svg`,svg);
    await sharp(Buffer.from(svg)).webp({quality:85}).toFile(`${base}.webp`);
  }
  console.log('Created two original 1200 × 675 editorial diagrams and optimised WebP heroes.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
