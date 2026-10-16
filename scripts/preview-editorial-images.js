const sharp=require('sharp');
const fs=require('node:fs');
const batch=require('./editorial-batch');
(async()=>{
 const tiles=[];
 for(let i=0;i<batch.length;i++){
  const slug=batch[i][1];const bytes=await sharp(`public/images/posts/${slug}.webp`).resize(300,169).png().toBuffer();
  tiles.push({input:bytes,left:(i%4)*300,top:Math.floor(i/4)*169});
 }
 await sharp({create:{width:1200,height:845,channels:3,background:'#18332b'}}).composite(tiles).png().toFile('reports/uk-editorial/image-contact-sheet.png');
 console.log('Created a 20-image contact sheet for visual inspection.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
