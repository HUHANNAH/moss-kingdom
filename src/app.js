(() => {
  const C = window.MOSS_KINGDOM_CONFIG, L = window.MOSS_KINGDOM_LAYOUT, H = window.MOSS_CHRONICLES;
  const $ = id => document.getElementById(id), STORAGE_KEY = 'campus-moss-kingdom-progress-v2';
  const state = {stage:'map', location:null, mapSelection:C.locations[0]?.id, mapHover:null, visited:new Set(), placed:new Set(), placedSlots:{}, selected:null, transitioning:false, logIndex:0, chronicleDrafts:{}, chronicleRecords:{}, legacy:{}};
  const E = window.MOSS_EXPERIENCE;
  Object.entries(E.paper).forEach(([key, path]) => document.documentElement.style.setProperty('--paper-' + key + '-image', 'url("' + new URL(path, document.baseURI).href + '")'));
  Object.entries(E.markers).forEach(([key, path]) => document.documentElement.style.setProperty('--marker-' + key, 'url("' + new URL(path, document.baseURI).href + '")'));
  let renderer, renderReady = false, imageFailure = null, imageLoadGeneration = 0;
  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({schema:4, placedSlots:state.placedSlots, placed:[...state.placed], visited:[...state.visited], chronicleDrafts:state.chronicleDrafts, chronicleRecords:state.chronicleRecords, chronicleIndex:state.logIndex, legacy:state.legacy}));
      $('save-status').hidden = true; return true;
    } catch(error) {
      console.error(error); $('save-status').hidden=false;
      $('save-status').textContent='浏览器未能保存进度；请检查存储权限和可用空间。当前页面仍可继续操作。'; return false;
    }
  }
  function validLevel(value) { return Number.isInteger(value) && value>=0 && value<=3; }
  function loadProgress() {
    try {
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      state.visited=new Set((Array.isArray(saved.visited)?saved.visited:[]).filter(id=>locationById(id)));
      const oldPlaced=new Set(Array.isArray(saved.placed)?saved.placed:[]);
      state.placedSlots={};
      C.locations.forEach(loc=>{
        const slots=saved.placedSlots?.[loc.id];
        state.placedSlots[loc.id]=Array.isArray(slots)?loc.slots.filter(slot=>slots.includes(slot.id)).map(slot=>slot.id)
          : oldPlaced.has(loc.id)?(C.locations.every(l=>oldPlaced.has(l.id))?loc.slots.map(slot=>slot.id):['original']):[];
        // 旧光能线索改成远行线索，不冒认新题已答。原记录仍在legacy中。
        if(saved.schema!==4 && loc.id==='location-02') state.placedSlots[loc.id]=state.placedSlots[loc.id].filter(id=>id!=='original');
      });
      state.placed=new Set(C.locations.filter(loc=>loc.slots.every(slot=>slotDone(loc.id,slot.id))).map(loc=>loc.id));
      state.legacy=saved.schema===4?(saved.legacy||{}):saved;
      state.logIndex=Number.isInteger(saved.chronicleIndex)?Math.max(0,Math.min(H.logs.length-1,saved.chronicleIndex)):0;
      H.logs.forEach(log=>{
        const draft=saved.chronicleDrafts?.[log.id]||{};
        state.chronicleDrafts[log.id]=Object.fromEntries(log.controls.map(c=>[c.id,validLevel(draft[c.id])?draft[c.id]:c.initial??0]));
        const record=saved.chronicleRecords?.[log.id];
        if(record?.revision===log.revision && record.values && DepartmentModel.isComplete(log,record.controlValues||{})) state.chronicleRecords[log.id]=record;
      });
    } catch(error) {
      console.error(error); $('save-status').hidden=false; $('save-status').textContent='原存档无法读取，未主动清除；请先备份存档再继续。';
    }
  }
  const locationById=id=>C.locations.find(loc=>loc.id===id);
  const currentLog=()=>H.logs[state.logIndex];
  function show(stage) {
    document.querySelectorAll('.stage').forEach(section=>section.classList.toggle('active',section.id==='stage-'+stage));
    state.stage=stage; window.scrollTo({top:0,behavior:'smooth'});
    const experiment=stage==='logs';
    $('switch-phase-image').src=experiment?E.navigation.toMap:E.navigation.toChronicle;
    $('switch-phase').setAttribute('aria-label',experiment?'返回地图':'进入苔历');
  }
  function renderMap() {
    if (!state.mapSelection || !locationById(state.mapSelection)) state.mapSelection = C.locations[0]?.id || null;
    const root = $('map-hotspots'); root.innerHTML = ''; $('map-progress').textContent = `${state.placed.size} / ${C.locations.length}`;
    C.locations.forEach((loc, i) => {
      const h = L.mapHotspots[loc.id], b = document.createElement('button');
      const status = state.placed.has(loc.id) ? 'is-done' : state.visited.has(loc.id) ? 'is-visited' : 'is-unvisited';
      b.className = `map-hotspot ${status} ${state.mapSelection === loc.id ? 'is-selected' : ''} ${state.mapHover === loc.id ? 'is-hovered' : ''}`;
      b.style.cssText = `left:${h.x}%;top:${h.y}%;width:${h.width}%;height:${h.height}%`;
      b.dataset.location = loc.id; b.setAttribute('aria-label', `${String(i + 1).padStart(2, '0')} ${loc.name}`); b.setAttribute('aria-pressed', String(state.mapSelection === loc.id));
      b.innerHTML = `<span class="marker-core"><i></i><b>${String(i + 1).padStart(2, '0')}</b></span>`;
      b.onclick = () => selectMapLocation(loc.id);
      b.onmouseenter = () => previewMapLocation(loc.id);
      b.onfocus = () => previewMapLocation(loc.id);
      const clearPreview = () => {
        if (document.activeElement === b) return;
        if (state.mapHover === loc.id) state.mapHover = null;
        b.classList.toggle('is-hovered', state.mapHover === loc.id);
        updateMapInspector(state.mapHover || state.mapSelection || loc.id);
      };
      b.onmouseleave = clearPreview;
      b.onblur = clearPreview;
      root.appendChild(b);
    });
    updateMapInspector(state.mapHover || state.mapSelection);
  }
  function selectMapLocation(id) {
    state.mapSelection = id; state.mapHover = null;
    document.querySelectorAll('.map-hotspot').forEach(button => {
      const selected = button.dataset.location === id;
      button.classList.toggle('is-selected', selected);
      button.classList.remove('is-hovered');
      button.setAttribute('aria-pressed', String(selected));
    });
    updateMapInspector(id);
  }
  function previewMapLocation(id) { state.mapHover = id; document.querySelectorAll('.map-hotspot').forEach(b => b.classList.toggle('is-hovered', b.dataset.location === id)); updateMapInspector(id); }
  function updateMapInspector(id) {
    const loc = locationById(id); if (!loc) return; const i = C.locations.indexOf(loc) + 1;
    $('map-preview-index').textContent = String(i).padStart(2, '0'); $('map-preview-title').textContent = loc.name; const sentences=(loc.mapDescription||'').match(/[^。]+。?/g)||[];
    $('map-preview-hint').textContent=sentences[0]||''; $('map-preview-profile').textContent=sentences.slice(1).join('\n');
    $('map-preview-status').textContent = state.placed.has(id) ? '已归位' : state.visited.has(id) ? '已查看' : '待调查';
    $('enter-location').textContent = state.placed.has(id) ? '再次查看地点' : '进入地点观察'; $('enter-location').classList.toggle('is-complete', state.placed.has(id));
  }
  function slotDone(locationId, slotId) { return (state.placedSlots[locationId] || []).includes(slotId); }
  function openLocation(id) {
    const loc = locationById(id); if (!loc || state.transitioning) return;
    state.location = id; state.mapSelection = id; state.visited.add(id); state.selected = null;
    $('detail-image').src = loc.detailImage; $('detail-image').alt = loc.name;
    $('location-feedback').textContent = state.placed.has(id) ? E.locationComplete : '';
    renderSlots(); renderDepartments(); saveProgress(); show('location');
  }
  function rectStyle(element, rect) {
    element.style.left = rect.x + '%'; element.style.top = rect.y + '%';
    element.style.width = rect.width + '%'; element.style.height = rect.height + '%';
  }
  function renderSlots() {
    const loc = locationById(state.location), root = $('scene-interactions'); root.innerHTML = '';
    $('location-counter').textContent = '已归位 ' + loc.slots.filter(slot => slotDone(loc.id, slot.id)).length + ' / ' + loc.slots.length;
    loc.slots.forEach((slot, i) => {
      const layout = L.slotGroups[loc.id][slot.id], done = slotDone(loc.id, slot.id), dep = C.departments.find(d => d.id === slot.department);
      const hint = document.createElement('article'); hint.className = 'hint-card slot-hint' + (done ? ' is-complete' : '');
      hint.innerHTML = '<h2>线索 ' + (i + 1) + (done ? ' · 已归位' : '') + '</h2><p></p>';
      hint.querySelector('p').textContent = slot.clue; rectStyle(hint, layout.hint);
      const button = document.createElement('button'); button.className = 'drop-slot' + (done ? ' is-placed' : '');
      button.dataset.slot = slot.id; button.setAttribute('aria-label', '线索' + (i + 1) + (done ? '，已归位，点击查看反馈' : '，放置已选部门'));
      button.innerHTML = done ? '<img src="' + dep.image + '" alt="' + dep.name + '"><span>' + dep.name + '</span>' : '<span>放置部门形象</span>';
      rectStyle(button, layout.slot);
      const feedback = document.createElement('p'); feedback.className = 'slot-feedback'; feedback.dataset.feedback = slot.id; feedback.setAttribute('aria-live', 'polite'); rectStyle(feedback, layout.feedback);
      button.ondragover = e => { if (!state.transitioning && !done) e.preventDefault(); };
      button.ondrop = e => { e.preventDefault(); place(e.dataTransfer.getData('text/plain'), slot.id); };
      button.onclick = () => {
        if (done) { if (!state.transitioning) { clearSlotFeedback(); feedback.textContent = slot.correct; feedback.classList.add('success'); } }
        else place(state.selected, slot.id);
      };
      root.append(hint, button, feedback);
    });
  }
  function clearSlotFeedback() {
    document.querySelectorAll('.slot-feedback').forEach(node => { node.textContent = ''; node.classList.remove('success', 'error'); });
  }
  function renderDepartments() {
    const root = $('department-list'), done = state.placed.has(state.location); root.innerHTML = ''; state.selected = null;
    $('selected-department').textContent = '未选择';
    C.departments.forEach(dep => {
      const card = document.createElement('button'); card.className = 'department-card' + (done ? ' is-muted' : '');
      card.draggable = !done; card.disabled = done; card.dataset.id = dep.id;
      card.innerHTML = '<img src="' + dep.image + '" alt="' + dep.name + '"><span><b>' + dep.name + '</b><small>' + dep.role + '</small></span>';
      card.onclick = () => selectDepartment(dep.id);
      card.ondragstart = e => { if (state.transitioning) e.preventDefault(); else e.dataTransfer.setData('text/plain', dep.id); };
      root.appendChild(card);
    });
  }
  function selectDepartment(id) {
    if (state.transitioning || state.placed.has(state.location)) return;
    state.selected = id; const dep = C.departments.find(x => x.id === id);
    $('selected-department').textContent = dep.name;
    document.querySelectorAll('.department-card').forEach(c => c.classList.toggle('is-selected', c.dataset.id === id));
  }
  function place(id, slotId) {
    if (!id || state.transitioning || slotDone(state.location, slotId)) return;
    const loc = locationById(state.location), slot = loc?.slots.find(s => s.id === slotId);
    if (!slot) return;
    clearSlotFeedback();
    if (id === slot.department) {
      const completed = state.placedSlots[loc.id] || (state.placedSlots[loc.id] = []); completed.push(slot.id);
      if (loc.slots.every(s => completed.includes(s.id))) state.placed.add(loc.id);
      renderSlots(); renderDepartments(); renderMap(); saveProgress();
      const feedback = document.querySelector('[data-feedback="' + slotId + '"]');
      feedback.textContent = slot.correct; feedback.classList.add('success');
      $('location-feedback').textContent = state.placed.has(loc.id) ? E.locationComplete : '';

    } else {
      const feedback = document.querySelector('[data-feedback="' + slotId + '"]');
      feedback.textContent = slot.incorrect; feedback.classList.add('error'); state.selected = null;
      $('selected-department').textContent = '未选择';
      document.querySelectorAll('.department-card').forEach(card => card.classList.remove('is-selected'));
    }
  }
  function validateConfig() {
    const ids=new Set(C.departments.map(dep=>dep.id));
    H.logs.forEach(log=>{
      const controls=new Set();
      log.controls.forEach(c=>{
        if(typeof c.id!=='string'||!c.id||typeof c.region!=='string'||!ids.has(c.department)||controls.has(c.id))throw new Error('苔历控制项编号、地区或部门无效：'+log.id);
        if(!Array.isArray(c.accept)||c.accept.length!==2||!c.accept.every(validLevel)||c.accept[0]>c.accept[1])throw new Error('档位范围无效：'+log.id);
        controls.add(c.id);
      });
      const mentions=new Set(log.paragraphs.flatMap(text=>[...text.matchAll(/\{([\w-]+)\}/g)].map(m=>m[1])));
      if(mentions.size!==controls.size||[...mentions].some(id=>!controls.has(id)))throw new Error('正文提及部门必须与控制项一致：'+log.id);
      ids.forEach(id=>{
        if(!validLevel(log.background[id]))throw new Error('缺少后台部门档位：'+log.id+' '+id);
        if(!Array.isArray(H.departmentImages[id])||H.departmentImages[id].length!==4)throw new Error('部门需要四张档位图：'+id);
      });
    });
  }
  function renderLogList() {
    const root=$('log-list'); root.innerHTML='';
    H.logs.forEach((log,i)=>{
      const button=document.createElement('button');
      button.className='log-tab'+(i===state.logIndex?' active':'')+(state.chronicleRecords[log.id]?' is-complete':'');
      button.dataset.log=log.id;
      button.setAttribute('aria-pressed',String(i===state.logIndex));
      button.innerHTML='<span>'+String(i+1).padStart(2,'0')+'</span><strong>'+log.date+'</strong><small>'+(state.chronicleRecords[log.id]?'已还原':'待还原')+'</small>';
      button.onclick=()=>{ state.logIndex=i; buildLogs(); saveProgress(); };
      root.appendChild(button);
    });
  }
  function renderChronicle() {
    const log=currentLog(), root=$('chronicle-text'); root.innerHTML='';
    $('log-title').textContent='苔历 '+log.date;
    log.paragraphs.forEach(text=>{
      const p=document.createElement('p');let cursor=0;
      for(const match of text.matchAll(/\{([\w-]+)\}/g)){
        const before=document.createElement('span');before.textContent=text.slice(cursor,match.index);p.appendChild(before);
        const name=document.createElement('span');name.className='department-mention';name.dataset.department=match[1];
        name.textContent=C.departments.find(d=>d.id===log.controls.find(c=>c.id===match[1]).department).name;p.appendChild(name);cursor=match.index+match[0].length;
      }
      const after=document.createElement('span');after.textContent=text.slice(cursor);p.appendChild(after);root.appendChild(p);
    });
  }
  function buildParameters() {
    const log=currentLog(), root=$('parameter-list'); root.innerHTML='';
    const draft=state.chronicleDrafts[log.id]||(state.chronicleDrafts[log.id]=Object.fromEntries(log.controls.map(c=>[c.id,c.initial??0])));
    // 仅遍历controls：未出现在本篇正文的部门绝不生成图片、名称或拉杆。
    log.controls.forEach(control=>{
      const id=control.id, dep=C.departments.find(d=>d.id===control.department), label=control.region+dep.name, row=document.createElement('article');
      row.className='parameter-row department-control';row.dataset.department=id;
      row.innerHTML='<div class="department-preview"><img id="department-image-'+id+'" alt="'+dep.name+'当前档位形象"></div><div class="department-adjust"><div class="parameter-label"><label for="param-'+id+'">'+label+'</label><output id="out-'+id+'"></output></div><p class="parameter-hint" id="hint-'+id+'"></p><div class="range-control"><input id="param-'+id+'" class="parameter-range" type="range" min="0" max="3" step="1" value="'+draft[id]+'" aria-label="'+label+'四档调节"><div class="range-ticks" role="group" aria-label="'+label+'档位">'+[0,1,2,3].map(n=>'<button type="button" data-level="'+n+'" aria-label="'+label+' '+n+'档">'+n+'</button>').join('')+'</div></div></div>';
      const input=row.querySelector('input');
      input.oninput=()=>{
        const value=DepartmentModel.level(input.value);input.value=value;draft[id]=value;
        updateObservation();saveProgress();
      };
      row.querySelectorAll('[data-level]').forEach(button=>{button.onclick=()=>{input.value=button.dataset.level;input.dispatchEvent(new Event('input',{bubbles:true}));};});
      root.appendChild(row);
    });
  }
  function updateObservation() {
    const log=currentLog(),draft=state.chronicleDrafts[log.id],values=DepartmentModel.effectiveValues(log,draft);
    const result=DepartmentModel.calculate(values),complete=DepartmentModel.isComplete(log,draft);
    log.controls.forEach(control=>{
      const id=control.id,value=draft[id],correct=DepartmentModel.matches(control,value),input=$('param-'+id),row=input.closest('.department-control');
      input.style.setProperty('--range-progress',value/3*100+'%');input.setAttribute('aria-valuetext',value+'档，'+H.levels[value]);
      $('out-'+id).textContent=value;$('hint-'+id).textContent=H.levels[value];
      const image=$('department-image-'+id); image.src=H.departmentImages[control.department][value];image.alt=control.region+C.departments.find(d=>d.id===control.department).name+'，'+value+'档';
      image.onerror=()=>{image.onerror=null;reportError(new Error('部门档位图未能加载：'+image.src));};
      // 正确高亮仅作用于正文，不给标题或控制行添加正确样式。
      row.querySelectorAll('[data-level]').forEach(button=>{const selected=Number(button.dataset.level)===value;button.classList.toggle('is-active',selected);button.setAttribute('aria-pressed',String(selected));});
      document.querySelectorAll('.department-mention').forEach(mention=>{if(mention.dataset.department===id)mention.classList.toggle('is-correct',correct);});
    });
    $('state-title').textContent=result.state.title;
    $('moss-observation').classList.toggle('is-restored',complete&&renderReady);
    if(renderReady)renderer.update(result);
    const existing=state.chronicleRecords[log.id];
    if(complete&&renderReady&&!existing){
      try{
        state.chronicleRecords[log.id]={revision:log.revision,date:log.date,paragraphs:[...log.paragraphs],values:{...values},controlValues:{...draft},ranges:log.controls.map(c=>({id:c.id,department:c.department,region:c.region,accept:[...c.accept]})),score:result.score,state:{...result.state},visual:renderer.capture(result),time:Date.now()};
        renderLogList();saveProgress();
      }catch(error){reportError(error);}
    }
    $('observation-status').textContent=!renderReady?(imageFailure?'苔藓图片加载失败，可以继续调节；修复图片后重新加载。':'苔藓图片正在加载，可以先调节部门。'):
      complete?(H.logs.every(l=>state.chronicleRecords[l.id])?'六篇苔历均已还原，可以继续切换和调试。':log.completion):
      existing?'本篇已完成并保存；现在是新的试调，不覆盖已保存结果。':'';
  }
  function buildLogs() { renderLogList(); renderChronicle(); buildParameters(); updateObservation(); }
  function startRenderer() {
    const generation=++imageLoadGeneration;
    renderReady=false;imageFailure=null;$('retry-images').hidden=true;
    if(renderer?.dispose)renderer.dispose();
    renderer=MossRenderer.create($('moss-canvas'),window.MOSS_KINGDOM_VISUAL);
    renderer.ready.then(()=>{
      if(generation!==imageLoadGeneration)return;
      renderer.setGroup('shared');renderReady=true;
      if(state.stage==='logs')updateObservation();
    }).catch(error=>{
      if(generation!==imageLoadGeneration)return;
      imageFailure=error;$('retry-images').hidden=false;reportError(error);
      if(state.stage==='logs')updateObservation();
    });
  }
  function reportError(error) {
    console.error(error);$('save-status').hidden=false;
    $('save-status').textContent='图片或配置未能读取。请检查素材路径，并通过启动网页.cmd打开网页；详细原因见浏览器控制台。';
  }
  function resetProgress() {
    if(!window.confirm('确定清除当前项目进度并重新开始吗？建议先导出备份。'))return;
    try{localStorage.removeItem(STORAGE_KEY);}catch(error){reportError(error);return;}
    state.placedSlots={};state.placed.clear();state.visited.clear();state.chronicleDrafts={};state.chronicleRecords={};state.legacy={};state.logIndex=0;state.location=null;
    renderMap();show('map');saveProgress();
  }
  $('enter-location').onclick=()=>openLocation(state.mapSelection);
  $('back-map').onclick=()=>{renderMap();show('map');};
  $('switch-phase').onclick=()=>{
    if(state.stage==='logs'){renderMap();show('map');}
    else{buildLogs();show('logs');}
  };
  $('reset-progress').onclick=resetProgress;
  $('retry-images').onclick=startRenderer;
  try{
    validateConfig();loadProgress();$('map-image').src=C.map.image;$('map-image').alt=C.map.alt;
    renderMap();show('map');startRenderer();
  }catch(error){reportError(error);}
})();
