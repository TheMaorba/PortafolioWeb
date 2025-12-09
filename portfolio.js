<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Mateo Orozco Baldovino - Portafolio</title>
  <style>
    /* ---------------------------
       RESET Y VARIABLES
    --------------------------- */
    :root {
      --bg: #f8f9fa;
      --text: #2c3e50;
      --primary: #1e3a8a;
      --primary-light: #3b82f6;
      --card-bg: #ffffff;
      --card-shadow: rgba(0,0,0,.1);
    }

    /* DARK MODE VARIABLES */
    .dark-mode {
      --bg: #0f172a;
      --text: #e2e8f0;
      --primary: #60a5fa;
      --primary-light: #93c5fd;
      --card-bg: #1e293b;
      --card-shadow: rgba(255,255,255,.07);
    }

    *{margin:0;padding:0;box-sizing:border-box}
    body{
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height:1.6;
      color:var(--text);
      background:var(--bg);
      transition:background .3s,color .3s;
    }

    .container{max-width:1200px;margin:0 auto;padding:0 20px}

    /* ---------------------------
       BOTÓN DARK / LIGHT MODE
    --------------------------- */
    .theme-toggle {
      position:fixed;
      top:20px;
      right:20px;
      background:var(--primary);
      color:#fff;
      border:none;
      padding:.7rem 1rem;
      border-radius:20px;
      font-weight:bold;
      cursor:pointer;
      box-shadow:0 4px 10px var(--card-shadow);
      transition:.3s;
      z-index:999;
    }
    .theme-toggle:hover {
      transform:scale(1.07);
      background:var(--primary-light);
    }

    /* ---------------------------
       HEADER
    --------------------------- */
    header{
      background:linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%);
      color:#fff;
      padding:3rem 0;
      text-align:center;
      box-shadow:0 4px 15px rgba(0,0,0,.1);
      background-position:center center;
      transition:.3s;
    }

    .profile-section{display:flex;flex-direction:column;align-items:center;gap:1rem}

    .profile-img{
      width:150px;height:150px;border-radius:50%;
      border:4px solid #fff;
      box-shadow:0 4px 15px rgba(0,0,0,.2);
      overflow: hidden;
    }
    .actual-profile-pic {
      width:100%;height:100%;object-fit:cover;display:block;
    }

    /* NAV */
    nav{
      background:var(--card-bg);
      padding:1rem 0;
      box-shadow:0 2px 5px var(--card-shadow);
      position:sticky;top:0;z-index:100;
      transition:.3s;
    }
    nav ul{list-style:none;display:flex;justify-content:center;gap:2rem;flex-wrap:wrap}
    nav a{
      text-decoration:none;color:var(--text);
      font-weight:500;padding:.5rem 1rem;border-radius:25px;
      transition:all .3s;
    }
    nav a:hover,nav a.active{background:var(--primary-light);color:#fff;transform:translateY(-2px)}

    /* SECCIONES */
    section{padding:4rem 0;opacity:0;transform:translateY(30px);transition:all .6s}
    section.visible{opacity:1;transform:translateY(0)}
    .section-title{text-align:center;font-size:2.5rem;color:var(--primary);margin-bottom:3rem}
    
    /* ABOUT */
    .about-content{
      background:var(--card-bg);padding:3rem;border-radius:15px;
      box-shadow:0 5px 20px var(--card-shadow);text-align:center;
      max-width:800px;margin:0 auto;
      transition:.3s;
    }

    /* CARDS GENERALES */
    .skill-card,.software-card,.project-card,.cert-card{
      background:var(--card-bg);
      padding:2rem;
      border-radius:15px;
      box-shadow:0 5px 20px var(--card-shadow);
      transition:.3s;
    }
    .skill-card:hover,.software-card:hover,.project-card:hover,.cert-card:hover{
      transform:translateY(-10px);
      box-shadow:0 10px 30px var(--card-shadow);
    }

    /* GRID */
    .skills-grid, .software-grid, .projects-grid, .cert-grid {
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
      gap:2rem;
      margin-top:2rem;
    }

    /* SOFTWARE LEVEL */
    .software-level{width:100%;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;margin-top:.5rem}
    .software-level-fill{height:100%;background:linear-gradient(135deg,var(--primary-light),var(--primary));border-radius:3px}

    /* NUMBERS COUNTER */
    .numbers {
      display:flex;
      justify-content:center;
      gap:3rem;
      margin-top:2rem;
      flex-wrap:wrap;
    }
    .num-box {
      text-align:center;
      font-size:2rem;
      font-weight:bold;
      color:var(--primary);
    }
    .num-label {
      font-size:1rem;
      color:var(--text);
    }

    /* CERTIFICADOS */
    .cert-card h3 { color: var(--primary); }

    /* CONTACTO */
    footer{
      background:var(--primary);
      color:#fff;text-align:center;padding:2rem 0;margin-top:4rem;
    }

  </style>
</head>
<body>

<button class="theme-toggle" id="themeBtn">🌙 Modo oscuro</button>

<div id="app"></div>

<script>
/* -------------------------------------------
   PORTFOLIO DATA
------------------------------------------- */
const PORTFOLIO = {
  name: 'Mateo Orozco Baldovino',
  title: 'Analista de Datos',
  profilePic: 'Imagen/mateo.jpeg',

  about: [
    'Soy un analista de datos apasionado por transformar información compleja en insights accionables.',
    'Mi enfoque se centra en encontrar patrones ocultos en los datos y comunicar hallazgos de forma clara.'
  ],

  /* Animaciones numéricas */
  numbers: [
    { value: 4, label: "Proyectos Completados" },
    { value: 3, label: "Certificaciones" },
    { value: 2, label: "Años de Estudio" }
  ],

  skills: [
    {icon: '📊', title: 'Análisis de Datos', desc: 'Análisis estadístico y limpieza de datos.'},
    {icon: '📈', title: 'Visualización', desc: 'Dashboards en Tableau, Power BI y Python.'},
    {icon: '🐍', title: 'Python & R', desc: 'Machine learning, análisis avanzado y automatización.'},
    {icon: '🗄️', title: 'SQL & Databases', desc: 'Consultas complejas y optimización.'}
  ],

  software: [
    {name: 'Python', level: 90},
    {name: 'R', level: 85},
    {name: 'SQL', level: 90},
    {name: 'Power BI', level: 80},
    {name: 'Excel', level: 95},
  ],

  certifications: [
    {title: 'Data Analysis with Python', inst: 'IBM'},
    {title: 'SQL for Data Science', inst: 'University of California'},
    {title: 'Machine Learning Foundations', inst: 'Coursera'}
  ],

  projects: [
    {emoji:'📊', title:'Análisis Retail', desc:'Identificación de tendencias de ventas.', tags:['Python','Pandas','SQL']},
    {emoji:'🤖', title:'Modelo Predictivo', desc:'Predicción de churn con ML.', tags:['Python','Scikit-learn']},
  ]
};

/* Helper Node */
function el(tag, attrs={}, children=[]) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if(k==="class") node.className = v;
    else if(k==="html") node.innerHTML = v;
    else node.setAttribute(k,v);
  });
  children.forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return node;
}

