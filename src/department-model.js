// 与苔历答案无关：仅根据六部门运作档位计算画面状态。
window.DepartmentModel = (() => {
 const level = value => Math.max(0, Math.min(3, Math.round(Number(value) || 0)));
 function calculate(values) {
  const c = window.MOSS_DEPARTMENT_MODEL_CONFIG;
  let support=0, total=0, penalty=0;
  Object.entries(c.weights).forEach(([id,weight])=>{
   const n=Math.max(0,Math.min(3,Number(values[id])||0)),lo=Math.floor(n),hi=Math.ceil(n);
   const contribution=c.responses[id][lo]+(c.responses[id][hi]-c.responses[id][lo])*(n-lo);
   support += contribution*weight; total+=weight;
   if(n===0)penalty+=c.shortagePenalty[id]||0;
  });
  const score=Math.max(0,Math.min(100,(support/total-penalty)*100));
  const names=["苔命休矣","苔势不妙","苔还能行","苔然自若","优势在苔","苔的帝国"];
  const anchors=window.MOSS_KINGDOM_VISUAL.anchors;
  const nearest=anchors.reduce((best,a,i)=>Math.abs(a-score)<Math.abs(anchors[best]-score)?i:best,0);
  return {score,state:{title:names[nearest]}};
 }
 function effectiveValues(log,draft={}) {
  const values={...log.background};
  const groups={};
  log.controls.forEach(control=>{(groups[control.department]||(groups[control.department]=[])).push(level(draft[control.id]??control.initial??0));});
  // 同部门跨地区时先平均，不以最后一根杆覆盖其他地区。
  Object.entries(groups).forEach(([id,levels])=>{values[id]=levels.reduce((a,b)=>a+b,0)/levels.length;});
  return values;
 }
 function matches(control,value) { return Number.isInteger(value)&&value>=control.accept[0]&&value<=control.accept[1]; }
 function isComplete(log,values) { return log.controls.length>0&&log.controls.every(c=>matches(c,values[c.id])); }
 return {calculate,effectiveValues,matches,isComplete,level};
})();
