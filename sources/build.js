/* Construit les pages du site L’Élan du Vivant.
   Lancer depuis le dossier du site :  node sources/build.js
   - sources/pages/*.html : le contenu de chaque page (en-tête et pied de page sont ajoutés ici)
   - offres-data.js       : le texte des stages et du Refuge, une page est créée pour chacun
   Le fichier clairiere-soins-energetiques.html est la copie de l'accueil utilisée pour l'aperçu Claude. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');

// Charger les offres et le rendu des pages d'offres (le même code que dans le navigateur)
const ctx={window:{},matchMedia:()=>({matches:false})};vm.createContext(ctx);
vm.runInContext(read('offres-data.js'),ctx);vm.runInContext(read('elan.js'),ctx);
const OFFRES=ctx.window.OFFRES,Elan=ctx.window.Elan,esc=Elan.esc;
const STAGES=OFFRES.filter(o=>o.kind==='stage'),REFUGE=OFFRES.find(o=>o.kind==='refuge');

const NAV=[['experience.html','L’expérience'],['stages.html','Les stages'],['refuge.html','Le Refuge'],['qui-suis-je.html','Qui suis-je ?'],['blog.html','Le journal']];
const SPRITE=`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <!-- Emblème : deux crêtes des Bauges, un sentier qui monte, le soleil -->
  <symbol id="mark" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill="none" stroke="var(--brume-2)" stroke-width="1.2"/>
    <circle cx="20" cy="20" r="11" fill="rgba(242,213,138,.16)"/>
    <path d="M6.5 27.5l7.5-9 4.5 4.5 6.5-9 8.5 13.5" fill="none" stroke="var(--mousse)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M14.5 33.5c3-1.5 6-3.4 8.5-7.5" fill="none" stroke="var(--lumiere)" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="1.4 2.4"/>
    <circle cx="27.5" cy="10.5" r="2.6" fill="var(--lumiere)"/>
  </symbol>
</svg>`;
const BRAND=(tag)=>`<a class="brand" href="index.html"><svg aria-hidden="true"><use href="#mark"/></svg><span><b>L’Élan du Vivant</b><small>${tag||'MARCHE · ACCOMPAGNEMENT · BAUGES'}</small></span></a>`;
const HEADER=active=>`<a class="skip" href="#main">Aller au contenu</a>
<header class="top" id="top">
  <div class="wrap">
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
    </button>
    ${BRAND()}
    <ul class="menu" id="menu">
${NAV.map(([h,t])=>`      <li><a href="${h}"${h===active?' aria-current="page"':''}>${t}</a></li>`).join('\n')}
      <li class="m-only"><a href="index.html#contact">Me contacter</a></li>
    </ul>
    <a class="acct-link" href="espace-client.html"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10" cy="7" r="3.5"/><path d="M3.5 17c1-3.3 3.6-5 6.5-5s5.5 1.7 6.5 5" stroke-linecap="round"/></svg><span>Mon espace</span></a>
    <a class="btn" href="index.html#contact">Me contacter</a>
  </div>
</header>`;
const FOOTER=`<footer>
  <div class="wrap">
    ${BRAND()}
    <nav aria-label="Pied de page"><a href="index.html">Accueil</a>${NAV.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}<a href="index.html#questions">Questions</a><a href="index.html#contact">Contact</a></nav>
    <p>© 2026 L’Élan du Vivant · Odile Bernhardt · Aillon-le-Vieux, massif des Bauges. Coordonnées, dates et tarifs « à préciser » restent à confirmer.</p>
  </div>
</footer>`;
const HEAD=(title,desc)=>`<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap">
<link rel="stylesheet" href="elan.css">`;
const BODY=(active,main)=>`${SPRITE}
<canvas id="veil" aria-hidden="true"></canvas>
${HEADER(active)}
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

// Liste des stages, partagée entre l'accueil et la page des stages
const stagesList=()=>`<ul class="stages">
${STAGES.map(o=>`  <li><a href="stage-${o.id}.html"><h3>${esc(o.title)}<small>${esc(o.hook)}</small></h3><p>${esc(o.card)}<span class="go">Découvrir ce stage</span></p><span class="meta"><b>3 jours</b><span>${esc(o.facts.find(f=>f[0]==='Groupe')[1])}</span>${/€/.test((o.facts.find(f=>f[0]==='Tarif')||[])[1]||'')?`<span>${esc(o.facts.find(f=>f[0]==='Tarif')[1])}</span>`:''}</span></a></li>`).join('\n')}
</ul>`;
const contactOptions=()=>STAGES.map(o=>`<option value="${o.id}">Le stage « ${esc(o.short||o.title)} »</option>`).join('')+`<option value="refuge">Le Refuge des Possibles (accompagnement individuel)</option><option value="question" selected>Faire connaissance ou poser une question</option>`;

const out=[];
const write=(f,html)=>{fs.writeFileSync(path.join(ROOT,f),html);out.push(f)};

// Pages écrites à la main
for(const f of fs.readdirSync(path.join(__dirname,'pages'))){
  let src=fs.readFileSync(path.join(__dirname,'pages',f),'utf8');
  const m=src.match(/^<!--(\{[\s\S]*?\})-->\n?/);const meta=JSON.parse(m[1]);src=src.slice(m[0].length);
  src=src.replace('{{STAGES}}',stagesList()).replace('{{CONTACT_OPTIONS}}',contactOptions());
  write(f,page(meta.title,meta.desc,meta.active||f,src.trim()));
}
// Une page par stage, et le Refuge
for(const o of OFFRES){
  const f=o.kind==='refuge'?'refuge.html':'stage-'+o.id+'.html';
  write(f,page(o.title+' · L\'Élan du Vivant',o.lead,o.kind==='refuge'?'refuge.html':'stages.html',Elan.offerHTML(o,OFFRES)));
}
// Copie de l'accueil pour l'aperçu Claude (sans les balises de document)
const home=read('index.html');
const art=HEAD(home.match(/<title>(.*?)<\/title>/)[1],home.match(/<meta name="description" content="(.*?)">/)[1])+'\n'+home.split('<body>\n')[1].split('\n</body>')[0]+'\n';
write('clairiere-soins-energetiques.html',art);
console.log('Pages construites :',out.join(', '));