/* ---------------------------
   SECCIONES
--------------------------- */

function buildHeader(d){
  return el("header",{},[
    el("div",{class:"container"},[
      el("div",{class:"profile-section"},[
        el("div",{class:"profile-img"},[
          el("img",{src:d.profilePic,class:"actual-profile-pic"})
        ]),
        el("h1",{html:d.name}),
        el("p",{html:d.title})
      ])
    ])
  ]);
}

function buildNumbers(d){
  const wrap = el("div",{class:"numbers"});
  d.numbers.forEach(n=>{
    wrap.appendChild(
      el("div",{class:"num-box"},[
        el("div",{class:"num", "data-target":n.value},["0"]),
        el("div",{class:"num-label"},[n.label])
      ])
    );
  });
  return el("section",{id:"stats"},[
    el("div",{class:"container"},[
      el("h2",{class:"section-title"},"Logros"),
      wrap
    ])
  ]);
}

function buildAbout(d){
  const box = el("div",{class:"about-content"});
  d.about.forEach(p => box.appendChild(el("p",{},[p])));
  return el("section",{id:"about"},[
    el("div",{class:"container"},[
      el("h2",{class:"section-title"},"Sobre mí"),
      box
    ])
  ]);
}

function buildSkills(d){
  const grid = el("div",{class:"skills-grid"});
  d.skills.forEach(s=>{
    grid.appendChild(
      el("div",{class:"skill-card"},[
        el("div",{class:"skill-icon",html:s.icon}),
        el("h3",{},[s.title]),
        el("p",{},[s.desc])
      ])
    );
  });
  return el("section",{id:"skills"},[
    el("div",{class:"container"},[
      el("h2",{class:"section-title"},"Habilidades"),
      grid
    ])
  ]);
}

