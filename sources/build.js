/* Construit les pages du site L’Élan des Cimes.
   Lancer depuis le dossier du site :  node sources/build.js
   - sources/pages/*.html : le contenu de chaque page (en-tête et pied de page sont ajoutés ici)
   - offres-data.js       : stages, Refuge, séances individuelles et stages partenaires
   Le fichier clairiere-soins-energetiques.html est la copie de l'accueil utilisée pour l'aperçu Claude. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');

const ctx={window:{},matchMedia:()=>({matches:false})};vm.createContext(ctx);
vm.runInContext(read('offres-data.js'),ctx);vm.runInContext(read('elan.js'),ctx);
const {OFFRES,SEANCES,PARTENAIRES,Elan}=ctx.window,esc=Elan.esc;
const STAGES=OFFRES.filter(o=>o.kind==='stage');

const NAV=[['stages.html','Les stages'],['refuge.html','Le Refuge'],['seances.html','Séances individuelles'],['experience.html','L’expérience'],['qui-suis-je.html','Qui suis-je ?'],['blog.html','Le journal']];
const BRAND=`<a class="brand" href="index.html" aria-label="L’Élan des Cimes, accueil"><svg class="mark" viewBox="0 0 256 256" aria-hidden="true"><path d="M16 206L88 96C93 88 103 88 108 96L130 130L150 106C155 100 163 100 168 106L240 206Z" fill="var(--logo-1,#2F4A3E)"/><circle cx="130" cy="92" r="16" fill="var(--logo-2,#C77F62)"/><path d="M121 206C121 186 140 176 140 160C140 152 136 146 130 140C134 150 126 156 126 166C126 182 110 190 110 206Z" fill="var(--logo-3,#F7F5EF)"/></svg><span class="brand-txt"><b>L’Élan des Cimes</b><small>Retrouver son élan, choisir son chemin.</small></span></a>`;
const HEADER=active=>`<a class="skip" href="#main">Aller au contenu</a>
<header class="top" id="top">
  <div class="wrap">
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
    </button>
    ${BRAND}
    <ul class="menu" id="menu">
${NAV.map(([h,t])=>`      <li><a href="${h}"${h===active?' aria-current="page"':''}>${t}</a></li>`).join('\n')}
      <li class="m-only"><a href="index.html#contact">Me contacter</a></li>
    </ul>
    <a class="acct-link" href="espace-client.html"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="7" r="3.5"/><path d="M3.5 17c1-3.3 3.6-5 6.5-5s5.5 1.7 6.5 5" stroke-linecap="round"/></svg><span>Mon espace</span></a>
    <a class="btn" href="index.html#contact">Me contacter</a>
  </div>
</header>`;
const FOOTER=`<footer>
  <div class="wrap">
    <a class="brand foot-brand" href="index.html" aria-label="L’Élan des Cimes, accueil"><svg class="mark" viewBox="0 0 256 256" aria-hidden="true"><path d="M16 206L88 96C93 88 103 88 108 96L130 130L150 106C155 100 163 100 168 106L240 206Z" fill="var(--logo-1,#2F4A3E)"/><circle cx="130" cy="92" r="16" fill="var(--logo-2,#C77F62)"/><path d="M121 206C121 186 140 176 140 160C140 152 136 146 130 140C134 150 126 156 126 166C126 182 110 190 110 206Z" fill="var(--logo-3,#F7F5EF)"/></svg><span class="brand-txt"><b>L’Élan des Cimes</b><small>Retrouver son élan, choisir son chemin.</small></span></a>
    <nav aria-label="Pied de page"><a href="index.html">Accueil</a>${NAV.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}<a href="index.html#questions">Questions</a><a href="index.html#contact">Contact</a></nav>
    <p>© 2026 L’Élan des Cimes · Odile Bernhardt · Aillon-le-Vieux, massif des Bauges. Photographies : Odile Bernhardt. Coordonnées, dates et tarifs « à préciser » restent à confirmer.</p>
  </div>
</footer>`;
const HEAD=(title,desc)=>`<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="icon" href="images/logo-col.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="elan.css">
<script>(function(){var p=null;try{p=new URLSearchParams(location.search).get("palette")}catch(e){}if(p===null)p="sousbois";if(p&&p!=="charte")document.documentElement.dataset.palette=p})()</script>`;
const BODY=(active,main)=>`${HEADER(active)}
<main id="main">
${main}
</main>
${FOOTER}
<script src="elan.js"></script>
<script>Elan.init()</script>`;
const page=(title,desc,active,main)=>`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${HEAD(title,desc)}
</head>
<body>
${BODY(active,main)}
</body>
</html>
`;

const fact=(o,k)=>(o.facts.find(f=>f[0]===k)||[])[1]||'';
const stagesList=()=>`<ul class="cards">
${STAGES.map(o=>`  <li><a href="stage-${o.id}.html"><img src="images/${o.photo}.jpg" alt="${esc(o.photoAlt)}" loading="lazy" width="1200" height="900"><span class="body"><h3>${esc(o.title)}</h3><span class="hook">${esc(o.hook)}</span><span class="meta"><span>3 jours</span><span>${esc(fact(o,'Groupe'))}</span>${/€/.test(fact(o,'Tarif'))?`<span>${esc(fact(o,'Tarif'))}</span>`:''}</span><p>${esc(o.card)}</p><span class="go">Découvrir ce stage</span></span></a></li>`).join('\n')}
</ul>`;
const stagesRows=()=>`<ul class="stage-rows">
${STAGES.map(o=>`  <li><a href="stage-${o.id}.html"><img src="images/${o.photo}.jpg" alt="" loading="lazy" width="1200" height="900"><span class="t"><h3>${esc(o.title)}</h3><span class="hook">${esc(o.hook)}</span></span><span class="d"><p>${esc(o.card)}</p><span class="go">Découvrir ce stage</span></span><span class="meta"><b>3 jours</b><span>${esc(fact(o,'Groupe'))}</span>${/€/.test(fact(o,'Tarif'))?`<span>${esc(fact(o,'Tarif'))}</span>`:''}</span></a></li>`).join('\n')}
</ul>`;
const seancesList=()=>`<div class="reasons">
${SEANCES.map(s=>`  <div id="${s.id}"><b>${esc(s.titre)}</b><p class="quote" style="font-size:1.2rem;margin-bottom:8px">${esc(s.accroche)}</p><p>${esc(s.texte)}</p><p style="margin-top:10px;font-size:.9375rem"><strong>Pour qui :</strong> ${esc(s.pour)}<br><strong>Outils :</strong> ${esc(s.outils)}<br><strong>Durée et tarif :</strong> à préciser</p><p style="margin-top:14px"><a class="btn" href="index.html?sujet=${s.id}#contact">Prendre rendez-vous</a></p></div>`).join('\n')}
</div>`;
const partenairesList=()=>PARTENAIRES.length?`<ul class="cards">
${PARTENAIRES.map(p=>`  <li><a href="${p.lien||'index.html?sujet=partenaire#contact'}"><span class="body">${p.exemple?'<span class="tag">Exemple à remplacer</span>':''}<h3>${esc(p.titre)}</h3><span class="hook">Avec ${esc(p.partenaire)}</span><span class="meta"><span>${esc(p.dates)}</span><span>${esc(p.format)}</span><span>${esc(p.tarif)}</span></span><p>${esc(p.texte)}</p><span class="go">${p.lien?'En savoir plus':'Me demander les détails'}</span></span></a></li>`).join('\n')}
</ul>`:'<p class="muted">Aucun stage partenaire n’est programmé pour le moment.</p>';
const contactOptions=()=>STAGES.map(o=>`<option value="${o.id}">Le stage « ${esc(o.short||o.title)} »</option>`).join('')+`<option value="refuge">Le Refuge des Possibles</option>`+SEANCES.map(s=>`<option value="${s.id}">Une séance : ${esc(s.titre.toLowerCase())}</option>`).join('')+`<option value="partenaire">Un stage avec un partenaire</option><option value="question" selected>Faire connaissance ou poser une question</option>`;

const out=[];
const write=(f,html)=>{fs.writeFileSync(path.join(ROOT,f),html);out.push(f)};
for(const f of fs.readdirSync(path.join(__dirname,'pages'))){
  let src=fs.readFileSync(path.join(__dirname,'pages',f),'utf8');
  const m=src.match(/^<!--(\{[\s\S]*?\})-->\n?/);const meta=JSON.parse(m[1]);src=src.slice(m[0].length);
  src=src.split('{{STAGES_LIGNES}}').join(stagesRows()).split('{{STAGES}}').join(stagesList()).split('{{CONTACT_OPTIONS}}').join(contactOptions()).split('{{SEANCES}}').join(seancesList()).split('{{PARTENAIRES}}').join(partenairesList());
  write(f,page(meta.title,meta.desc,meta.active||f,src.trim()));
}
for(const o of OFFRES){
  const f=o.kind==='refuge'?'refuge.html':'stage-'+o.id+'.html';
  write(f,page(o.title+' · L’Élan des Cimes',o.lead,o.kind==='refuge'?'refuge.html':'stages.html',Elan.offerHTML(o,OFFRES)));
}
const home=read('index.html');
const art=HEAD(home.match(/<title>(.*?)<\/title>/)[1],home.match(/<meta name="description" content="(.*?)">/)[1])+'\n'+home.split('<body>\n')[1].split('\n</body>')[0]+'\n';
write('clairiere-soins-energetiques.html',art);
console.log('Pages construites :',out.join(', '));
