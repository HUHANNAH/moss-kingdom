// 实际 Edge 浏览器回归；仅使用 Node 标准库，不安装依赖。
const {spawn}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'moss-ui-qa-'));
 const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9337','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
 let ws;
 try{
  let pages;for(let i=0;i<100;i++){try{pages=await(await fetch('http://127.0.0.1:9337/json')).json();if(pages.length)break;}catch{}await delay(100);}
  if(!pages?.length)throw Error('浏览器未就绪');
  ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
  let seq=0;const pending=new Map(),errors=[];ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+':'+m.params.exceptionDetails.exception?.description);});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  await send('Runtime.enable');await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  const assert=(ok,msg)=>{if(!ok)throw Error(msg);console.log('通过：'+msg);};
  const wait=async expression=>{for(let i=0;i<100;i++){if(await ev(expression))return;await delay(100);}throw Error('等待失败：'+expression);};
  await send('Page.navigate',{url:'http://127.0.0.1:4173'});
  await wait("document.querySelectorAll('.map-hotspot').length===5");
  const click=selector=>ev('document.querySelector('+JSON.stringify(selector)+').click()');
  const shot=async name=>{const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.mkdirSync(path.join(__dirname,'artifacts'),{recursive:true});fs.writeFileSync(path.join(__dirname,'artifacts',name+'.png'),Buffer.from(data,'base64'));};
  const logs=await ev('MOSS_CHRONICLES.logs'),locations=await ev('MOSS_KINGDOM_CONFIG.locations');
  assert(locations.length===4&&logs.length===6,'四个地点与六篇苔历');
  await shot('map');
  await click('#switch-phase');await wait("document.querySelector('#stage-logs').classList.contains('active')");
  await wait("document.querySelector('#retry-images').hidden&&!document.querySelector('#observation-status').textContent.includes('加载')");
  assert(await ev("document.querySelectorAll('.department-control').length===3&&!document.getElementById('param-field-team')&&!document.getElementById('department-image-field-team')"),'第一篇只显示水合、营养、远行，其他部门无图无杆');
  const set=async(id,value)=>ev("(()=>{const p=document.getElementById('param-"+id+"');p.value="+value+";p.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await set('water-all',2);
  assert(await ev("document.querySelector('.department-mention[data-department=water-all]').classList.contains('is-correct')"),'范围下限正确时文字高亮');
  await set('nutrition-all',1);await set('travel-basin',3);
  await wait("document.querySelector('#moss-observation').classList.contains('is-restored')");
  const record=await ev("JSON.stringify(JSON.parse(localStorage.getItem('campus-moss-kingdom-progress-v2')).chronicleRecords['chronicle-01'])");
  await set('water-all',0);
  assert(await ev("!document.querySelector('#moss-observation').classList.contains('is-restored')"),'离开范围取消当前发光');
  assert(record===await ev("JSON.stringify(JSON.parse(localStorage.getItem('campus-moss-kingdom-progress-v2')).chronicleRecords['chronicle-01'])"),'历史完成快照不覆盖');
  await shot('chronicle');
  for(const index of [5,2,4,1,3,0]){
   const log=logs[index];await click('[data-log="'+log.id+'"]');
   assert(await ev("document.querySelectorAll('.department-control').length")===(log.controls.length),'当前关只显示配置部门');
   for(const control of log.controls)await set(control.id,control.accept[0]);
   await wait("document.querySelector('#moss-observation').classList.contains('is-restored')");
  }
  assert(await ev("Object.keys(JSON.parse(localStorage.getItem('campus-moss-kingdom-progress-v2')).chronicleRecords).length===6&&!document.querySelector('#stage-archive')"),'六关均保存且没有第三阶段');
  await click('#switch-phase');
  await click('[data-location="location-03"]');await click('#enter-location');await shot('location');
  await click('.department-card[data-id="water-mist"]');await click('[data-slot="original"]');
  assert(await ev("document.querySelectorAll('.drop-slot.is-placed').length===0"),'错误归位不增加');
  await click('.department-card[data-id="substrate-team"]');await click('[data-slot="original"]');
  assert(await ev("document.querySelectorAll('.drop-slot.is-placed').length===1"),'原归位交互可用');
  await send('Page.reload');await wait("document.querySelectorAll('.map-hotspot').length===4");
  assert(await ev("document.querySelector('#stage-map').classList.contains('active')"),'刷新默认地图');
  await click('#switch-phase');await wait("document.querySelector('#stage-logs').classList.contains('active')");
  assert(record===await ev("JSON.stringify(JSON.parse(localStorage.getItem('campus-moss-kingdom-progress-v2')).chronicleRecords['chronicle-01'])"),'刷新保留记录');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await shot('mobile-chronicle');
  assert(await ev("document.documentElement.scrollWidth<=390"),'第二阶段窄屏无横向溢出');
  assert(errors.length===0,'无浏览器未捕获异常：'+errors.join(';'));
  console.log('浏览器回归通过。截图在tools/artifacts。');
 }finally{if(ws)ws.close();edge.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});

