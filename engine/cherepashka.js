// Ведущий «Черепашка» (2D, с 25.10.2026 вместо Профессора Зар).
// Слои из characters/cherepashka/rig: body.png (тело без правой руки, рот закрашен), arm.png (правая рука с указкой), mouth.png (открытый рот).
// Координаты рига — пиксели исходной картинки 1080×1920, ноги стоят в точке (540,1770).
// Использование:
//   const H=makeHost(document.getElementById('hostLayer'));  await H.ready;
//   H.set({x,y,s,mouth,blink,t,arm,lean,hop,show});   // x,y — где стоят ноги на экране; s — масштаб (1 = 1540 px ростом)
//   mouth 0..2 (как VOICE.mouth), blink 0..1, arm — угол руки с указкой в градусах (− вверх к голове, + наружу)
(function(){
const R='../../characters/cherepashka/rig/';
const EYES=[{cx:447,cy:733,rx:68,ry:88},{cx:659,cy:735,rx:67,ry:88}];
const ARM={x:853,y:380,px:7,py:620};             // где лежит arm.png и точка плеча внутри неё
const MOUTH={x:465,y:835,w:175,h:115};
window.makeHost=function(parent){
  const d=document.createElement('div');d.className='cherepashka';
  d.style.cssText='position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:540px 1770px;pointer-events:none';
  const im=(src,css)=>{const i=new Image();i.src=R+src;i.style.cssText='position:absolute;'+css;d.appendChild(i);return i};
  const sh=document.createElement('div');sh.style.cssText='position:absolute;left:250px;top:1715px;width:580px;height:110px;border-radius:50%;background:radial-gradient(closest-side,rgba(20,30,26,.45),rgba(20,30,26,0))';d.appendChild(sh);
  const body=im('body.png','left:0;top:0;width:1080px;height:1920px;transform-origin:540px 1770px');
  const face=document.createElement('div');face.style.cssText='position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:540px 1770px';d.appendChild(face);
  const mo=im('mouth.png',`left:${MOUTH.x}px;top:${MOUTH.y}px;transform-origin:50% 12%`);face.appendChild(mo);
  const NS='http://www.w3.org/2000/svg';const sv=document.createElementNS(NS,'svg');sv.setAttribute('width',1080);sv.setAttribute('height',1920);sv.style.cssText='position:absolute;left:0;top:0';face.appendChild(sv);
  sv.innerHTML=`<defs>${EYES.map((e,i)=>`<clipPath id="chE${i}"><ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx+3}" ry="${e.ry+3}"/></clipPath>`).join('')}
   <radialGradient id="chLid" cx=".38" cy=".25" r=".8"><stop offset="0" stop-color="#fbf0d8"/><stop offset=".6" stop-color="#ead6b0"/><stop offset="1" stop-color="#bfa47a"/></radialGradient><filter id="chBl"><feGaussianBlur stdDeviation="7"/></filter></defs>
   <ellipse id="chPatch" cx="553" cy="878" rx="66" ry="26" fill="#efdfc0" opacity=".9" filter="url(#chBl)"/><path id="chSmile" d="M482 858 Q551 912 626 856" fill="none" stroke="#4a2414" stroke-width="13" stroke-linecap="round"/>
   <path id="chSmile2" d="M500 872 Q551 900 606 870" fill="none" stroke="#c98a6a" stroke-width="5" stroke-linecap="round" opacity=".5"/>
   ${EYES.map((e,i)=>`<g clip-path="url(#chE${i})"><rect id="chL${i}" x="${e.cx-e.rx-6}" y="${e.cy-e.ry-6}" width="${2*e.rx+12}" height="0" fill="url(#chLid)" rx="10"/><path id="chLl${i}" d="" stroke="#3a2416" stroke-width="7" fill="none" stroke-linecap="round"/></g>`).join('')}`;
  const arm=im('arm.png',`left:${ARM.x}px;top:${ARM.y}px;transform-origin:${ARM.px}px ${ARM.py}px`);
  parent.appendChild(d);
  const ready=Promise.all([arm,body,mo].map(i=>i.decode()));
  function set(o){
    const {x=540,y=1770,s=.35,mouth=0,blink=0,t=0,arm:ang=0,lean=0,hop=0,show=true,flip=false}=o;
    d.style.display=show?'block':'none';if(!show)return;
    const bob=Math.sin(t*2.4)*6, sq=1+Math.sin(t*4.8)*.008+hop*.04;
    d.style.transform=`translate(${x-540}px,${y-1770-hop*120}px) scale(${s*(flip?-1:1)},${s}) rotate(${lean+Math.sin(t*1.7)*1.2}deg)`;
    body.style.transform=`translateY(${bob}px) scale(${1/Math.sqrt(sq)},${sq})`;
    face.style.transform=body.style.transform;
    arm.style.transform=`translateY(${bob}px) rotate(${ang}deg)`;
    const op=mouth<=0?0:mouth>=2?1:.55;
    mo.style.display=op?'block':'none';mo.style.transform=`scaleY(${.35+.65*op})`;
    sv.getElementById('chSmile').style.display=op?'none':'block';sv.getElementById('chSmile2').style.display=op?'none':'block';sv.getElementById('chPatch').style.display=op?'none':'block';
    EYES.forEach((e,i)=>{const h=(2*e.ry+12)*.86*Math.min(1,blink);sv.getElementById('chL'+i).setAttribute('height',h);
      const yy=e.cy-e.ry-6+h;sv.getElementById('chLl'+i).setAttribute('d',blink>.03?`M${e.cx-e.rx} ${yy-4} Q${e.cx} ${yy+10} ${e.cx+e.rx} ${yy-4}`:'')});
    sh.style.opacity=1-hop*.5;sh.style.transform=`scale(${1-hop*.3})`;
  }
  return {el:d,ready,set};
};
})();
