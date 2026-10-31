window.MossModel = (() => {
  const clamp01 = n => Math.max(0, Math.min(1, n));
  function calculate(values) {
    const n = key => (values[key] || 0) / 3;
    const waterAvail = .50*n('surface') + .28*n('humidity') + .22*n('substrate');
    const dryness = .28*n('light') + .20*n('wind') + .24*(1-n('humidity')) + .16*(1-n('surface')) + .12*(1-n('substrate'));
    const disturbance = .62*n('trample') + .38*n('cleaning');
    const moderateLight = clamp01(1 - Math.abs(n('light') - .30) / .70);
    const litterBuffer = values.litter === 3 ? .5 : n('litter') / 2;
    const support = .48*waterAvail + .22*n('nutrient') + .14*litterBuffer + .16*moderateLight;
    const moistureFit = clamp01(1 - Math.abs(n('surface') - .62) / .62);
    const rawState = .58*support + .20*moistureFit - .12*dryness - .26*disturbance;
    const score = Math.round(Math.max(0, Math.min(100, (.58*support + .20*moistureFit + .12*(1-dryness) + .10*(1-disturbance))*100)));
    let state;
    if (score >= 72) state = { code: "A", title: "状态舒展，活跃窗口较长", copy: "水分、光照与表面稳定性目前较为协调，苔藓更可能保持较连续的覆盖和较长的活跃时段。" };
    else if (score >= 52) state = { code: "B", title: "条件可用，平衡正在收窄", copy: "苔藓仍可能在补水后保持活性，但至少一项压力正在缩短活跃窗口或削弱覆盖连续性。" };
    else if (score >= 30) state = { code: "C", title: "间歇活跃，压力正在累积", copy: "干燥或表面扰动正在叠加。视觉状态转向斑驳，表示相对活性与覆盖连续性下降。" };
    else state = { code: "D", title: "脱水或受扰，连续性明显下降", copy: "水分窗口很窄，或附着表面被反复打断。这是相对生态压力提示，不是物种死亡判断。" };
    return { score, rawState, state, waterAvail, dryness, disturbance, support, moistureFit };
  }
  return { calculate };
})();
