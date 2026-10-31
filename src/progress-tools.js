// 仅在网址末尾加 #progress-tools 时显示；用于 file:// 到 http:// 的人工存档迁移。
(() => {
 const key='campus-moss-kingdom-progress-v2', panel=document.createElement('section');
 panel.className='progress-tools';
 panel.innerHTML='<h2>存档备份与迁移</h2><p>先在原网址导出，再在新网址导入。导入会替换新网址现有进度；不会修改原网址的数据。</p><button id="export-progress">导出存档</button><label>导入存档<input id="import-progress" type="file" accept=".json,application/json"></label><button id="close-progress-tools">关闭</button><p id="progress-tools-status" role="status"></p>';
 document.body.appendChild(panel);
 const toggle=()=>{panel.hidden=location.hash!=='#progress-tools';};
 window.addEventListener('hashchange',toggle);toggle();
 const status=panel.querySelector('#progress-tools-status');
 panel.querySelector('#close-progress-tools').onclick=()=>{location.hash='';};
 panel.querySelector('#export-progress').onclick=()=>{
  try {
   const raw=localStorage.getItem(key);
   if(!raw){status.textContent='当前网址没有已保存进度。请回到原来玩游戏的网址再导出。';return;}
   JSON.parse(raw);
   const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');
   a.href=url;a.download='苔藓调查存档.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   status.textContent='已生成存档下载，请妥善保留。';
  }catch(error){status.textContent='无法导出：'+error.message;}
 };
 panel.querySelector('#import-progress').onchange=async event=>{
  try {
   const file=event.target.files[0];if(!file)return;
   const raw=await file.text(),data=JSON.parse(raw);
   if(!data||!Array.isArray(data.placed)||!data.placed.every(id=>['location-01','location-02','location-03','location-04','location-05'].includes(id)))throw new Error('不是可识别的本项目存档。');
   if(!confirm('导入将替换当前网址的进度。确定继续吗？'))return;
   localStorage.setItem(key,raw);location.reload();
  }catch(error){status.textContent='无法导入，原进度未被主动清除：'+error.message;}
 };
})();
