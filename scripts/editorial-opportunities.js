const fs=require('node:fs');
const groups={
grow:[
['peat free compost watering','Dry surface versus root-zone moisture diagnosis'],
['protect balcony plants from wind UK','Check exposure before choosing a permeable shelter'],
['pollinator pots for autumn UK','Plan flowering succession for a small container collection'],
['water butt small garden no downpipe','Compare realistic rainwater collection constraints'],
['wormery on balcony UK winter','Assess space, temperature and ongoing feeding capacity'],
['reuse old potting compost UK','Decide which growing tasks suit reused material'],
['overwinter container strawberries UK','Match winter protection to pot exposure'],
['fungus gnats peat free compost','Separate moisture management from pest identification'],
['waterlogged pots after heavy rain','Check drainage before changing compost'],
['leaf mould small garden bags','Plan collection, storage and eventual use'],
['balcony planter weight wet compost','Prepare questions for a building professional'],
['rented garden wildlife containers','Create a removable habitat plan'],
['seed compost versus multipurpose peat free','Match medium to propagation task']
],
space:[
['winter window condensation checklist','Prepare an observation record for investigation'],
['dry laundry indoors small flat ventilation','Compare room and extraction constraints'],
['fridge eat first box food safety UK','Pair food-waste prevention with label handling'],
['freezer inventory power cut plan UK','Create an inventory and safe decision record'],
['rented flat storage without drilling safety','Choose storage with tenancy and stability checks'],
['under sink leak detection checklist','Spot and report defects before storing items'],
['food cupboard stock rotation UK','Preserve dates and allergen information'],
['reusable food containers damaged replace','Assess condition and intended use'],
['store winter coats small damp flat','Check dryness and ventilation before packing'],
['recycling small flat council rules UK','Build a council-specific sorting station'],
['prepare flat for holiday water leaks','Make a permission-aware pre-departure checklist'],
['shared house cleaning supplies storage','Agree safe accessible storage locations'],
['condensation behind wardrobe rented flat','Overlap with condensation draft; consider a section instead']
],
energy:[
['plug in energy monitor rented flat UK','Measure suitable appliances without electrical alterations'],
['home battery time of use tariff calculation','Model losses and tariff spread; overlaps existing battery guide'],
['draught proof letterbox ventilation safety','Separate unwanted gaps from required ventilation'],
['repair or replace washing machine running costs','Calculate break-even with uncertain remaining life'],
['dehumidifier running cost kwh calculation','Use measured consumption and the actual tariff'],
['electric blanket versus room heating cost','Compare use cases with safety and comfort constraints'],
['solar export versus battery charging calculation','Value exported energy rather than treating it as free'],
['smart meter display not matching bill UK','Distinguish display estimates from billing records'],
['off peak laundry tariff break even UK','Assess timing alongside household safety constraints'],
['heat pump setback temperature guide UK','Potential thermostat overlap; verify specialist angle'],
['rented flat communal heating bill checks','Separate communal heat billing from retail electricity'],
['standby power measurement checklist UK','Potential energy-guide overlap; narrow to measurement']
],
life:[
['shared household phone boundaries emergencies','Agree exceptions for care and urgent contact'],
['work phone boundaries shift workers','Map availability to rota rather than office hours'],
['unsubscribe marketing emails without missing bills','Protect essential messages during an inbox review'],
['no buy month exceptions household UK','Plan replacements and shared spending first'],
['repair cafe visit checklist UK','Prepare item information and questions before attending'],
['library of things borrow versus buy UK','Compare collection time, fees and frequency of use'],
['unsubscribe subscriptions annual renewal checklist','Build a renewal calendar and verify contract terms'],
['household notification settings carers','Keep essential contact routes working'],
['second hand furniture buying measurements UK','Check access, condition and relevant safety requirements'],
['shared household purchase waiting list','Separate urgent needs from optional upgrades'],
['digital declutter photos backup checklist','Verify copies before deleting originals'],
['low spend weekend planning UK rain','Plan accessible local options without purchase pressure']
]};
const selections={grow:[0,1,2,4,6],space:[0,1,2,3,5],energy:[0,2,3,4,7],life:[0,2,4,5,10]};
const links={grow:['balcony-herb-garden','mini-garden-ideas-small-spaces'],space:['small-apartment-organization-ideas','small-kitchen-organization-ideas'],energy:['how-to-save-energy-at-home','energy-efficient-appliances-guide'],life:['digital-minimalism-guide','underconsumption-buy-less']};
const rows=Object.entries(groups).flatMap(([category,items])=>items.map(([keyword,angle],i)=>({
category,primaryLongTail:keyword,proposedTitle:angle,primaryShortTail:keyword.split(' ').slice(0,2).join(' '),secondaryKeywords:[],searchIntent:'Informational (editorial inference, unverified)',
selected:selections[category].includes(i),selectionStatus:'Provisional; not approved for publication',
monthlyUKVolume:'unverified',keywordDifficulty:'unverified',trendTrajectory:'unverified',businessValue:'unverified',competingPageQuality:'unverified except source observations in README',
angle,informationGap:'Proposed practical workflow; actual SERP gap unverified',internalLinks:links[category].map(s=>`/blog/${s}`),
cannibalisationRisk:/overlap|instead/i.test(angle)?'High; expand existing content instead unless distinct intent is demonstrated':'Requires database and Search Console review; local thematic screening only',
evidenceLinks:i===0&&category==='grow'?['https://www.rhs.org.uk/advice/peat/for-gardeners/peat-free-tips','https://www.rhs.org.uk/container-gardening/how-to-water-containers']:i===0&&category==='space'?['https://energysavingtrust.org.uk/advice/ventilation/','https://energysavingtrust.org.uk/advice/fixing-damp-and-condensation/']:[],
researchStatus:i===0&&['grow','space'].includes(category)?'Primary sources read; draft prepared; demand unverified':'Candidate only; primary-source and competitor research pending'
})));
if(rows.length!==50||rows.filter(r=>r.selected).length!==20)throw Error('Unexpected shortlist count');
fs.writeFileSync('reports/uk-editorial/opportunities.json',JSON.stringify(rows,null,2));
console.log('Saved 50 candidates, with 20 explicitly provisional selections.');
