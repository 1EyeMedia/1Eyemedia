import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { 
  Menu, X, Star, LogIn, LogOut, Radio, Map, ExternalLink, 
  Fingerprint, Sparkles, Globe, Send, Orbit, ShieldCheck, Database 
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// --- CONFIGURATION & SETUP ---

// Firebase Configuration
let firebaseConfig;
if (typeof __firebase_config !== 'undefined') {
  firebaseConfig = JSON.parse(__firebase_config);
} else {
  firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  'client_id': '67283477593-9sc002ug0e95dbsl0dfga0r14qpili33.apps.googleusercontent.com'
});

// API Keys
const GEMINI_API_KEY = "AIzaSyB2UzyD34_cdl5JJJ9yG5nlgyj1xr8TULI";
const WEB3FORM_KEY = "d8fa54f1-20c5-4fa4-930c-d372bd11baa0";

// --- TRANSLATIONS (i18n) ---
const translations = {
  en: {
    navHome: "Home", navVision: "Vision", navProducts: "Products", navContact: "Contact",
    signIn: "Sign In", signOut: "Sign Out", authorized: "Authorized",
    systemOnline: "System Online",
    heroTitle1: "ENGINEERING", heroTitle2: "STRUCTURED", heroTitle3: "INFRASTRUCTURE",
    heroSub: "1Eye Media builds controlled, scalable digital ecosystems for modern institutions. We provide the clarity of an orbital perspective.",
    exploreVision: "Explore Vision", viewProducts: "View Products",
    visionTitle1: "THE VOID REQUIRES", visionTitle2: "STRUCTURE",
    visionP1: "In an expanding digital universe, chaos is the default state. Entropy erodes systems that lack rigorous architecture.",
    visionP2: "At 1Eye Media, we don't just build software; we engineer observatories. Our platforms act as central nervous systems, providing high-level visibility and granular control over complex data streams. We bring the discipline of aerospace engineering to digital infrastructure.",
    inspiredBy: "Inspired by the vision of Elon Musk",
    ourSystems: "Our Systems", deployedModules: "DEPLOYED MODULES",
    productsSub: "Scalable solutions for enterprise and institutional control.",
    liveDeployed: "Live / Deployed", inDevelopment: "In Development", concept: "Concept",
    accessTerminal: "Access Terminal", awaitingLaunch: "Awaiting Launch", restrictedAccess: "Restricted Access",
    prepMapDesc: "A highly customizable, modern UI dashboard for students. Engineered to systematically track exam and test syllabus with precision and clarity.",
    systemArchitect: "System Architect", founder: "Founder",
    initiateUplink: "INITIATE UPLINK", contactSub: "Establish a connection with our engineering team.",
    designation: "Designation", frequency: "Frequency", transmission: "Transmission",
    sendTransmission: "Send Transmission", transmitting: "TRANSMITTING...",
    uplinkSuccess: "UPLINK ESTABLISHED. DATA SENT.", uplinkFailed: "TRANSMISSION FAILED.", uplinkError: "ERROR IN UPLINK."
  },
  es: {
    navHome: "Inicio", navVision: "Visión", navProducts: "Productos", navContact: "Contacto",
    signIn: "Iniciar sesión", signOut: "Cerrar sesión", authorized: "Autorizado",
    systemOnline: "Sistema en línea",
    heroTitle1: "INGENIERÍA DE", heroTitle2: "INFRAESTRUCTURA", heroTitle3: "ESTRUCTURADA",
    heroSub: "1Eye Media construye ecosistemas digitales controlados y escalables para instituciones modernas. Proporcionamos la claridad de una perspectiva orbital.",
    exploreVision: "Explorar Visión", viewProducts: "Ver Productos",
    visionTitle1: "EL VACÍO REQUIERE", visionTitle2: "ESTRUCTURA",
    visionP1: "En un universo digital en expansión, el caos es el estado predeterminado. La entropía erosiona los sistemas que carecen de una arquitectura rigurosa.",
    visionP2: "En 1Eye Media, no solo creamos software; diseñamos observatorios. Nuestras plataformas actúan como sistemas nerviosos centrales, proporcionando visibilidad de alto nivel y control granular. Llevamos la disciplina de la ingeniería aeroespacial a la infraestructura digital.",
    inspiredBy: "Inspirado por la visión de Elon Musk",
    ourSystems: "Nuestros Sistemas", deployedModules: "MÓDULOS DESPLEGADOS",
    productsSub: "Soluciones escalables para el control empresarial e institucional.",
    liveDeployed: "En vivo / Desplegado", inDevelopment: "En Desarrollo", concept: "Concepto",
    accessTerminal: "Terminal de Acceso", awaitingLaunch: "Esperando Lanzamiento", restrictedAccess: "Acceso Restringido",
    prepMapDesc: "Un panel de control de interfaz de usuario moderna y altamente personalizable para estudiantes. Diseñado para rastrear sistemáticamente el plan de estudios.",
    systemArchitect: "Arquitecto de Sistemas", founder: "Fundador",
    initiateUplink: "INICIAR ENLACE", contactSub: "Establezca una conexión con nuestro equipo de ingeniería.",
    designation: "Designación", frequency: "Frecuencia", transmission: "Transmisión",
    sendTransmission: "Enviar Transmisión", transmitting: "TRANSMITIENDO...",
    uplinkSuccess: "ENLACE ESTABLECIDO. DATOS ENVIADOS.", uplinkFailed: "TRANSMISIÓN FALLIDA.", uplinkError: "ERROR EN EL ENLACE."
  },
  ja: {
    navHome: "ホーム", navVision: "ビジョン", navProducts: "製品", navContact: "連絡先",
    signIn: "サインイン", signOut: "サインアウト", authorized: "承認済み",
    systemOnline: "システムオンライン",
    heroTitle1: "構造化された", heroTitle2: "インフラストラクチャの", heroTitle3: "エンジニアリング",
    heroSub: "1Eye Mediaは、現代の機関向けに制御されたスケーラブルなデジタルエコシステムを構築します。軌道上の視点からの明確さを提供します。",
    exploreVision: "ビジョンを探る", viewProducts: "製品を見る",
    visionTitle1: "虚空には", visionTitle2: "構造が必要",
    visionP1: "拡大するデジタル宇宙では、カオスがデフォルトの状態です。厳密なアーキテクチャを欠くシステムはエントロピーによって侵食されます。",
    visionP2: "1Eye Mediaでは、単なるソフトウェア構築ではなく、観測所を設計しています。当社のプラットフォームは中枢神経系として機能し、複雑なデータストリームに対する高レベルの可視性と詳細な制御を提供します。",
    inspiredBy: "イーロン・マスクのビジョンに触発されて",
    ourSystems: "当社のシステム", deployedModules: "展開済みモジュール",
    productsSub: "企業および機関の制御のためのスケーラブルなソリューション。",
    liveDeployed: "ライブ / 展開済み", inDevelopment: "開発中", concept: "コンセプト",
    accessTerminal: "アクセス端末", awaitingLaunch: "打ち上げ待ち", restrictedAccess: "アクセス制限",
    prepMapDesc: "学生向けの高度にカスタマイズ可能な最新のUIダッシュボード。試験やテストのシラバスを体系的に追跡するように設計されています。",
    systemArchitect: "システムアーキテクト", founder: "創設者",
    initiateUplink: "アップリンク開始", contactSub: "エンジニアリングチームとの接続を確立します。",
    designation: "指定 (名前)", frequency: "周波数 (メール)", transmission: "送信内容",
    sendTransmission: "送信する", transmitting: "送信中...",
    uplinkSuccess: "アップリンク確立。データ送信完了。", uplinkFailed: "送信失敗。", uplinkError: "アップリンクエラー。"
  }
};

