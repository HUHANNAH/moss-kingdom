// 新增素材与多槽配置入口；路径从 index.html 所在目录开始。
window.MOSS_EXPERIENCE = {
 paper: { page:"assets/production/papers/01.png", panel:"assets/production/papers/02.png" },
 markers: { normal:"assets/placeholders/markers/normal.svg", hover:"assets/placeholders/markers/hover.svg", selected:"assets/placeholders/markers/selected.svg", complete:"assets/placeholders/markers/complete.svg" },
 locationComplete:"本地点的部门都已归位，可以返回地图继续探索。",
 navigation:{toChronicle:"assets/placeholders/navigation/to-chronicle.svg",toMap:"assets/placeholders/navigation/to-map.svg"},
 reproduction:{id:"reproduction",name:"繁育部",role:"照料孢子与新芽，让新的苔藓在适合的地方安家",image:"assets/production/departments/fanyubu.png",intro:"对应孢子繁殖与营养繁殖，关注新个体的形成和扩散"},
 slots:{
 "location-01":[{id:"original"},{id:"new-growth",department:"reproduction",clue:"一粒孢子、一段新芽，正在寻找湿润的落脚处。",correct:"繁育部归位：新的故事，从一粒孢子或一段新芽开始。",incorrect:"找找负责孢子、新芽和新个体形成的部门吧。"}],
 "location-02":[{id:"original"},{id:"energy",department:"litter-archive",clue:"借着散射光制造有机物，为日常生命活动备好能量。",correct:"营养部归位：光能留下的，是生命活动需要的有机物。",incorrect:"这里需要负责有机物与生命活动供给的部门。"}],
 "location-03":[{id:"original"},{id:"water",department:"water-mist",clue:"雨后湿润，随后渐干，谁来照看吸水与失水？",correct:"水合部归位：湿润与干燥之间，也要安排好水的去留。",incorrect:"找找负责吸水、失水与保水的部门。"}, {id:"new-growth",department:"reproduction",clue:"邻居之间的空隙里，新芽伸展开来，新的个体在此安家。",correct:"繁育部归位：小小的新芽，也能接续一片绿色。",incorrect:"这里的线索指向新个体的形成与扩散。"}],
 "location-04":[{id:"original"},{id:"neighbours",department:"substrate-team",clue:"高原的狭小附着空间里，苔藓与微生物相邻而居，合作与竞争都在发生。",correct:"外交部归位：附着空间虽小，邻里关系可不少。",incorrect:"找找负责与其他生物建立关系的部门。"}],
 }
};
(() => {
 const c=window.MOSS_KINGDOM_CONFIG,e=window.MOSS_EXPERIENCE;
 c.departments.push(e.reproduction);
 c.locations.forEach(loc=>{loc.slots=e.slots[loc.id].map(s=>s.id==="original"?{id:s.id,department:loc.expectedDepartment,clue:loc.hint,correct:loc.feedback.correct,incorrect:loc.feedback.incorrect}:s);});
})();