function buildSoftware(d){
  const grid = el("div",{class:"software-grid"});
  d.software.forEach(s=>{
    grid.appendChild(
      el("div",{class:"software-card"},[
        el("h3",{},[s.name]),
        el("div",{class:"software-level"},[
          el("div",{class:"software-level-fill",style:`width:${s.level}%`})
        ])
      ])
    );
  });
  return el("section",{id:"software"},[
    el("div",{class:"container"},[
      el("h2",{class:"section-title"},"Software y herramientas"),
      grid
    ])
  ]);
}

function buildCerts(d){
  const grid = el("div",{class:"cert-grid"});
  d.certifications.forEach(c=>{
    grid.appendChild(
      el("div",{class:"cert-card"},[
        el("h3",{},[c.title]),
        el("p",{},[`Institución: ${c.inst}`])
      ])
    );
  });
  return el("section",{id:"certs"},[
    el("div",{class:"container"},[
      el("h2",{class:"section-title"},"Certificaciones"),
      grid
    ])
  ]);
}

function buildProjects(d){
  const grid = el("div",{class:"projects-grid"});
  d.projects.forEach(p=>{
    grid.appendChild(
      el("div",{class:"project-card"},[
        el("div",{class:"project-img",html:p.emoji}),
        el("div",{class:"project-content"},[
          el("h3",{},[p.title]),
          el("p",{},[p.desc]),
          el("div",{class:"project-tags"},p.tags.map(t=>el("span",{class:"tag"},[t])))
        ])
      ])
    );
  });
  return el("section",{id:"projects"},[
    el("div",{class:"container"},[
      el("h2",{class:"section-title"},"Proyectos"),
      grid
    ])
  ]);
}

function buildFooter(name){
  return el("footer",{},[
    el("p",{},[`© 2025 ${name}. Todos los derechos reservados.`])
  ]);
}

/* ---------------------------
   MODO OSCURO
--------------------------- */
document.getElementById("themeBtn").addEventListener("click",()=>{
  document.body.classList.toggle("dark-mode");
  const btn = document.getElementById("themeBtn");
  btn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Modo claro"
    : "🌙 Modo oscuro";
});

/* ---------------------------
   ANIMACIÓN DE NÚMEROS
--------------------------- */
function animateNumbers(){
  const nums = document.querySelectorAll(".num");
  nums.forEach(n=>{
    const target = +n.dataset.target;
    let count = 0;
    const step = target / 40;
    const interval = setInterval(()=>{
      count += step;
      if(count >= target){
        n.textContent = target;
        clearInterval(interval);
      } else {
        n.textContent = Math.floor(count);
      }
    },40);
  });
}

/* ---------------------------
   MOUNT APP
--------------------------- */
function mount(){
  const app = document.getElementById("app");

  app.appendChild(buildHeader(PORTFOLIO));
  app.appendChild(buildAbout(PORTFOLIO));
  app.appendChild(buildNumbers(PORTFOLIO));
  app.appendChild(buildSkills(PORTFOLIO));
  app.appendChild(buildSoftware(PORTFOLIO));
  app.appendChild(buildCerts(PORTFOLIO));
  app.appendChild(buildProjects(PORTFOLIO));
  app.appendChild(buildFooter(PORTFOLIO.name));

  animateNumbers();
}

mount();
</script>
</body>
</html>
