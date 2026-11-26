/* Journal de L’Élan des Cimes : publications partagées entre le blog et l'espace praticienne (démonstration, enregistrées dans le navigateur) */
(function(){
  const KEY='elan-journal-v2';
  // « Photos » d'exemple dessinées, en attendant les vraies photos de la praticienne
  const ART={
    givre:'radial-gradient(60% 50% at 70% 25%,rgba(251,241,210,.75),transparent 60%),linear-gradient(180deg,#9FB6C9 0%,#D9E2E6 40%,#6E8463 41%,#3E5236 100%)',
    feu:'radial-gradient(40% 40% at 30% 35%,rgba(242,213,138,.55),transparent 70%),radial-gradient(30% 30% at 70% 65%,rgba(224,122,106,.35),transparent 70%),linear-gradient(160deg,#3B2A22,#6B4A33 60%,#2A1E18)',
    lumiere:'radial-gradient(45% 45% at 50% 45%,rgba(251,236,190,.85),rgba(242,213,138,.25) 45%,transparent 70%),linear-gradient(180deg,#1C3326,#0F1D15)',
    lin:'repeating-linear-gradient(100deg,rgba(255,255,255,.05) 0 3px,transparent 3px 14px),linear-gradient(170deg,#C9B79A,#8C7A5E 55%,#4F4433)',
    crepuscule:'radial-gradient(35% 30% at 60% 30%,rgba(179,163,218,.55),transparent 70%),linear-gradient(180deg,#2A2D3F,#1A1D2A)',
    mousse:'radial-gradient(70% 60% at 50% 100%,#5E7A4C,transparent 70%),radial-gradient(20% 20% at 30% 40%,rgba(251,241,210,.5),transparent 70%),linear-gradient(180deg,#23402E,#14281C)'
  };
  const THEMES=['Conseils','Stages','Nature','Méditations','Coulisses'];
  const day=n=>{const d=new Date();d.setHours(9,0,0,0);d.setDate(d.getDate()+n);return d.toISOString()};
  const SEED=[
    {id:'givre',date:day(-2),theme:'Nature',title:'Premières gelées sur les Bauges',photos:['images/saison-hiver.jpg','images/saison-automne.jpg'],
      intro:"Ce matin, le givre recouvrait les herbes de l'alpage. Avant l'hiver, la nature ralentit et rentre ses forces.",
      body:"C'est un bon moment pour faire de même. Nos corps suivent les saisons plus qu'on ne le croit : la fatigue de novembre n'est pas un défaut, c'est une invitation à se poser.\n\nCette semaine, je vous propose trois petites choses, à essayer sans pression.",
      tips:["Dormir une demi-heure de plus si vous le pouvez.","Marcher dix minutes dehors en journée, même par temps gris.","Boire une boisson chaude en silence, sans écran."],
      quote:"La nature ne se presse jamais, et pourtant tout s'y accomplit.",audience:'all',likes:12,
      comments:[{who:'Chloé P.',role:'client',date:day(-1),text:"Merci pour ces rappels, je vais essayer la boisson chaude sans écran ce soir."},{who:'Odile',role:'pro',date:day(-1),text:"Avec plaisir Chloé, dites-moi comment ça s'est passé."}]},
    {id:'respiration',date:day(-6),theme:'Conseils',title:'Une respiration pour le soir',photos:['images/lac-reflet.jpg'],
      intro:"Cinq minutes avant de dormir, pour aider le corps à passer en mode repos.",
      body:"Allongez-vous sur le dos, une main sur le ventre, l'autre sur la poitrine. Laissez d'abord la respiration se faire seule, sans la changer.",
      tipsMode:'list',tips:["Inspirez par le nez en comptant jusqu'à quatre : le ventre se soulève.","Retenez doucement deux secondes.","Expirez par la bouche en comptant jusqu'à six.","Recommencez huit fois, puis laissez la respiration redevenir naturelle."],
      quote:"",audience:'all',likes:21},
    {id:'merci-tete-coeur',date:day(-14),theme:'Stages',title:"Merci au groupe « De la tête au cœur »",photos:['images/salle-atelier-tableau.jpg','images/alpage-vaches-bauges.jpg'],
      intro:"Quatre personnes, trois jours, beaucoup de vent sur les crêtes et encore plus de rires.",
      body:"Merci à vous quatre pour la confiance et la qualité de vos échanges. La marche des cinq sens du deuxième matin restera, je crois, un beau souvenir pour chacun.\n\nVotre séance de suivi arrive dans quelques semaines : notez d'ici là ce qui change dans votre quotidien.",
      tips:["Gardez votre boîte à outils à portée de main.","Dix minutes dehors chaque jour, sans téléphone."],
      quote:"",audience:'clients',likes:9},
    {id:'mousse',date:day(-21),theme:'Méditations',title:'Ce que dit la mousse',photos:['images/sentier-foret.jpg'],
      intro:"Une pensée de saison, à lire lentement.",
      body:"La mousse pousse là où l'on ne se presse pas : au pied des arbres, sur les pierres que personne ne déplace. Elle ne force rien. Elle prend l'eau qui vient, la lumière qui passe.\n\nEt si, cette semaine, vous cherchiez un endroit de votre journée où rien ne presse ?",
      tips:[],quote:"Elle prend l'eau qui vient, la lumière qui passe.",audience:'all',likes:15},
    {id:'salle',date:day(-29),theme:'Coulisses',title:"La salle d'atelier s'habille pour l'hiver",photos:['images/salle-atelier.jpg'],
      intro:"Plaids, tisane et grandes fenêtres sur la montagne : tout est prêt pour les ateliers de l'après-midi.",
      body:"Après la marche du matin, on retrouve la salle au chaud. J'ai ajouté des coussins, un coin pour dessiner et une grande table pour les figurines. Dites-moi ce qui vous aiderait à vous sentir encore mieux accueilli.",
      tips:[],quote:"",audience:'all',likes:11},
    {id:'cinq-stages',date:day(-36),theme:'Stages',title:'Les cinq stages sont en ligne',photos:['images/chemin-vers-les-sommets.jpg'],
      intro:"Boussole intérieure, tête et cœur, rêves, incertitude, retraite : cinq thématiques de trois jours dans les Bauges.",
      body:"Chaque stage accueille quatre à six personnes, avec la marche le matin et les ateliers l'après-midi. Les dates seront annoncées ici et dans votre espace dès qu'elles seront fixées.",
      tips:["Pas besoin d'être sportif : la marche est un support, pas un défi.","Écrivez-moi si vous hésitez entre deux stages."],
      quote:"",audience:'all',likes:18}
  ];
  function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(s))return s}catch(e){}return JSON.parse(JSON.stringify(SEED))}
  function save(list){try{localStorage.setItem(KEY,JSON.stringify(list));return true}catch(e){return false}}
  function photoStyle(p){return p&&p.indexOf('art:')===0?'background:'+ART[p.slice(4)]:'background:#DCE3DA url(\''+p+'\') center/cover no-repeat'}
  window.Journal={load,save,reset(){try{localStorage.removeItem(KEY)}catch(e){}return load()},photoStyle,THEMES,ART};
})();
