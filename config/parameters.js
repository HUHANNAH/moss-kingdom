window.MOSS_KINGDOM_PARAMETERS = [
  { id: "light", label: "光照", defaultValue: 1, levels: ["几乎无直射", "少量散射光", "部分直射光", "长时间直射"] },
  { id: "humidity", label: "周围湿度", defaultValue: 2, levels: ["空气偏干", "微弱湿润感", "持续湿润", "近饱和"] },
  { id: "wind", label: "风", defaultValue: 1, proxy: true, levels: ["几乎静止", "微弱空气流动", "持续空气流动", "明显强风"] },
  { id: "surface", label: "表面水分", defaultValue: 2, levels: ["完全干燥", "有潮湿痕迹", "表面明显湿润", "积水或持续滴水"] },
  { id: "substrate", label: "基质保水与稳定", defaultValue: 2, levels: ["保水弱、易扰动", "薄土或粗糙面", "较稳定，能缓冲干燥", "稳定且保水性强"] },
  { id: "litter", label: "凋落物缓冲", defaultValue: 1, levels: ["几乎没有缓冲层", "薄薄一层", "有遮蔽与储水", "厚层遮蔽，可能覆盖附着面"] },
  { id: "nutrient", label: "营养可用性", defaultValue: 1, levels: ["可用养分低", "背景较低", "中等可用性", "可用养分较高"] },
  { id: "trample", label: "踩踏频率", defaultValue: 0, levels: ["几乎无人经过", "偶尔经过", "高频经过", "连续踩踏"] },
  { id: "cleaning", label: "清扫 / 维护", defaultValue: 0, levels: ["几乎不清扫", "偶尔清理", "定期清理", "高频清扫"] }
];
