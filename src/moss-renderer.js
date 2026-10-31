window.MossRenderer = (() => {
 function create(canvas,config) {
  const ctx=canvas.getContext('2d'),sets={},anchors=config.anchors;
  let group='shared',currentScore=0,targetScore=0,raf=0,lastTime=0,disposed=false;
  async function loadImage(path) {
   const response=await fetch(path);
   if(!response.ok) throw new Error('苔藓图片无法读取：'+path);
   const blob=await response.blob();
   const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);});
   return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('苔藓图片无法解码：'+path));img.src=data;});
  }
  const ready=Promise.all(Object.entries(config.imageSets).map(async([id,paths])=>{sets[id]=await Promise.all(paths.map(loadImage));}));
  function weights(score) {
   score=Math.max(0,Math.min(100,Number(score)||0));
   if(score<=anchors[0])return {lower:0,upper:0,mix:0};
   for(let i=1;i<anchors.length;i++)if(score<anchors[i])return {lower:i-1,upper:i,mix:(score-anchors[i-1])/(anchors[i]-anchors[i-1])};
   return {lower:anchors.length-1,upper:anchors.length-1,mix:0};
  }
  function paint(context,width,height,score){
   const images=sets[group];if(!images)throw new Error('苔藓图片组尚未就绪：'+group);
   const w=weights(score);context.clearRect(0,0,width,height);
   // 预乘透明色按权重相加，支持透明 PNG，不产生 source-over 双层叠色。
   context.save();context.globalCompositeOperation='lighter';
   const draw=(img,alpha)=>{const scale=Math.min(width/img.naturalWidth,height/img.naturalHeight),iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;context.globalAlpha=alpha;context.drawImage(img,(width-iw)/2,(height-ih)/2,iw,ih);};
   draw(images[w.lower],w.lower===w.upper?1:1-w.mix);if(w.upper!==w.lower)draw(images[w.upper],w.mix);context.restore();
  }
  function animate(time){
   const dt=lastTime?Math.min(60,time-lastTime):16;lastTime=time;
   currentScore+=(targetScore-currentScore)*Math.min(1,dt/Math.max(16,config.transitionMs/4));
   if(Math.abs(targetScore-currentScore)<.02)currentScore=targetScore;
   paint(ctx,canvas.width,canvas.height,currentScore);
   if(currentScore!==targetScore&&!disposed)raf=requestAnimationFrame(animate);else{raf=0;lastTime=0;}
  }
  return {ready,weights,
   setGroup(id){if(!sets[id])throw new Error('没有配置苔藓图片组：'+id);cancelAnimationFrame(raf);raf=0;lastTime=0;group=id;currentScore=targetScore=0;},
   update(result){targetScore=result.score;if(!raf)raf=requestAnimationFrame(animate);},
   capture(result){const snap=document.createElement('canvas');snap.width=360;snap.height=225;paint(snap.getContext('2d'),360,225,result.score);return snap.toDataURL('image/png');},
   dispose(){disposed=true;cancelAnimationFrame(raf);}
  };
 }
 return {create};
})();
