// 六关暂用可编辑占位苔历。部门名在正文中用 {部门ID} 标记，网页自动显示正式中文名并控制高亮。
// controls只列本篇出现的部门；background为后台固定背景，不生成图片或拉杆。
// 初始档位不设为答案；accept=[最小值,最大值]，两端均包含。
window.MOSS_CHRONICLES = {
 departmentImages: {
        "water-mist": ["assets/production/department-states/water-mist-0.jpg", "assets/production/department-states/water-mist-1.jpg", "assets/production/department-states/water-mist-2.jpg", "assets/production/department-states/water-mist-3.png"],
        "litter-archive": ["assets/production/department-states/litter-archive-0.png", "assets/production/department-states/litter-archive-1.jpg", "assets/production/department-states/litter-archive-2.png", "assets/production/department-states/litter-archive-3.jpg"],
        "light-watch": ["assets/production/department-states/light-watch-0.png", "assets/production/department-states/light-watch-1.png", "assets/production/department-states/light-watch-2.jpg", "assets/production/department-states/light-watch-3.jpg"],
        "substrate-team": ["assets/production/department-states/substrate-team-0.jpg", "assets/production/department-states/substrate-team-1.jpg", "assets/production/department-states/substrate-team-2.png", "assets/production/department-states/substrate-team-3.jpg"],
        "field-team": ["assets/production/department-states/field-team-0.png", "assets/production/department-states/field-team-1.jpg", "assets/production/department-states/field-team-2.jpg", "assets/production/department-states/field-team-3.jpg"],
        reproduction: ["assets/production/department-states/reproduction-0.png", "assets/production/department-states/reproduction-1.png", "assets/production/department-states/reproduction-2.jpg", "assets/production/department-states/reproduction-3.png"] },
 levels:["停歇","低度运作","稳定运作","积极运作"],
 // 正文{控制项id}只点亮部门名；region仅用于拉杆标题。未标记部门仅为故事背景。
 logs:[
  {
    "id": "chronicle-01",
    "date": "6月3日",
    "revision": 2,
    "paragraphs": [
      "昨夜有雨，各地{water-all}的输水量增大。",
      "白日光照减弱，各地{nutrition-all}运作效率降低，但各地{interference-all}全力维持日常秩序，未影响各地日常。",
      "盆地边缘{travel-basin}前进势头良好，有望加强盆地之间联系。"
    ],
    "controls": [
      {
        "id": "water-all",
        "department": "water-mist",
        "region": "各地",
        "accept": [
          2,
          3
        ],
        "initial": 0
      },
      {
        "id": "nutrition-all",
        "department": "litter-archive",
        "region": "各地",
        "accept": [
          1,
          2
        ],
        "initial": 0
        },
        {
            "id": "interference-all",
            "department": "field-team",
            "region": "各地",
            "accept": [
                3,3
            ],
            "initial": 0
        },
      {
        "id": "travel-basin",
        "department": "light-watch",
        "region": "盆地",
        "accept": [
          2,
          3
        ],
        "initial": 0
      }
    ],
    "background": {
      "water-mist": 2,
      "litter-archive": 2,
      "light-watch": 2,
      "substrate-team": 2,
      "field-team": 2,
      "reproduction": 2
    },
    "completion": "这一页记载的部门状态已还原。"
  },
  {
    "id": "chronicle-02",
    "date": "6月10日",
    "revision": 2,
    "paragraphs": [
      "近来晴日较多，平原、盆地水合部储水量告急。",
      "谷地{water-valley}向平原、盆地输送水分储量。",
      "高原区受滴潮影响，水合部持续储水。",
      "同时，高原{diplomacy-highland}成功与水熊虫群落完成对接，允许水熊虫移民进入高原。",
      "高原{travel-highland}已成功连接高原与丛林区的道路，与平原区和盆地区的联系加速建设中。"
    ],
    "controls": [
      {
        "id": "water-valley",
        "department": "water-mist",
        "region": "谷地",
        "accept": [
          3,
          3
        ],
        "initial": 0
      },
      {
        "id": "diplomacy-highland",
        "department": "substrate-team",
        "region": "高原",
        "accept": [
          2,
          3
        ],
        "initial": 0
      },
      {
        "id": "travel-highland",
        "department": "light-watch",
        "region": "高原",
        "accept": [
          2,
          3
        ],
        "initial": 0
      }
    ],
    "background": {
      "water-mist": 2,
      "litter-archive": 1,
      "light-watch": 1,
      "substrate-team": 1,
      "field-team": 1,
      "reproduction": 1
    },
    "completion": "这一页记载的部门状态已还原。"
  },
  {
    "id": "chronicle-03",
    "date": "6月20日",
    "revision": 2,
    "paragraphs": [
      "高温晴日已连续10昼夜，王国各地储水量供给不足。",
      "各地{nutrition-all}光合活动缺少原料，难以进行。",
      "盆地、平原居民活动范围开始后退，各地{reproduction-all}、{travel-all}活动受限。",
      "荫谷区居民情况相对较好，但谷地{water-valley}储水量依旧持续减少，远行部停止前行活动，领土边界未有明显改变。",
      "高原区偶有滴潮，但储水情况依旧不乐观。",
      "营养部活动受限严重，水熊虫居民开始陆续撤离。"
    ],
    "controls": [
      {
        "id": "nutrition-all",
        "department": "litter-archive",
        "region": "各地",
        "accept": [
          0,
          1
        ],
        "initial": 3
      },
      {
        "id": "travel-all",
        "department": "light-watch",
        "region": "各地",
        "accept": [
          0,
          1
        ],
        "initial": 3
      },
      {
        "id": "reproduction-all",
        "department": "reproduction",
        "region": "各地",
        "accept": [
          0,
          1
        ],
        "initial": 3
      },
      {
        "id": "water-valley",
        "department": "water-mist",
        "region": "谷地",
        "accept": [
          1,
          2
        ],
        "initial": 0
      }
    ],
    "background": {
      "water-mist": 1,
      "litter-archive": 1,
      "light-watch": 0,
      "substrate-team": 1,
      "field-team": 1,
      "reproduction": 0
    },
    "completion": "这一页记载的部门状态已还原。"
  },
  {
    "id": "chronicle-04",
    "date": "6月25日",
    "revision": 2,
    "paragraphs": [
      "干旱已严重影响整个王国范围内的居民活动。",
      "已失去与平原区、高原区各部门联系，平原{travel-plain}与高原{diplomacy-highland}的活动均已停歇。",
      "盆地区水合部储水已见底，领土面积严重紧缩，盆地{reproduction-basin}也已停止活动。",
      "荫谷区居民靠谷地{water-valley}最后的储水量勉强维持缓慢的工作活动。",
      "王国进入静默期。"
    ],
    "controls": [
      {
        "id": "travel-plain",
        "department": "light-watch",
        "region": "平原",
        "accept": [
          0,
          0
        ],
        "initial": 3
      },
      {
        "id": "reproduction-basin",
        "department": "reproduction",
        "region": "盆地",
        "accept": [
          0,
          0
        ],
        "initial": 3
      },
      {
        "id": "diplomacy-highland",
        "department": "substrate-team",
        "region": "高原",
        "accept": [
          0,
          0
        ],
        "initial": 3
      },
      {
        "id": "water-valley",
        "department": "water-mist",
        "region": "谷地",
        "accept": [
          1,
          1
        ],
        "initial": 0
      }
    ],
    "background": {
      "water-mist": 0,
      "litter-archive": 0,
      "light-watch": 0,
      "substrate-team": 0,
      "field-team": 0,
      "reproduction": 0
    },
    "completion": "这一页记载的部门状态已还原。"
  },
  {
    "id": "chronicle-05",
    "date": "6月28日",
    "revision": 2,
    "paragraphs": [
      "天潮降临，静默期结束。",
      "各部门恢复正常活动，各地{water-all}有序将水分输送至其他各部门。",
      "营养部恢复活动后，持续支持各地{travel-all}、{reproduction-all}活动。",
      "统计过后，高原区、平原区、盆地区领土面积都有缩退，其中平原区缩退至原先的一半。",
      "荫谷区居民在静默期依旧维持低强度活动，领土区域维持情况较好。"
    ],
    "controls": [
      {
        "id": "water-all",
        "department": "water-mist",
        "region": "各地",
        "accept": [
          2,
          3
        ],
        "initial": 0
      },
      {
        "id": "travel-all",
        "department": "light-watch",
        "region": "各地",
        "accept": [
          2,
          3
        ],
        "initial": 0
      },
      {
        "id": "reproduction-all",
        "department": "reproduction",
        "region": "各地",
        "accept": [
          2,
          3
        ],
        "initial": 0
      }
    ],
    "background": {
      "water-mist": 2,
      "litter-archive": 2,
      "light-watch": 2,
      "substrate-team": 2,
      "field-team": 2,
      "reproduction": 2
    },
    "completion": "这一页记载的部门状态已还原。"
  },
  {
    "id": "chronicle-06",
    "date": "6月30日",
    "revision": 2,
    "paragraphs": [
      "降雨持续两个昼夜，盆地区{water-basin}储水量过大，水合部储水过载，损耗较大。",
      "居民活力下降，各地{nutrition-all}运作有所放缓。",
      "平原区正加强对积水的引导，平原{travel-plain}积极寻找新的延伸路径，协助改善过载情况。"
    ],
    "controls": [
      {
        "id": "water-basin",
        "department": "water-mist",
        "region": "盆地",
        "accept": [
          1,
          2
        ],
        "initial": 0
      },
      {
        "id": "travel-plain",
        "department": "light-watch",
        "region": "平原",
        "accept": [
          2,
          3
        ],
        "initial": 0
      },
      {
        "id": "nutrition-all",
        "department": "litter-archive",
        "region": "各地",
        "accept": [
          1,
          2
        ],
        "initial": 0
      }
    ],
    "background": {
      "water-mist": 1,
      "litter-archive": 1,
      "light-watch": 1,
      "substrate-team": 1,
      "field-team": 1,
      "reproduction": 1
    },
    "completion": "这一页记载的部门状态已还原。"
  }
]
};