// --- CONTEXTS ---
const AuthContext = createContext();
const LangContext = createContext();

// --- CUSTOM HOOKS ---
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// --- COMPONENTS ---

const BackgroundEffects = () => {
  useEffect(() => {
    // Generate Stars
    const starContainer = document.getElementById('react-star-container');
    if (starContainer && starContainer.children.length === 0) {
      for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'absolute bg-white rounded-full opacity-0';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starContainer.appendChild(star);
      }
    }

    // Shooting Stars
    const spawnShootingStar = () => {
      const container = document.getElementById('shooting-star-container');
      if (!container) return;
      const star = document.createElement('div');
      star.className = 'absolute h-[1px] w-[150px] opacity-0 pointer-events-none';
      star.style.background = 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.8), #00bfff)';
      star.style.filter = 'drop-shadow(0 0 3px rgba(0, 191, 255, 0.5))';
      star.style.left = `${Math.random() * (window.innerWidth + 200)}px`;
      star.style.top = `${Math.random() * (window.innerHeight * 0.4)}px`;
      const duration = 1.5 + Math.random() * 2;
      star.style.animation = `shoot ${duration}s linear forwards`;
      container.appendChild(star);
      setTimeout(() => star.remove(), duration * 1000 + 100);
    };

    const interval = setInterval(() => {
      if (!document.hidden && Math.random() > 0.4) spawnShootingStar();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div id="react-star-container" className="fixed inset-0 z-0 pointer-events-none" />
      <div id="shooting-star-container" className="fixed inset-0 z-0 pointer-events-none overflow-hidden" />
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/10 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-30%] left-[-50%] w-[200%] h-[100%] z-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, rgba(0, 191, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 191, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        transform: 'perspective(1000px) rotateX(75deg)',
        transformOrigin: 'center top',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, transparent 100%)'
      }} />
    </>
  );
};

