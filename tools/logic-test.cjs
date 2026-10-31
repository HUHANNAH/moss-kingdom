// 纯 Node 逻辑回归：虚拟 DOM，不代替真实浏览器视觉/拖动测试。
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),key='campus-moss-kingdom-progress-v2';
class Element {
 constructor(tag,attrs={}){this.tagName=tag;this.attrs=attrs;this.children=[];this.parent=null;this.text='';this.style={setProperty(){}};this.handlers={};this.hidden='hidden'in attrs;this.disabled='disabled'in attrs;this.value=attrs.value||'';this.dataset={};Object.keys(attrs).filter(k=>k.startsWith('data-')).forEach(k=>this.dataset[k.slice(5).replace(/-([a-z])/g,(_,a)=>a.toUpperCase())]=attrs[k]);}
 get id(){return this.attrs.id||'';}
 get className(){return this.attrs.class||'';} set className(v){this.attrs.class=v;}
 get classList(){const el=this;return{contains(c){return el.className.split(/\s+/).includes(c)},add(...cs){el.className=[...new Set([...el.className.split(/\s+/).filter(Boolean),...cs])].join(' ')},remove(...cs){el.className=el.className.split(/\s+/).filter(c=>!cs.includes(c)).join(' ')},toggle(c,force){const has=this.contains(c),on=force===undefined?!has:force;on?this.add(c):this.remove(c);return on;}};}
 set textContent(t){this.children=[];this.text=String(t);} get textContent(){return this.text+this.children.map(c=>c.textContent).join('');}
 set innerHTML(h){this.children=[];this.text='';parse(String(h),this);} get innerHTML(){return this.textContent;}
 append(...els){els.forEach(e=>{e.parent=this;this.children.push(e);});}appendChild(e){this.append(e);}
 setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k];}
 querySelectorAll(sel){return descendants(this).filter(e=>matches(e,sel));}querySelector(s){return this.querySelectorAll(s)[0]||null;}
 closest(sel){for(let e=this;e;e=e.parent)if(matches(e,sel))return e;return null;}
 click(){if(!this.disabled)this.onclick?.({target:this,preventDefault(){}});}
 dispatchEvent(event){this['on'+event.type]?.({...event,target:this});}
}
function descendants(e){return e.children.flatMap(c=>[c,...descendants(c)]);}
function matches(e,sel){
 const attr=sel.match(/\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]/);
 if(attr){if(!(attr[1]in e.attrs)&&!attr[1].startsWith('data-'))return false;const value=attr[1].startsWith('data-')?e.dataset[attr[1].slice(5).replace(/-([a-z])/g,(_,a)=>a.toUpperCase())]:e.attrs[attr[1]];if(value===undefined||(attr[2]!==undefined&&value!==attr[2]))return false;sel=sel.replace(attr[0],'');}
 const id=sel.match(/#([\w-]+)/);if(id&&e.attrs.id!==id[1])return false;
 const classes=[...sel.matchAll(/\.([\w-]+)/g)].map(m=>m[1]);if(classes.some(c=>!e.classList.contains(c)))return false;
 const tag=sel.match(/^[\w-]+/);return !tag||e.tagName===tag[0];
}
function parse(html,root){
 const stack=[root],voids=new Set(['img','input','meta','link','br','hr']);
 for(const token of html.matchAll(/<[^>]*>|[^<]+/g)){const t=token[0];if(t.startsWith('</')){if(stack.length>1)stack.pop();continue;}if(t.startsWith('<!'))continue;
 if(t.startsWith('<')){const m=t.match(/^<([\w-]+)/);if(!m)continue;const attrs={};for(const a of t.slice(m[0].length).matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=a[2]??'';const e=new Element(m[1],attrs);stack.at(-1).append(e);if(!voids.has(m[1])&&!t.endsWith('/>'))stack.push(e);
 }else stack.at(-1).text+=t;}
}
async function boot(store=new Map()){
 const doc=new Element('document');parse(fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,''),doc);
 doc.createElement=tag=>new Element(tag);doc.getElementById=id=>descendants(doc).find(e=>e.attrs.id===id)||null;doc.documentElement=doc.querySelector('html');doc.baseURI='http://127.0.0.1:4173/';doc.activeElement=null;
 const timers=[],errors=[],context={document:doc,console:{log(){},warn(){},error(...e){errors.push(e)}},URL,Set,Map,Event:class{constructor(type){this.type=type}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},MossRenderer:{create(){let group;return{ready:Promise.resolve(),dispose(){},setGroup(g){group=g},update(){},capture(result){return 'data:image/png;base64,'+Buffer.from(JSON.stringify({group,score:result.score})).toString('base64')}}}}};
 context.window=context;context.confirm=()=>true;context.scrollTo=()=>{};context.setTimeout=(fn,ms)=>{const t={fn,ms};timers.push(t);return t;};context.clearTimeout=t=>{const i=timers.indexOf(t);if(i>=0)timers.splice(i,1);};
 vm.createContext(context);
 for(const file of ['config/content.js','config/experience.js','config/layout.js','config/chronicles.js','config/department-model.js','config/moss-visual.js','src/department-model.js','src/app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
 await Promise.resolve();await Promise.resolve();await Promise.resolve();
 const get=id=>doc.getElementById(id),click=s=>{const e=doc.querySelector(s);assert(e,'缺失元素:'+s);e.click();};
 const change=(id,v)=>{const e=get('param-'+id);assert(e,'缺失参数:'+id);e.value=String(v);e.dispatchEvent(new context.Event('input'));};
 return{context,doc,get,click,change,timers,errors,store,saved:()=>JSON.parse(store.get(key)||'{}')};
}
(async()=>{
 let t=await boot(),c=t.context,logs=c.MOSS_CHRONICLES.logs;
 assert.equal(t.errors.length,0);
 t.click('[data-location="location-03"]');
 assert.equal(t.get('map-preview-title').textContent,'百隙平原');
 assert.equal(t.get('map-preview-hint').textContent,'这里的地面广阔而平坦，却被无数笔直的沟壑分割。');
 assert.match(t.get('map-preview-profile').textContent,/族人散居/);
 t.click('#enter-location');assert.match(t.doc.querySelector('.slot-hint').textContent,/苔藓的热闹我知道/);
 t.click('#switch-phase');
 const first=logs[0];t.change('water-all',2);
 assert(t.doc.querySelectorAll('.department-mention').find(e=>e.dataset.department==='water-all').classList.contains('is-correct'));
 assert(!t.doc.querySelectorAll('.department-control').some(e=>e.classList.contains('is-correct')));
 assert.equal(t.doc.querySelectorAll('.department-preview').flatMap(e=>e.querySelectorAll('span')).length,0);
 t.change('nutrition-all',1);t.change('travel-basin',3);
 assert(t.get('moss-observation').classList.contains('is-restored'));
 assert.match(t.doc.querySelector('label[for="param-travel-basin"]').textContent,/盆地远行部/);
 const history=JSON.stringify(t.saved().chronicleRecords[first.id]);
 t.change('water-all',0);assert.equal(JSON.stringify(t.saved().chronicleRecords[first.id]),history);
 for(const i of [3,1,5,2,4,0]){
  const log=logs[i];t.click('[data-log="'+log.id+'"]');
  assert.deepEqual(t.doc.querySelectorAll('.department-control').map(e=>e.dataset.department),Array.from(log.controls,x=>x.id));
  assert.equal(t.doc.querySelectorAll('.department-mention').length,log.paragraphs.join('').split('{').length-1);
  for(const control of log.controls){
   t.change(control.id,control.accept[0]);
   assert.equal(t.get('department-image-'+control.id).src,c.MOSS_CHRONICLES.departmentImages[control.department][control.accept[0]]);
   assert.equal(t.doc.querySelector('label[for="param-'+control.id+'"]').textContent,control.region+c.MOSS_KINGDOM_CONFIG.departments.find(d=>d.id===control.department).name);
  }
  assert(t.get('moss-observation').classList.contains('is-restored'));
 }
 assert.equal(Object.keys(t.saved().chronicleRecords).length,6);
 const saved=t.store;t=await boot(saved);assert.equal(t.errors.length,0);
 t.click('#switch-phase');assert.equal(Object.keys(t.saved().chronicleRecords).length,6);
 for(const log of logs){
  const marked=new Set(log.paragraphs.flatMap(p=>[...p.matchAll(/\{([\w-]+)\}/g)].map(m=>m[1])));
  assert.deepEqual([...marked].sort(),Array.from(log.controls,c=>c.id).sort());
  const scores=[];
  function enumerate(i,draft){
   if(i===log.controls.length){assert(c.DepartmentModel.isComplete(log,draft));scores.push(c.DepartmentModel.calculate(c.DepartmentModel.effectiveValues(log,draft)).score);return;}
   const control=log.controls[i];for(let n=control.accept[0];n<=control.accept[1];n++)enumerate(i+1,{...draft,[control.id]:n});
  }
  enumerate(0,{});
  console.log(log.date+': 合法组合状态范围 '+Math.min(...scores).toFixed(1)+'—'+Math.max(...scores).toFixed(1));
  if(log.id==='chronicle-01')assert(Math.min(...scores)>65&&Math.max(...scores)<86);
  if(log.id==='chronicle-04')assert(Math.max(...scores)<30);
 }
 // 同部门不同地区不会互相覆盖或共享答案。
 const multi={background:first.background,controls:[{id:'a',department:'water-mist',accept:[0,0]},{id:'b',department:'water-mist',accept:[3,3]}]};
 assert(c.DepartmentModel.isComplete(multi,{a:0,b:3}));
 assert.equal(c.DepartmentModel.effectiveValues(multi,{a:0,b:3})['water-mist'],1.5);
 assert(Number.isFinite(c.DepartmentModel.calculate(c.DepartmentModel.effectiveValues(multi,{a:0,b:3})).score));
 assert(!c.DepartmentModel.isComplete(multi,{a:0,b:0}));
 // 旧草稿完成不算正式版完成，第一阶段进度保持。
 const old={schema:4,placed:[],placedSlots:{'location-01':['original']},chronicleRecords:{'chronicle-01':{revision:1,values:first.background}},chronicleDrafts:{}};
 t=await boot(new Map([[key,JSON.stringify(old)]]));t.click('#switch-phase');t.change('water-all',1);
 assert.equal(Object.keys(t.saved().chronicleRecords).length,0);
 t.click('#switch-phase');t.click('[data-location="location-01"]');t.click('#enter-location');
 assert.equal(t.doc.querySelectorAll('.drop-slot.is-placed').length,1);
 assert.equal(t.errors.length,0);
 console.log('通过：正式六篇、地区标题、正文独立绑定且唯一高亮、图下文字移除、范围完成与刷新、历史不覆盖、四地点分句且不影响归位线索、同部门跨地区、旧版本兼容。');
 console.log('虚拟DOM检查不代表真实浏览器视觉验收。');
})().catch(error=>{console.error(error);process.exitCode=1;});


