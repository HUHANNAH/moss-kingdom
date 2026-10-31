// 游戏部门状态模型，不是生长率预测。答案范围不参与此计算。
window.MOSS_DEPARTMENT_MODEL_CONFIG = {
 weights: { "water-mist":.30, "litter-archive":.25, "light-watch":.12, "substrate-team":.10, "field-team":.15, reproduction:.08 },
 responses: {
  "water-mist":[.05,.5,.9,1],
  "litter-archive":[0,.38,.64,1],
  "light-watch":[0,.4,.8,1],
  "substrate-team":[.1,.45,.8,1],
  "field-team":[0,.4,.8,1],
  reproduction:[0,.4,.8,1]
 },
 shortagePenalty: { "water-mist":.12, "litter-archive":.10 }
};