const Marquee = () => (
  <div className="fixed top-0 left-0 w-full h-8 bg-accent/5 border-b border-accent/20 z-[110] flex items-center overflow-hidden backdrop-blur-sm">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...Array(6)].map((_, i) => (
        <span key={i} className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase mx-4">
          /// CHALLENGING THE BIGGEST COMPETITORS IN THE TECH INDUSTRY
        </span>
      ))}
    </div>
  </div>
);

const Navbar = () => {
  const { user, login, logout } = useContext(AuthContext);
  const { lang, setLang, t } = useContext(LangContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-8 w-full z-[100] bg-[#0a0a0f]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <img src="https://i.ibb.co/rfs2sDK5/Whats-App-Image-2026-02-12-at-11-40-19-PM-removebg-preview.png" alt="1Eye Media" className="h-12 md:h-20 w-auto object-contain" />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-gray-400 tracking-widest uppercase">
            <a href="#home" className="hover:text-white transition-colors relative group">{t.navHome}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span>
            </a>
            <a href="#vision" className="hover:text-white transition-colors relative group">{t.navVision}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span>
            </a>
            <a href="#products" className="hover:text-white transition-colors relative group">{t.navProducts}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span>
            </a>
            <a href="#contact" className="hover:text-white transition-colors relative group">{t.navContact}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
              <Globe className="w-4 h-4 text-accent" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer uppercase appearance-none"
              >
                <option value="en" className="bg-[#0a0a0f]">EN</option>
                <option value="es" className="bg-[#0a0a0f]">ES</option>
                <option value="ja" className="bg-[#0a0a0f]">JA</option>
              </select>
            </div>

            {/* Auth Section */}
            <div className="ml-2 pl-6 border-l border-white/10">
              {!user ? (
                <button onClick={login} className="flex items-center gap-2 px-4 py-2 border border-accent/30 rounded-sm hover:bg-accent/10 transition-all group">
                  <LogIn className="w-4 h-4 text-accent" />
                  <span className="text-xs font-bold text-accent group-hover:text-white">{t.signIn}</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-white leading-tight">{user.displayName || 'User'}</div>
                    <div className="text-[8px] text-accent">{t.authorized}</div>
                  </div>
                  <img src={user.photoURL || 'https://via.placeholder.com/40'} alt="User" className="w-8 h-8 rounded-full border border-accent/50 p-0.5" />
                  <button onClick={logout} className="text-white/50 hover:text-red-400 transition-colors" title={t.signOut}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white relative z-[101]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-28 left-0 w-full bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 text-center z-[99] animate-fade-in-down">
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-accent uppercase tracking-widest text-sm font-light">{t.navHome}</a>
          <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-accent uppercase tracking-widest text-sm font-light">{t.navVision}</a>
          <a href="#products" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-accent uppercase tracking-widest text-sm font-light">{t.navProducts}</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-accent uppercase tracking-widest text-sm font-light">{t.navContact}</a>
          
          <div className="flex justify-center items-center gap-2 border-t border-white/10 pt-4">
            <Globe className="w-4 h-4 text-accent" />
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-sm font-bold text-white focus:outline-none uppercase">
              <option value="en" className="bg-[#0a0a0f]">EN</option>
              <option value="es" className="bg-[#0a0a0f]">ES</option>
              <option value="ja" className="bg-[#0a0a0f]">JA</option>
            </select>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col items-center">
            {!user ? (
              <button onClick={login} className="flex items-center gap-2 text-accent uppercase tracking-widest text-xs font-bold">
                <LogIn className="w-4 h-4" /> {t.signIn}
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <img src={user.photoURL || 'https://via.placeholder.com/40'} alt="User" className="w-10 h-10 rounded-full border border-accent" />
                <span className="text-sm text-white font-bold">{user.displayName || 'User'}</span>
                <button onClick={logout} className="text-xs text-red-400 mt-2 uppercase tracking-widest">{t.signOut}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Hero = () => {
  const { t } = useContext(LangContext);
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-32 md:pt-40 z-30 px-4">
      <div className="text-center max-w-[90rem] mx-auto w-full">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-1000 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 md:mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
          <span className="text-xs tracking-[0.2em] text-accent uppercase font-medium">{t.systemOnline}</span>
        </div>
        
        <h1 className="reveal opacity-0 translate-y-8 transition-all duration-1000 delay-100 font-display font-bold leading-[1.1] mb-8 w-full">
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 tracking-wide">{t.heroTitle1}</span>
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{t.heroTitle2}</span>
          <span className="block text-[8vw] sm:text-6xl md:text-7xl lg:text-8xl tracking-wide text-white/90">{t.heroTitle3}</span>
        </h1>
        
        <p className="reveal opacity-0 translate-y-8 transition-all duration-1000 delay-200 text-gray-400 text-base md:text-xl max-w-3xl mx-auto mb-12 font-light leading-relaxed">
          {t.heroSub}
        </p>
        
        <div className="reveal opacity-0 translate-y-8 transition-all duration-1000 delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full">
          <a href="#vision" className="relative overflow-hidden px-10 py-5 bg-accent text-[#0a0a0f] font-bold tracking-wider uppercase text-sm hover:bg-white transition-colors min-w-[200px] text-center z-40">
            {t.exploreVision}
          </a>
          <a href="#products" className="px-10 py-5 border border-white/20 text-white font-medium tracking-wider uppercase text-sm hover:border-accent hover:text-accent transition-colors min-w-[200px] text-center z-40">
            {t.viewProducts}
          </a>
        </div>
      </div>
    </section>
  );
};

const Vision = () => {
  const { t } = useContext(LangContext);
  return (
    <section id="vision" className="py-24 md:py-32 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="reveal opacity-0 translate-y-8 transition-all duration-1000 relative z-20">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-8 uppercase leading-tight">
              {t.visionTitle1} <br/><span className="text-accent">{t.visionTitle2}</span>
            </h2>
            <div className="w-20 h-[1px] bg-accent mb-8"></div>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">{t.visionP1}</p>
            <p className="text-gray-400 text-lg leading-relaxed">{t.visionP2}</p>
          </div>
          
          <div className="reveal opacity-0 translate-y-8 transition-all duration-1000 delay-200 relative h-[500px] w-full flex flex-col items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
              <img src="https://i.ibb.co/x8YGMLZ5/Gemini-Generated-Image-e7mq0fe7mq0fe7mq-Photoroom.png" alt="Visionary Inspiration" className="relative z-20 h-64 md:h-80 w-auto object-contain drop-shadow-[0_0_35px_rgba(0,191,255,0.15)]" />
              <div className="mt-8 relative z-20 text-center">
                <p className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-accent/80 flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  {t.inspiredBy}
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Products = () => {
  const { t } = useContext(LangContext);
  return (
    <section id="products" className="py-32 relative z-20 bg-black/40 backdrop-blur-sm border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-1000 flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-accent tracking-widest text-xs uppercase font-bold mb-2 block">{t.ourSystems}</span>
            <h2 className="font-display text-4xl font-bold">{t.deployedModules}</h2>
          </div>
          <p className="text-gray-400 text-sm mt-4 md:mt-0 max-w-xs text-right">{t.productsSub}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* PrepMap */}
          <a href="https://prepmap.vercel.app" target="_blank" rel="noopener noreferrer" className="reveal opacity-0 translate-y-8 transition-all duration-1000 delay-100 group p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-accent/40 rounded-sm relative overflow-hidden block">
            <div className="absolute top-0 right-0 p-4 opacity-50 text-white/20 group-hover:text-accent transition-colors"><Map className="w-8 h-8" /></div>
            <div className="inline-block px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] tracking-widest uppercase font-bold mb-6 rounded-sm">{t.liveDeployed}</div>
            <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-accent transition-colors">PrepMap</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">{t.prepMapDesc}</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
              <span>{t.accessTerminal}</span> <ExternalLink className="w-3 h-3" /> <div className="w-8 h-[1px] bg-current"></div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

const Founder = () => {
  const { t } = useContext(LangContext);
  return (
    <section className="py-24 relative z-20 border-b border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-1000 flex flex-col items-center justify-center text-center">
          <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 border border-accent/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 border border-white/10 rounded-full"></div>
            <Fingerprint className="w-6 h-6 text-accent relative z-10" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-accent/20 bg-accent/5 mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            <span className="text-[10px] tracking-[0.2em] text-accent uppercase font-bold">{t.systemArchitect}</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 text-white tracking-widest" style={{ textShadow: '0 0 20px rgba(0,191,255,0.3)' }}>RAHUL SINGH</h2>
          <div className="flex items-center gap-4 text-gray-400 text-sm tracking-[0.3em] uppercase mb-8 font-medium">
            <span className="text-accent/50">//</span>
            <span>{t.founder}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>1Eye Media Network</span>
            <span className="text-accent/50">//</span>
          </div>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { t } = useContext(LangContext);
  const [status, setStatus] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ text: t.transmitting, type: 'text-accent' });

    const formData = new FormData(e.target);
    formData.append("access_key", WEB3FORM_KEY);
    formData.append("subject", "New Uplink Request - 1Eye Media React");
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setStatus({ text: t.uplinkSuccess, type: 'text-green-400' });
        e.target.reset();
        // Trigger visual effect
        const fx = document.getElementById('react-transmission-fx');
        if(fx) {
          fx.classList.remove('hidden');
          setTimeout(() => fx.classList.add('hidden'), 1000);
        }
      } else {
        setStatus({ text: t.uplinkFailed, type: 'text-red-400' });
      }
    } catch (err) {
      setStatus({ text: t.uplinkError, type: 'text-red-400' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ text: '', type: '' }), 5000);
    }
  };

  return (
    <section id="contact" className="py-32 relative z-20">
      <div className="max-w-xl mx-auto px-6">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-1000 text-center mb-12">
          <Radio className="w-8 h-8 text-accent mx-auto mb-6" />
          <h2 className="font-display text-4xl font-bold mb-4">{t.initiateUplink}</h2>
          <p className="text-gray-400">{t.contactSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="reveal opacity-0 translate-y-8 transition-all duration-1000 delay-100 space-y-6">
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t.designation}</label>
              <input type="text" name="name" required placeholder="Name" className="w-full bg-[#0a0a0f] border border-white/10 p-4 text-white focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,191,255,0.1)] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t.frequency}</label>
              <input type="email" name="email" required placeholder="Email Address" className="w-full bg-[#0a0a0f] border border-white/10 p-4 text-white focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,191,255,0.1)] transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t.transmission}</label>
            <textarea name="message" rows="4" required placeholder="Message content..." className="w-full bg-[#0a0a0f] border border-white/10 p-4 text-white focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,191,255,0.1)] transition-all"></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-white/5 border border-white/10 text-white font-display font-bold tracking-widest uppercase hover:bg-accent hover:text-[#0a0a0f] hover:border-accent transition-all duration-300 disabled:opacity-50">
            {loading ? t.transmitting : t.sendTransmission}
          </button>
          {status.text && <p className={`text-center text-xs tracking-widest mt-4 uppercase ${status.type}`}>{status.text}</p>}
        </form>

        {/* Transmission Animation Layer */}
        <div id="react-transmission-fx" className="fixed inset-0 pointer-events-none z-[200] hidden">
          <div className="fixed bottom-[20%] left-1/2 w-[100px] h-[4px] bg-gradient-to-r from-transparent via-white to-accent rounded-full opacity-0 drop-shadow-[0_0_10px_#00bfff]" style={{ animation: 'super-speed-launch 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}></div>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[4px] bg-gradient-to-t from-transparent via-accent to-white opacity-0" style={{ animation: 'beam-flash 0.6s ease-out forwards' }}></div>
        </div>
      </div>
    </section>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "System initialized. I am 1Ai. How may I assist with your infrastructure queries?", sender: 'ai' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  
  // To keep Gemini Context
  const [geminiHistory, setGeminiHistory] = useState([]); 

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    const newHistory = [...geminiHistory, { role: "user", parts: [{ text: userMsg }] }];
    setGeminiHistory(newHistory);

    let currentKey = GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
    
    if (!currentKey) {
      if (userMsg.startsWith('AIza')) {
        localStorage.setItem('gemini_api_key', userMsg);
        setMessages(prev => [...prev, { text: "API Key Saved.", sender: 'ai' }]);
      } else {
        setMessages(prev => [...prev, { text: "⚠️ API Key Required.", sender: 'ai' }]);
      }
      setIsTyping(false);
      return;
    }

    try {
      const systemPrompt = `You are 1Ai, the advanced interface for 1Eye Media. 
      Tone: Authoritative, minimal, futuristic, controlled.
      PROTOCOL FOR CONTACTING DEVELOPER:
      If the Operator wants to send a message to the developer/Rahul:
      1. You MUST collect 2 pieces of info: Name and Message. (DO NOT ASK FOR EMAIL).
      2. If missing any info, ask for it specifically.
      3. Once you have BOTH, output EXACTLY this JSON format as your ONLY response:
         ::INITIATE_TRANSMISSION:: {"name": "User Name", "message": "The message content"}
      General Queries: Answer normally based on company info (Rahul Singh, 1Eye Media Network).`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${currentKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: newHistory,
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      const aiResponseText = data.candidates[0].content.parts[0].text;

      if (aiResponseText.includes("::INITIATE_TRANSMISSION::")) {
        const jsonStr = aiResponseText.replace("::INITIATE_TRANSMISSION::", "").trim();
        const parsed = JSON.parse(jsonStr);
        
        setMessages(prev => [...prev, { text: "Bypassing email protocol... Compiling packet...", sender: 'ai' }]);
        
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORM_KEY,
            name: parsed.name,
            email: "uplink@1eye.network",
            message: parsed.message,
            subject: "AI Chatbot Uplink (Direct)"
          })
        });

        const successMsg = `Transmission Sent Successfully to Developer Command. \n\nTarget: Rahul Singh\nStatus: Delivered`;
        setMessages(prev => [...prev, { text: successMsg, sender: 'ai' }]);
        setGeminiHistory([...newHistory, { role: "model", parts: [{ text: "Transmission sent successfully." }] }]);

      } else {
        setMessages(prev => [...prev, { text: aiResponseText, sender: 'ai' }]);
        setGeminiHistory([...newHistory, { role: "model", parts: [{ text: aiResponseText }] }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: "Connection Instability Detected.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (txt) => {
    // Simple bold markdown parser for React
    const parts = txt.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part.split('\n').map((line, j) => <React.Fragment key={j}>{line}<br/></React.Fragment>)}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end gap-4">
      {/* Chat Window */}
      <div className={`w-[90vw] md:w-[400px] h-[500px] bg-[#0a0a0f]/95 backdrop-blur-xl border border-accent/20 rounded-lg shadow-[0_0_50px_rgba(0,191,255,0.15)] flex flex-col overflow-hidden transition-all duration-400 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-accent/10 rounded-full border border-accent/20 shadow-[0_0_10px_rgba(0,191,255,0.5)]">
              <Star className="w-4 h-4 text-accent fill-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white tracking-wider">1Ai CORE</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-accent uppercase tracking-widest font-medium">Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${m.sender === 'ai' ? 'bg-accent/10 border border-accent/20 shadow-[0_0_5px_rgba(0,191,255,0.5)]' : 'bg-white/10 border border-white/20'}`}>
                {m.sender === 'ai' ? <Star className="w-4 h-4 text-accent fill-accent" /> : <Fingerprint className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-3 rounded-lg text-sm leading-relaxed max-w-[85%] ${m.sender === 'ai' ? 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none' : 'bg-accent/20 border border-accent/20 text-white rounded-tr-none'}`}>
                {formatText(m.text)}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3 animate-fade-in-up">
               <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 shadow-[0_0_5px_rgba(0,191,255,0.5)] flex items-center justify-center flex-shrink-0 mt-1">
                 <Star className="w-4 h-4 text-accent fill-accent" />
               </div>
               <div className="bg-white/5 border border-white/5 p-4 rounded-lg rounded-tl-none flex gap-1 items-center h-10">
                 <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter command..." className="flex-1 bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:border-accent/50 focus:shadow-[0_0_15px_rgba(0,191,255,0.15)] transition-all" />
            <button type="submit" className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-[#0a0a0f] transition-all px-4 rounded-sm flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="group relative w-14 h-14 rounded-full bg-[#0a0a0f] border border-accent/30 flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,191,255,0.3)] z-[121]">
        <div className="absolute inset-0 rounded-full border border-accent/50 opacity-0 group-hover:opacity-100 animate-ping"></div>
        <Star className="w-6 h-6 text-accent fill-accent drop-shadow-[0_0_8px_rgba(0,191,255,0.8)]" />
      </button>
    </div>
  );
};

const Footer = () => (
  <footer className="border-t border-white/10 py-12 relative z-20 bg-black/60 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <img src="https://i.ibb.co/rfs2sDK5/Whats-App-Image-2026-02-12-at-11-40-19-PM-removebg-preview.png" alt="1Eye Media" className="h-12 w-auto object-contain opacity-80" />
      </div>
      <div className="text-gray-500 text-xs tracking-widest font-bold">
        &copy; 2026 1EYE MEDIA NETWORK. ALL SYSTEMS NOMINAL.
      </div>
    </div>
  </footer>
);

// --- STYLES INJECTION ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
    
    html {
      scroll-behavior: smooth;
    }

    body {
      background-color: #0a0a0f;
      color: #f5f5f5;
      font-family: 'Space Grotesk', sans-serif;
      overflow-x: hidden;
      margin: 0;
    }
    .font-display { font-family: 'Clash Display', sans-serif; }
    
    @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }
    @keyframes shoot { 0% { transform: translate(0,0) rotate(135deg) scaleX(0.5); opacity: 0; } 10% { opacity: 1; transform: translate(0,0) rotate(135deg) scaleX(1); } 100% { transform: translate(-500px, 500px) rotate(135deg) scaleX(1); opacity: 0; } }
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes super-speed-launch { 0% { transform: translate(-50%, 0) rotate(-90deg) scaleX(0.2); opacity: 1; bottom: 20%; left: 50%; } 40% { opacity: 1; transform: translate(-50%, 0) rotate(-90deg) scaleX(1); } 100% { transform: translate(-50%, -200vh) rotate(-90deg) scaleX(2); opacity: 0; bottom: 20%; left: 50%; } }
    @keyframes beam-flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
    @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    
    .animate-marquee { display: inline-flex; animation: marquee 80s linear infinite; will-change: transform; }
    .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
    .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
    
    .glass-panel { background: rgba(10, 10, 15, 0.6); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    
    /* Autofill fix */
    input:-webkit-autofill, textarea:-webkit-autofill { -webkit-text-fill-color: #f5f5f5; -webkit-box-shadow: 0 0 0px 1000px #0a0a0f inset; transition: background-color 5000s ease-in-out 0s; }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0a0f; }
    ::-webkit-scrollbar-thumb { background: rgba(0, 191, 255, 0.2); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0, 191, 255, 0.5); }
  `}</style>
);

// --- MAIN APP ---
export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try { await signInWithPopup(auth, provider); } 
    catch (error) { console.error("Login Error", error); }
  };

  const logout = async () => {
    try { await signOut(auth); } 
    catch (error) { console.error("Logout Error", error); }
  };

  useScrollReveal();

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
        <GlobalStyles />
        <div className="bg-[#0a0a0f] text-[#f5f5f5] min-h-screen font-sans selection:bg-[#00bfff] selection:text-[#0a0a0f]">
          <BackgroundEffects />
          <Marquee />
          <Navbar />
          <main>
            <Hero />
            <Vision />
            <Products />
            <Founder />
            <Contact />
          </main>
          <Footer />
          <Chatbot />
        </div>
      </LangContext.Provider>
    </AuthContext.Provider>
  );
}