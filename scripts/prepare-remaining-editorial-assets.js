const fs=require('node:fs');
const sharp=require('sharp');
const batch=require('./editorial-batch');
const line='stroke="#eadfc6" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"';
const box=(x,y,w,h,fill='#315447')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" ${line}/>`;
const path=d=>`<path d="${d}" fill="none" ${line}/>`;
const circle=(x,y,r,fill='#d9bc6b')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const pot=(x,y)=>`<path d="M${x} ${y}h110l-15 110h-80Z" fill="#bf825c"/>${path(`M${x+55} ${y}v-65`)}<ellipse cx="${x+35}" cy="${y-50}" rx="30" ry="14" fill="#86aa81" transform="rotate(30 ${x+35} ${y-50})"/>`;
const text=(x,y,value,size=30)=>`<text x="${x}" y="${y}" fill="#eadfc6" font-family="sans-serif" font-size="${size}" text-anchor="middle">${value}</text>`;
const sheet=(x,y)=>box(x,y,170,225)+path(`M${x+30} ${y+50}h110m-110 45h80m-80 45h110m-110 45h65`);
const appliance=(x,y)=>box(x,y,210,270)+circle(x+105,y+155,65,'#102a22')+circle(x+105,y+155,48,'#7fa4a6')+path(`M${x+25} ${y+35}h75`)+circle(x+170,y+35,9);
const art={
 'balcony-wind-protection-plants-uk':{label:'Shelter starts with a safe layout',draw:()=>path('M260 210h160m-160 60h130m-130 60h160')+[470,510,550,590].map(x=>path(`M${x} 160v310`)).join('')+pot(690,350)+pot(840,380)},
 'autumn-pollinator-container-plan-uk':{label:'Plan overlapping flowers',draw:()=>[360,550,740].map((x,i)=>pot(x,370)+circle(x+55,250-i*15,30,'#d6a6aa')+circle(x+55,250-i*15,10)).join('')+circle(920,230,18)+path('M900 210l-20-25m35 20l10-30')},
 'balcony-wormery-winter-uk':{label:'Feed to observed capacity',draw:()=>box(410,170,380,340)+path('M420 250h360m-360 140h360m-300-45q40-45 80 0t80 0')+box(390,145,420,35,'#a98761')+path('M690 430v55h50')},
 'overwinter-strawberries-in-pots-uk':{label:'Check cold, wet and wind',draw:()=>path('M330 170h560v360')+pot(400,350)+pot(550,360)+pot(700,350)+path('M390 490h440m-400 35h50m250 0h50')+circle(460,305,12,'#c7766e')+circle(760,310,12,'#c7766e')},
 'dry-laundry-small-flat-winter':{label:'Space, extraction and clear access',draw:()=>path('M310 220h470m-430 0l-65 290m455-290l65 290')+[365,495,625].map(x=>`<path d="M${x} 225h90v150h-90Z" fill="#9dbbc1"/>`).join('')+box(850,170,100,100)+path('M870 220h60m-30-30v60')},
 'fridge-eat-first-box-food-safety':{label:'Priority without mixing raw food',draw:()=>box(405,140,390,390)+path('M425 290h350m-350 120h350')+box(455,200,290,65,'#829d77')+text(600,243,'EAT FIRST',25)+box(455,440,290,55,'#b47b68')+text(600,477,'RAW: SEPARATE',22)},
 'freezer-inventory-power-cut-plan':{label:'Read the list, keep the door shut',draw:()=>box(330,155,290,360)+path('M350 275h250m-250 120h250m-200-155h40m-40 120h40m-40 120h40')+sheet(700,200)+circle(930,230,22,'#7fa4a6')},
 'under-sink-leak-checklist':{label:'Keep inspection and stop-tap access',draw:()=>box(320,170,560,350)+path('M350 205h500m-360 0v140q0 65 100 65h30q80 0 80-70v-80m95 15v210m-35-150h70')+'<path d="M575 445q-25 40 0 45q25-5 0-45" fill="#9dbbc1"/>'},
 'plug-in-energy-monitor-rented-flat':{label:'Measure energy, then calculate cost',draw:()=>box(350,190,260,320)+box(385,230,190,100,'#102a22')+text(480,294,'0.80 kWh',27)+path('M430 175v-45m100 45v-45')+sheet(700,230)},
 'letterbox-draught-proofing-checks':{label:'A suitable seal preserves function',draw:()=>box(350,145,360,380)+box(400,280,260,65,'#102a22')+[420,450,480,510,540,570,600,630].map(x=>path(`M${x} 290v45`)).join('')+box(820,240,90,150)+path('M840 270h50m-50 35h50m-50 35h50')},
 'washing-machine-repair-replace-calculation':{label:'Compare complete costs',draw:()=>appliance(495,210)+sheet(240,235)+sheet(790,235)},
 'dehumidifier-running-cost-calculation':{label:'kWh multiplied by your unit rate',draw:()=>box(340,180,250,340)+path('M375 240h180m-180 35h180m-180 35h180')+box(390,365,150,110,'#7fa4a6')+text(800,275,'kWh',48)+path('M760 320l80 80m0-80l-80 80')+text(800,465,'£ / kWh',36)},
 'smart-meter-display-bill-difference':{label:'Match fuel, dates and units',draw:()=>box(300,225,280,230)+box(330,255,220,130,'#102a22')+text(440,335,'kWh',44)+sheet(735,200)+path('M615 305h70m-70 45h70')},
 'household-phone-boundaries-emergency-contact':{label:'Quiet time with tested exceptions',draw:()=>box(450,145,250,385)+circle(575,480,15,'#eadfc6')+path('M505 220h140m-140 45h100')+circle(575,355,48,'#d9bc6b')+path('M750 270h130l-35-35m35 35l-35 35')+circle(930,270,35,'#86aa81')},
 'unsubscribe-marketing-keep-important-emails':{label:'Separate marketing from essentials',draw:()=>box(260,220,250,170)+path('M270 230l115 90 115-90m50 80h100m-50 0v-100h85m-85 100v120h85')+box(760,160,180,90,'#86aa81')+box(760,390,180,90,'#b47b68')},
 'repair-cafe-first-visit-checklist-uk':{label:'Bring the item and a clear fault record',draw:()=>path('M250 460h700m-650 0v65m600-65v65')+box(350,280,230,160,'#a98761')+path('M390 300h145m-145 30h145m45 50h45v60')+sheet(680,215)},
 'library-of-things-borrow-versus-buy':{label:'Include collection and repeat use',draw:()=>box(300,260,230,190,'#a98761')+path('M345 255v-65h140v65m100 95h100m-50-35l50 35-50 35')+sheet(755,210)+text(415,375,'BORROW',27)},
 'photo-declutter-backup-checklist':{label:'Copy, restore, then review',draw:()=>box(280,205,250,230,'#7fa4a6')+path('M300 410l80-90 55 45 65-75')+circle(345,265,20)+path('M575 305h90m-35-35l35 35-35 35')+box(720,220,190,240)+circle(815,380,38,'#86aa81')+path('M790 380l18 18 35-40')}
};
(async()=>{
 const licence=[];
 for(const [category,slug]of batch){
  if(!art[slug])continue;
  const s=art[slug];const base=`public/images/posts/${slug}`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#18332b"/>${s.draw()}${text(600,610,s.label,31)}</svg>`;
  fs.writeFileSync(`${base}.svg`,svg);
  await sharp(Buffer.from(svg)).webp({quality:85}).toFile(`${base}.webp`);
  licence.push({slug,category,source:'Original schematic drawn in repository code',thirdPartyAssets:false,attributionRequired:false,width:1200,height:675,bytes:fs.statSync(`${base}.webp`).size});
 }
 fs.writeFileSync('reports/uk-editorial/new-image-provenance.json',JSON.stringify(licence,null,2));
 console.log(`Created ${licence.length} original WebP diagrams; retained the first two images.`);
})().catch(e=>{console.error(e.message);process.exitCode=1});
