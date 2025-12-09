import React, { useState, useEffect, useRef } from 'react';

// Datos del portafolio (fácil de editar)
const PORTFOLIO = {
  name: 'Mateo Orozco Baldovino',
  title: 'Analista de Datos',
  about: [
    'Soy un analista de datos apasionado por transformar información compleja en insights accionables. Con experiencia en el manejo de grandes volúmenes de datos, me especializo en crear visualizaciones claras y análisis profundos que impulsan la toma de decisiones estratégicas.',
    'Mi enfoque se centra en encontrar patrones ocultos en los datos y comunicar hallazgos de manera efectiva a equipos técnicos y no técnicos.'
  ],
  skills: [
    {icon: '📊', title: 'Análisis de Datos', desc: 'Experiencia en análisis estadístico, limpieza de datos, y extracción de insights valiosos para la toma de decisiones.'},
    {icon: '📈', title: 'Visualización', desc: 'Creación de dashboards interactivos y reportes visuales utilizando herramientas como Tableau, Power BI y Python.'},
    {icon: '🐍', title: 'Python & R', desc: 'Programación avanzada en Python y R para análisis de datos, machine learning y automatización de procesos.'},
    {icon: '🗄️', title: 'SQL & Bases de Datos', desc: 'Manejo experto de SQL para consultas complejas, optimización de bases de datos y ETL processes.'}
  ],
  projects: [
    {emoji: '📊', title: 'Análisis de Ventas Retail', desc: 'Dashboard interactivo para análisis de tendencias de ventas, identificación de productos estrella y optimización de inventario.', tags:['Python','Pandas','Tableau','SQL']},
    {emoji: '🤖', title: 'Modelo Predictivo', desc: 'Desarrollo de modelo de machine learning para predicción de churn de clientes con 85% de precisión.', tags:['Python','Scikit-learn','Machine Learning','PostgreSQL']},
    {emoji: '📈', title: 'Dashboard Financiero', desc: 'Sistema de monitoreo en tiempo real de KPIs financieros con alertas automáticas y reportes ejecutivos.', tags:['Power BI','DAX','Excel','API']}
  ],
  contact: {
    email: 'mateob-1097@hotmail.com',
    linkedin: 'https://www.linkedin.com/in/mateobaldovino/',
    github: 'https://github.com/TheMaorba'
  }
};

// Componente Header
const Header = ({ name, title }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className="bg-gradient-to-br from-blue-900 to-blue-500 text-white py-12 text-center shadow-lg"
      style={{ backgroundPosition: `center ${scrollY * -0.5}px` }}
    >
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col items-center gap-4 animate-in">
          <div className="w-36 h-36 rounded-full bg-slate-500 flex items-center justify-center text-5xl border-4 border-white shadow-lg">
            👨‍💻
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-light mb-2">{name}</h1>
            <p className="text-xl opacity-90">{title}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

// Componente Navigation
const Navigation = ({ activeSection }) => {
  const navItems = [
    { id: 'about', label: 'Sobre Mí' },
    { id: 'skills', label: 'Habilidades' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'contact', label: 'Contacto' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="bg-white py-4 shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5">
        <ul className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 list-none">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-blue-500 hover:text-white hover:-translate-y-0.5'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Componente Section
const Section = ({ id, title, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`py-16 transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-center text-4xl text-blue-900 mb-12 relative">
          {title}
          <span className="block w-20 h-0.5 bg-blue-500 mx-auto mt-4 rounded"></span>
        </h2>
        {children}
      </div>
    </section>
  );
};

// Componente About
const About = ({ content }) => (
  <Section id="about" title="Sobre Mí">
    <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-3xl mx-auto">
      {content.map((paragraph, idx) => (
        <p key={idx} className="text-lg text-slate-500 mb-6 last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  </Section>
);

// Componente Skills
const Skills = ({ skills }) => (
  <Section id="skills" title="Habilidades">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
      {skills.map((skill, idx) => (
        <div
          key={idx}
          className="bg-white p-8 rounded-2xl shadow-lg text-center transition-all hover:-translate-y-2 hover:shadow-xl"
        >
          <div className="w-15 h-15 bg-gradient-to-br from-blue-500 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl">
            {skill.icon}
          </div>
          <h3 className="text-blue-900 mb-4 text-xl font-semibold">{skill.title}</h3>
          <p className="text-slate-500 text-sm">{skill.desc}</p>
        </div>
      ))}
    </div>
  </Section>
);

// Componente Projects
const Projects = ({ projects }) => (
  <Section id="projects" title="Proyectos">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {projects.map((project, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="h-48 bg-gradient-to-br from-slate-500 to-slate-400 flex items-center justify-center text-white text-5xl">
            {project.emoji}
          </div>
          <div className="p-8">
            <h3 className="text-blue-900 mb-4 text-xl font-semibold">{project.title}</h3>
            <p className="text-slate-500 mb-6">{project.desc}</p>
            <div className="flex gap-2 flex-wrap">
              {project.tags.map((tag, tagIdx) => (
                <span
                  key={tagIdx}
                  className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

// Componente Contact
const Contact = ({ contact }) => (
  <Section id="contact" title="Contacto">
    <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-2xl mx-auto">
      <p className="text-lg text-slate-500 mb-8">
        ¿Interesado en colaborar? Me encantaría conocer más sobre tu proyecto y cómo puedo ayudarte a extraer valor de tus datos.
      </p>
      <div className="flex justify-center gap-12 flex-wrap">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-900 rounded-full flex items-center justify-center text-white text-xl">
            📧
          </div>
          <a href={`mailto:${contact.email}`} className="text-slate-600 font-medium hover:text-blue-500">
            {contact.email}
          </a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-900 rounded-full flex items-center justify-center text-white text-xl">
            💼
          </div>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-600 font-medium hover:text-blue-500">
            LinkedIn
          </a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-900 rounded-full flex items-center justify-center text-white text-xl">
            🐙
          </div>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-slate-600 font-medium hover:text-blue-500">
            GitHub
          </a>
        </div>
      </div>
    </div>
  </Section>
);

// Componente Footer
const Footer = ({ name }) => (
  <footer className="bg-blue-900 text-white text-center py-8">
    <div className="max-w-6xl mx-auto px-5">
      <p>© 2025 {name}. Todos los derechos reservados.</p>
    </div>
  </footer>
);

// Componente principal
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;