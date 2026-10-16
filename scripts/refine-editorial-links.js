// Contextual additions only to the 18 new files; original two drafts are untouched.
const fs=require('node:fs');
const batch=require('./editorial-batch');
const additions={
 'balcony-wind-protection-plants-uk':'Use the light-and-layout assessment in our [small-space garden guide](/blog/mini-garden-ideas-small-spaces) when comparing possible new pot positions.',
 'autumn-pollinator-container-plan-uk':'If herbs already occupy your containers, our [balcony herb guide](/blog/balcony-herb-garden) helps identify their growing requirements before you decide which spaces remain available for flowers.',
 'balcony-wormery-winter-uk':'An existing [container herb garden](/blog/balcony-herb-garden) also needs access for watering and harvesting; do not sacrifice that working space to fit a bin you cannot maintain.',
 'overwinter-strawberries-in-pots-uk':'Use our [small-space garden planning guide](/blog/mini-garden-ideas-small-spaces) to identify a realistic sheltered position before rearranging several pots.',
 'dry-laundry-small-flat-winter':'When drying becomes a wider energy project, our [home energy-saving guide](/blog/how-to-save-energy-at-home) helps compare it with other household changes rather than judging one appliance in isolation.',
 'fridge-eat-first-box-food-safety':'In a shared compact home, agree who updates the list alongside the routines in our [small-apartment organisation guide](/blog/small-apartment-organization-ideas). Keep that responsibility clear when more than one person shops.',
 'freezer-inventory-power-cut-plan':'For a freezer sharing a cramped utility area, apply the access priorities in our [small-apartment organisation guide](/blog/small-apartment-organization-ideas) so drawers and controls remain reachable.',
 'under-sink-leak-checklist':'If moving items out of the cupboard exposes a wider storage problem, use our [small-apartment organisation guide](/blog/small-apartment-organization-ideas) to prioritise accessible everyday items instead of immediately refilling the repaired space.',
 'letterbox-draught-proofing-checks':'In a compact hallway, follow the clear-access approach in our [small-apartment guide](/blog/small-apartment-organization-ideas) before adding a door curtain or loose draught excluder that could obstruct normal use.',
 'washing-machine-repair-replace-calculation':'Our [buy-less framework](/blog/underconsumption-buy-less) can help you separate the need for a working appliance from the appeal of an upgrade, while retaining repair safety and suitability as requirements.',
 'dehumidifier-running-cost-calculation':'Use our [home energy-saving guide](/blog/how-to-save-energy-at-home) to compare the likely scale of this expense with other household uses. If buying equipment is still justified, our [appliance selection guide](/blog/energy-efficient-appliances-guide) helps consider suitability alongside efficiency claims.',
 'smart-meter-display-bill-difference':'If a change in heating schedules coincided with the period being queried, our [thermostat guide](/blog/smart-thermostat-guide) can help you record settings and usage changes. It cannot determine whether the bill is correct.',
 'unsubscribe-marketing-keep-important-emails':'If inbox checking itself is the interruption, try one limited change from our [seven-day digital reset](/blog/7-day-digital-detox) while preserving access to messages you need.',
 'repair-cafe-first-visit-checklist-uk':'Build travel and waiting time into the visit rather than rushing between commitments; our [slow-living guide for busy people](/blog/slow-living-for-busy-people) offers practical ways to leave those gaps.',
 'photo-declutter-backup-checklist':'Before buying more storage hardware, use the inventory principle in our [buy-less guide](/blog/underconsumption-buy-less): check what you own, whether it works and whether it meets the actual backup requirement.',
};
for(const [category,slug]of batch){
 const extra=additions[slug];if(!extra)continue;
 const file=`content/${category}/${slug}.mdx`;const source=fs.readFileSync(file,'utf8');
 if(!source.includes(extra))fs.writeFileSync(file,source.replace('## Frequently asked questions',`${extra}\n\n## Frequently asked questions`));
}
console.log('Contextual links added idempotently to new drafts only.');
