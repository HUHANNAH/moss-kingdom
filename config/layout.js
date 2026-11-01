// 百分比坐标相对于地图或局部场景；x、y是左上角位置，width、height是尺寸。
window.MOSS_KINGDOM_LAYOUT = {
  mapHotspots: {
    "location-01": { x: 40, y: 40, width: 10, height: 10 },
    "location-02": { x: 55, y: 60, width: 10, height: 10 },
    "location-03": { x: 35, y: 72, width: 10, height: 10 },
    "location-04": { x: 72, y: 66, width: 10, height: 10 },
  },

  // 局部交互画布固定为10:7，缩放时各矩形等比变化，避免宽高被窗口分别拉伸。
  slotGroups: {
    "location-01": {
      "original": {
        hint: { x: 10, y: 13, width: 15, height: 28 },
        slot: { x: 27, y: 17, width: 13, height: 24 },
        feedback: { x: 10, y: 42, width: 32, height: 8 }
      },
      "new-growth": {
        hint: { x: 55, y: 51, width: 15, height: 28 },
        slot: { x: 72, y: 55, width: 13, height: 24 },
        feedback: { x: 55, y: 80, width: 32, height: 8 }
      }
    },

    "location-02": {
      "original": {
        hint: { x: 9, y: 26, width: 15, height: 28 },
        slot: { x: 26, y: 30, width: 13, height: 24 },
        feedback: { x: 9, y: 55, width: 32, height: 8 }
      },
      "energy": {
        hint: { x: 65, y: 55, width: 15, height: 28 },
        slot: { x: 82, y: 59, width: 13, height: 24 },
        feedback: { x: 65, y: 84, width: 32, height: 8 }
      }
    },

    "location-03": {
      "original": {
        hint: { x: 6, y: 11, width: 15, height: 28 },
        slot: { x: 23, y: 15, width: 13, height: 24 },
        feedback: { x: 6, y: 40, width: 32, height: 8 }
      },
      "water": {
        hint: { x: 66, y: 25, width: 15, height: 28 },
        slot: { x: 83, y: 29, width: 13, height: 24 },
        feedback: { x: 66, y: 54, width: 32, height: 8 }
      },
      "new-growth": {
        hint: { x: 10, y: 57, width: 15, height: 28 },
        slot: { x: 27, y: 61, width: 13, height: 24 },
        feedback: { x: 10, y: 86, width: 32, height: 8 }
      }
    },

    "location-04": {
      "original": {
        hint: { x: 12, y: 26, width: 15, height: 28 },
        slot: { x: 29, y: 30, width: 13, height: 24 },
        feedback: { x: 12, y: 55, width: 32, height: 8 }
      },
      "neighbours": {
        hint: { x: 66, y: 66, width: 15, height: 28 },
        slot: { x: 83, y: 70, width: 13, height: 24 },
        feedback: { x: 66, y: 57, width: 32, height: 8 }
      }
    },
  }
};
