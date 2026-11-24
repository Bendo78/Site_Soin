/* L’Élan du Vivant · script commun : lumière de sous-bois, menu, formulaire, pages d'offres */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---------- Komorebi : taches de lumière à travers le feuillage ---------- */
  function rand(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}}
  function komorebi(c,o){
    if(!c)return null;
    const ctx=c.getContext('2d');let W=0,H=0,spots=[],motes=[],leafC=null,seen=true;const hand={x:-999,y:-999,on:0,t:0};
    function twig(lc,rnd,x0,y0,ang,len,blur,col){lc.filter='blur('+blur+'px)';lc.strokeStyle=col;lc.lineWidth=2;lc.beginPath();lc.moveTo(x0,y0);
      const x1=x0+Math.cos(ang)*len,y1=y0+Math.sin(ang)*len;lc.quadraticCurveTo((x0+x1)/2+20,(y0+y1)/2-10,x1,y1);lc.stroke();
      for(let u=.1;u<1;u+=.075){const x=x0+(x1-x0)*u,y=y0+(y1-y0)*u,side=(Math.round(u*13)%2?1:-1),l=(24+rnd()*34)*(o.leafScale||1),a=ang+side*(.7+rnd()*.5);
        lc.save();lc.translate(x,y);lc.rotate(a);lc.fillStyle=col;lc.beginPath();lc.moveTo(0,0);lc.quadraticCurveTo(l*.45,-l*.32,l,0);lc.quadraticCurveTo(l*.45,l*.32,0,0);lc.fill();lc.restore()}
      lc.filter='none'}
    function build(){
      const r=c.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
      W=r.width;H=r.height;if(!W||!H)return;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      const rnd=rand(o.seed||9),n=Math.round(Math.max(o.min||10,Math.min(o.max||70,W*H/(o.area||16000))));
      spots=Array.from({length:n},()=>({bx:W*(o.left+rnd()*(1.05-o.left)),by:H*rnd(),r:(18+rnd()*60)*(o.size||1),p:rnd()*6.28,s:.3+rnd()*.7,dx:0,dy:0}));
      motes=Array.from({length:o.motes||0},()=>({x:rnd()*W,y:rnd()*H,v:.08+rnd()*.25,p:rnd()*6.28,s:.6+rnd()*1.3}));
      leafC=document.createElement('canvas');leafC.width=Math.ceil(W*dpr);leafC.height=Math.ceil(H*dpr);
      const lc=leafC.getContext('2d');lc.setTransform(dpr,0,0,dpr,0,0);(o.twigs||[]).forEach(t=>twig(lc,rnd,W*t[0],H*t[1],t[2],Math.min(W,H)*t[3],t[4],t[5]));
    }
    function draw(time){
      if(!W)return;const t=reduce?4:time/1000;ctx.clearRect(0,0,W,H);
      if(o.beam){ctx.save();ctx.translate(W*.66,H*.42);ctx.rotate(.45);const bw=W*.16,g=ctx.createLinearGradient(-bw,0,bw,0);
        g.addColorStop(0,'rgba(251,241,210,0)');g.addColorStop(.35,'rgba(251,241,210,.10)');g.addColorStop(.5,'rgba(251,241,210,.24)');g.addColorStop(.65,'rgba(251,241,210,.10)');g.addColorStop(1,'rgba(251,241,210,0)');ctx.fillStyle=g;ctx.fillRect(-bw,-H*1.2,bw*2,H*2.4);ctx.restore()}
      ctx.globalCompositeOperation='lighter';
      hand.on+=((hand.t>0?1:0)-hand.on)*(reduce?1:.06);
      const sy=o.scroll?scrollY*o.scroll:0;
      spots.forEach(s=>{
        const wind=Math.sin(t*.35*s.s+s.p)*.5+Math.sin(t*.9*s.s+s.p*2)*.5;
        let x=s.bx+Math.sin(t*.25+s.p)*14,y=s.by+Math.cos(t*.2+s.p)*10;
        if(o.scroll){y=((y-sy)%(H+160)+H+160)%(H+160)-80}
        const dx=hand.x-x,dy=hand.y-y,d=Math.hypot(dx,dy),pull=hand.on*Math.max(0,1-d/320)*.55,k=reduce?1:.08;
        s.dx+=((dx*pull)-s.dx)*k;s.dy+=((dy*pull)-s.dy)*k;x+=s.dx;y+=s.dy;
        const a=(.10+.12*(wind*.5+.5)+pull*.25)*(o.alpha||1),r=s.r*(.85+.25*wind);
        const gr=ctx.createRadialGradient(x,y,0,x,y,r);
        gr.addColorStop(0,'rgba(251,236,190,'+a.toFixed(3)+')');gr.addColorStop(.5,'rgba(242,213,138,'+(a*.45).toFixed(3)+')');gr.addColorStop(1,'rgba(242,213,138,0)');
        ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(x,y,r*1.2,r*.8,s.p,0,6.2832);ctx.fill();
      });
      if(hand.on>.02){const gr=ctx.createRadialGradient(hand.x,hand.y,0,hand.x,hand.y,170);gr.addColorStop(0,'rgba(251,236,190,'+(.22*hand.on).toFixed(3)+')');gr.addColorStop(1,'rgba(242,213,138,0)');ctx.fillStyle=gr;ctx.fillRect(hand.x-170,hand.y-170,340,340)}
      motes.forEach(m=>{if(!reduce){m.y-=m.v;m.x+=Math.sin(t*.6+m.p)*.2;if(m.y<-4){m.y=H+4;m.x=Math.random()*W}}
        ctx.fillStyle='rgba(251,241,210,'+(.25+.3*Math.sin(t+m.p)).toFixed(2)+')';ctx.beginPath();ctx.arc(m.x,m.y,m.s,0,6.2832);ctx.fill()});
      ctx.globalCompositeOperation='source-over';
      const sw=reduce?0:Math.sin(t*.5+(o.seed||0))*6;ctx.save();ctx.translate(sw,sw*.4);ctx.drawImage(leafC,0,0,W,H);ctx.restore();
    }
    function loop(time){if(!c.isConnected)return;if(seen)draw(time);requestAnimationFrame(loop)}
    build();draw(0);
    if(!reduce){requestAnimationFrame(loop);if('IntersectionObserver' in window&&o.watch){new IntersectionObserver(es=>{seen=es[0].isIntersecting}).observe(o.watch)}}
    else if(o.scroll){addEventListener('scroll',()=>draw(0),{passive:true})}
    const onR=()=>{if(!c.isConnected){removeEventListener('resize',onR);return}build();draw(0)};addEventListener('resize',onR);
    if(o.hover){const el=o.hover;
      const move=e=>{const r=c.getBoundingClientRect();hand.x=e.clientX-r.left;hand.y=e.clientY-r.top;hand.t=1;if(reduce)draw(0)};
      const out=()=>{hand.t=0;if(reduce){hand.on=0;draw(0)}};
      el.addEventListener('pointermove',move);el.addEventListener('pointerdown',move);
      ['pointerleave','pointerup','pointercancel'].forEach(ev=>el.addEventListener(ev,out));}
    return {hand,draw,build};
  }
  const TW=[[1.02,-.02,2.35,.75,5,'rgba(6,16,10,.62)'],[1.03,.16,2.75,.62,7,'rgba(6,16,10,.5)'],[.84,-.04,1.95,.55,3,'rgba(6,16,10,.72)'],[1.01,.4,3.0,.48,9,'rgba(6,16,10,.42)'],[.95,-.05,2.15,.4,2,'rgba(4,12,8,.8)'],[1.04,.62,3.2,.36,11,'rgba(6,16,10,.35)']];

  /* Les rangées s'éclairent à mesure qu'on les lit */
  function lightRows(box){
    if(!box)return;const lc=document.createElement('canvas');lc.setAttribute('aria-hidden','true');box.prepend(lc);
    if('IntersectionObserver' in window&&!reduce){
      box.classList.add('dim');
      const light=komorebi(lc,{left:0,area:9000,max:40,min:16,motes:20,size:1.1,seed:44,watch:box,twigs:[[1.02,.05,2.6,.45,6,'rgba(6,16,10,.5)']]});
      const io=new IntersectionObserver(es=>es.forEach(e=>{e.target.classList.toggle('lit',e.isIntersecting);if(e.isIntersecting){const el=e.target;light.hand.x=lc.clientWidth*.3;light.hand.y=el.offsetTop+40+el.offsetHeight/2;light.hand.t=1}}),{rootMargin:'-35% 0px -35% 0px'});
      box.querySelectorAll('.row-i').forEach(p=>io.observe(p));
    }else komorebi(lc,{left:0,area:12000,max:30,min:12,motes:10,alpha:.7,seed:44});
  }

  /* Sommaire de page : la pastille suit la lecture */
  function pageNav(nav){
    if(!nav||!('IntersectionObserver' in window))return;
    const links=[...nav.querySelectorAll('a')],map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.remove('on'));const a=map.get(e.target.id);if(a){a.classList.add('on');a.scrollIntoView({block:'nearest',inline:'nearest'})}}}),{rootMargin:'-30% 0px -60% 0px'});
    map.forEach((a,id)=>{const s=$(id);if(s)io.observe(s)});
  }

  /* Effets d'une zone de page (rappelé après chaque affichage d'une offre) */
  function decorate(root){
    const ph=root.querySelector('.page-head');
    if(ph&&ph.querySelector('canvas'))komorebi(ph.querySelector('canvas'),{left:.4,area:18000,max:46,min:14,motes:22,beam:true,seed:12,hover:ph,watch:ph,twigs:TW.slice(0,4)});
    root.querySelectorAll('.halo').forEach(h=>komorebi(h.querySelector('canvas'),{left:0,area:6000,max:26,min:12,motes:14,size:.9,seed:33,hover:h,watch:h,leafScale:.8,twigs:[[1.02,0,2.45,.7,4,'rgba(6,16,10,.6)'],[-.02,.15,.5,.5,6,'rgba(6,16,10,.45)']]}));
    root.querySelectorAll('.rows[data-light]').forEach(lightRows);
    pageNav(root.querySelector('.pnav'));
  }
  function init(){
    komorebi($('veil'),{left:0,area:30000,max:44,min:14,motes:26,size:1.25,alpha:.8,scroll:.18,seed:21,twigs:[[1.03,.05,2.6,.5,10,'rgba(6,16,10,.38)'],[-.03,.72,-.35,.42,12,'rgba(6,16,10,.32)']]});
    const hero=document.querySelector('.hero');
    if(hero)komorebi(hero.querySelector('canvas'),{left:.25,area:16000,max:70,min:24,motes:40,beam:true,seed:9,hover:hero,watch:hero,twigs:TW});
    decorate(document);
    /* Menu mobile */

    const top=$('top'),bg=$('burger');
    if(top&&bg){
      const setMenu=o=>{top.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu')};
      bg.addEventListener('click',()=>setMenu(!top.classList.contains('open')));
      document.querySelectorAll('#menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
      addEventListener('keydown',e=>{if(e.key==='Escape'&&top.classList.contains('open')){setMenu(false);bg.focus()}});
    }

    /* Formulaire : prépare une demande à copier ou à envoyer par e-mail */
    const f=$('contactForm');
    if(f){
      const sel=f.elements.type,want=new URLSearchParams(location.search).get('sujet');
      if(want){const o=[...sel.options].find(x=>x.value===want);if(o)sel.value=want}
      const msg=$('formMsg'),req=$('request'),reqText=$('requestText'),mail=$('mailBtn'),TO='bonjour@elanduvivant.fr';
      f.addEventListener('submit',e=>{
        e.preventDefault();
        const name=f.elements.name.value.trim(),email=f.elements.email.value.trim(),type=sel.options[sel.selectedIndex].text,text=f.elements.message.value.trim();
        if(!name||!/^\S+@\S+\.\S+$/.test(email)){msg.hidden=false;msg.textContent='Indiquez votre nom et une adresse e-mail valide pour que je puisse vous répondre.';req.hidden=true;(name?f.elements.email:f.elements.name).focus();return}
        msg.hidden=true;
        reqText.textContent='Bonjour Odile,\n\nJe vous écris au sujet de : '+type+'.\n'+(text?'\n'+text+'\n':'')+'\n'+name+'\n'+email;
        if(mail)mail.href='mailto:'+TO+'?subject='+encodeURIComponent(type)+'&body='+encodeURIComponent(reqText.textContent);
        req.hidden=false;
      });
      const cb=$('copyBtn');
      if(cb)cb.addEventListener('click',()=>{
        navigator.clipboard.writeText(reqText.textContent).then(()=>{cb.textContent='Demande copiée'},()=>{
          const r=document.createRange();r.selectNodeContents(reqText);const s=getSelection();s.removeAllRanges();s.addRange(r);cb.textContent='Texte sélectionné, copiez-le'});
      });
    }
  }

  /* ---------- Pages d'offres : un stage ou le Refuge, rendus à partir de offres-data.js ---------- */
  const SEC=[['intro','le-stage','Le stage'],['why','pourquoi','Pourquoi venir'],['situations','situations','Pour quelles situations'],['dims','approche','L\'approche'],['steps','etapes','Les étapes'],['days','programme','Les trois jours'],['soin','soin','Le soin'],['mountain','montagne','La montagne'],['exps','experiences','Les expériences'],['approach','methode','La méthode'],['gains','apports','Ce que vous emportez'],['forWho','pour-qui','Pour qui'],['after','apres','Après le stage'],['practical','infos','Infos pratiques']];
  const contactUrl=o=>'index.html?sujet='+o.id+'#contact';
  function offerHTML(o,all){
    const isRefuge=o.kind==='refuge',secs=SEC.filter(s=>o[s[0]]);
    if(isRefuge){secs[0]=['intro','le-refuge','Le Refuge']}
    const H=[];
    H.push('<section class="page-head"><canvas aria-hidden="true"></canvas><div class="wrap">'+
      '<p class="crumb">'+(isRefuge?'<a href="index.html">Accueil</a> · Accompagnement individuel':'<a href="stages.html">Les stages collectifs</a> · Stage de 3 jours')+'</p>'+
      '<h1>'+esc(o.title)+'</h1><p class="hook">'+esc(o.hook)+'</p><p class="lead">'+esc(o.lead)+'</p>'+
      '<dl class="facts">'+o.facts.map(f=>'<div><dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd></div>').join('')+'</dl>'+
      '<div class="acts"><a class="btn" href="'+contactUrl(o)+'">'+esc(o.cta||'Je suis intéressé·e par ce stage')+'</a><a class="link" href="#infos">Voir les infos pratiques</a></div></div></section>');
    H.push('<nav class="pnav" aria-label="Sur cette page"><div class="wrap"><ul>'+secs.map(s=>'<li><a href="#'+s[1]+'">'+s[2]+'</a></li>').join('')+'</ul></div></nav>');
    secs.forEach(([k,id])=>{
      const d=o[k];let b='';
      if(k==='intro')b='<div class="split"><h2>'+esc(d.title)+'</h2><div class="prose">'+d.paras.map(p=>'<p>'+esc(p)+'</p>').join('')+'</div></div>';
      else if(k==='why'||k==='situations')b='<div class="head"><h2>'+esc(d.title)+'</h2></div><div class="reasons">'+d.items.map(i=>'<div><b>'+esc(i[0])+'</b><p>'+esc(i[1])+'</p></div>').join('')+'</div>';
      else if(k==='dims')b='<div class="head"><h2>'+esc(d.title)+'</h2>'+(d.intro?'<p>'+esc(d.intro)+'</p>':'')+'</div><div class="dims">'+d.items.map(i=>'<div class="dim'+(i[0]==='L\'esprit'?' esprit':'')+'"><h3>'+esc(i[0])+'<small>'+esc(i[1])+'</small></h3><p>'+esc(i[2])+'</p></div>').join('')+'</div>'+(d.outro?'<p class="outro">'+esc(d.outro)+'</p>':'');
      else if(k==='steps')b='<div class="split"><div class="prose"><h2>'+esc(d.title)+'</h2>'+(d.outro?'<p class="outro" style="margin-top:8px">'+esc(d.outro)+'</p>':'')+'</div><ol class="path">'+d.items.map(i=>'<li><div><b>'+esc(i[0])+'</b><span>'+esc(i[1])+'</span></div></li>').join('')+'</ol></div>';
      else if(k==='days')b='<div class="split"><h2>'+esc(d.title)+'</h2><ol class="path">'+d.items.map(i=>'<li><div><i>'+esc(i[0]).toUpperCase()+' · '+esc(i[1]).toUpperCase()+'</i><b>'+esc(i[2].charAt(0).toUpperCase()+i[2].slice(1))+'</b><span>'+esc(i[3])+'</span><span class="intent">Intention : '+esc(i[4].charAt(0).toLowerCase()+i[4].slice(1))+'</span></div></li>').join('')+'</ol></div>';
      else if(k==='soin')b='<div class="soin-box"><h2>'+esc(d.title)+'</h2><p>'+esc(d.text)+'</p></div>';
      else if(k==='mountain')b='<div class="split"><h2>'+esc(d.title)+'</h2><div class="prose">'+d.paras.map(p=>'<p>'+esc(p)+'</p>').join('')+'</div></div>';
      else if(k==='exps')b='<div class="head"><h2>'+esc(d.title)+'</h2><p>Quelques expériences que vous pourrez vivre pendant '+(isRefuge?'votre séjour':'ces trois jours')+'.</p></div><ol class="exps">'+d.items.map(i=>'<li><b>'+esc(i[0])+(i[1]?'<small>'+esc(i[1])+'</small>':'')+'</b><p>'+esc(i[2])+'</p></li>').join('')+'</ol>'+(d.note?'<p class="note">'+esc(d.note)+'</p>':'');
      else if(k==='approach')b='<div class="split"><h2>'+esc(d.title)+'</h2><div class="prose"><p>'+esc(d.text)+'</p></div></div>';
      else if(k==='gains')b='<div class="head"><h2>'+esc(d.title)+'</h2></div><ul class="gains">'+d.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>'+(d.outro?'<p class="outro">'+esc(d.outro)+'</p>':'');
      else if(k==='forWho')b='<div class="head"><h2>'+(isRefuge?'Pour qui ?':'Ce stage est fait pour vous si...')+'</h2>'+(d.note?'<p>'+esc(d.note)+'</p>':'')+'</div><ul class="chips">'+d.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>';
      else if(k==='after')b='<div class="split"><div class="prose"><h2>'+esc(d.title)+'</h2><p>'+esc(d.intro)+'</p></div><ol class="path">'+d.items.map(i=>'<li><div><i>'+esc(i[1]).toUpperCase()+'</i><b>'+esc(i[0])+'</b><span>'+esc(i[2])+'</span></div></li>').join('')+'</ol></div>';
      else if(k==='practical'){
        const side=d.includes?'<div class="side-box"><h3>L\'accompagnement comprend</h3><ul>'+d.includes.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul></div>':'';
        const rh=d.rhythm?'<div class="side-box"><h3>Le rythme des journées</h3><ul>'+d.rhythm.map(i=>'<li>'+i+'</li>').join('')+'</ul></div>':'';
        b='<div class="head"><h2>Infos pratiques</h2></div><div class="practical"><div><dl class="kv">'+d.rows.map(r=>'<div><dt>'+esc(r[0])+'</dt><dd'+(/Tarif/.test(r[0])&&/€/.test(r[1])?' class="big"':'')+'>'+esc(r[1])+'</dd></div>').join('')+'</dl>'+(d.note?'<p class="honest">'+esc(d.note)+'</p>':'')+'</div><div style="display:grid;gap:16px">'+side+rh+'</div></div>';
      }
      H.push('<section id="'+id+'"><div class="wrap">'+b+'</div></section>');
    });
    let sib='';
    if(!isRefuge&&all){const st=all.filter(x=>x.kind==='stage'),i=st.findIndex(x=>x.id===o.id),p=st[(i-1+st.length)%st.length],n=st[(i+1)%st.length];
      sib='<nav class="siblings" aria-label="Autres stages"><a href="stage-'+p.id+'.html"><small>Stage précédent</small><b>'+esc(p.short||p.title)+'</b></a><a href="stage-'+n.id+'.html"><small>Stage suivant</small><b>'+esc(n.short||n.title)+'</b></a></nav>'}
    H.push('<section class="closing-sec"><div class="wrap"><div class="closing"><h2>'+esc(o.closing.title)+'</h2><p>'+esc(o.closing.text)+'</p><div class="acts" style="justify-content:center"><a class="btn" href="'+contactUrl(o)+'">'+esc(o.cta||'Je suis intéressé·e par ce stage')+'</a>'+(isRefuge?'<a class="btn soft" href="stages.html">Voir les stages collectifs</a>':'<a class="btn soft" href="refuge.html">Préférer un accompagnement individuel</a>')+'</div><p class="sign">L\'Élan du Vivant · Retrouver son élan, choisir son chemin.</p></div>'+sib+'</div></section>');
    return H.join('');
  }

  window.Elan={komorebi,init,decorate,offerHTML,esc,lightRows,pageNav};
})();
