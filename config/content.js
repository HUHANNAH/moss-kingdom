window.MOSS_KINGDOM_CONFIG = {
  title: "苔藓内情：昨日之国",
    subtitle: "在运筹楼的角落，出现了一张探险家工作台",
  map: {
    image: "assets/production/map/map.png",
    alt: "校园俯视图占位素材"
  },
  departments: [
      { id: "water-mist", name: "水合部", role: "调节王国的水分状态，帮助居民从干燥中恢复", image: "assets/production/departments/shuihebu.png", intro: "对应真实生命活动：吸水、失水、保水" },
      { id: "light-watch", name: "远行部", role: "探索外部环境", image: "assets/production/departments/yuanxingbu.png", intro: "原丝体的延伸、匍匐茎及分枝的生长、繁殖体的传播与定殖" },
      { id: "substrate-team", name: "外交部", role: "与邻居们建立联系，合作或竞争", image: "assets/production/departments/waijiaobu.png", intro: "苔藓与细菌、真菌及其他微生物的相互作用" },
      { id: "field-team", name: "抗干扰部", role: "应对王国的物理干扰，维持边缘地带的生存与扩张", image: "assets/production/departments/kangganraobu.png", intro: "自我恢复、抵抗清扫、边缘扩张" },
      { id: "litter-archive", name: "营养部", role: "制造有机物、维持王国生命活动", image: "assets/production/departments/yingyangbu.png", intro: "光合作用、呼吸、物质代谢和生长" }
  ],
  locations: [
    { id: "location-01", name: "叠翠盆地", mapDescription: "在平原的某处，地面忽然向下凹陷，形成一片低于四周的谷底。族人聚集于此，层层青绿藏在石壁围绕的低处。", detailImage: "assets/production/locations/pendi.jpg", hint: "哗啦啦啦啦啦天在下雨，哗啦啦啦啦啦神在降霖~", expectedDepartment: "water-mist", profile: { note: "低处承接雨水，湿润处也留下向外延伸的空间。" }, feedback: { correct: "水合部归位：欢迎光淋，洗欢您来。", incorrect: "再找找苔藓王国中和处理水资源更匹配的部门吧。" } },
      { id: "location-02", name: "长荫谷地", mapDescription: "我们总是住在长影中，高耸的山替我们挡去了大部分直射的烈光。族人沿着巨物与大地相接的边界绵延生长。偶有巨人停留在此，但山的庇护长存。", detailImage: "assets/production/locations/gudi.jpg", hint: "沿着细缝延伸的原丝体，正把新的落脚处连成道路。", expectedDepartment: "light-watch", profile: { note: "阴影覆盖附着表面，边缘的新芽沿着缝隙向外探索。" }, feedback: { correct: "远行部归位：沿着细小的道路，去遇见新的天地。", incorrect: "找找负责向外延伸、传播与定殖的部门。" } },
      { id: "location-03", name: "百隙平原", mapDescription: "这里的地面广阔而平坦，却被无数笔直的沟壑分割。族人散居于石面与裂隙之间，巨人的脚步时常从头顶经过。", detailImage: "assets/production/locations/pingyuan.jpg", hint: "苔藓的热闹我知道。", expectedDepartment: "substrate-team", profile: { note: "开阔的附着表面，邻居关系与干湿交替都值得观察。" }, feedback: { correct: "外交部归位：地表最强外交部！专业团队值得信赖。", incorrect: "这里应该有很多苔的邻居。" } },
      { id: "location-04", name: "悬泉高原", mapDescription: "这片高出平原，仿佛一座悬起的台地。滴潮时常带来水分，落在我们栖居的石面上，成为高原独有的悬泉。", detailImage: "assets/production/locations/gaoyuan.jpg", hint: "可是，苔生不只是眼前的高原，还有诗和远方的世界。", expectedDepartment: "light-watch", profile: { note: "较高的裸露表面，群落需要面对来自外界的扰动。" }, feedback: { correct: "远行部归位：我曾经跨过山和大海，也曾跨过苔山苔海。", incorrect: "再找找苔藓王国中和探索外部环境更匹配的部门吧。" } },
  ],
};
