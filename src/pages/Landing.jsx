import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowRight, PlayCircle, Layers, Users, Zap, FileText, CheckCircle2, Bot, Map as MapIcon, BarChart3, MessageSquare, Diamond, UploadCloud, X } from 'lucide-react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2,
    }));

    const render = () => {
      ctx.fillStyle = '#040812';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(99, 120, 255, 0.3)';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />;
};

const AnimatedNumber = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/,/g, ''));
      const duration = 1200;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const SectionHeading = ({ pretitle, title, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
    className="max-w-3xl mb-16"
  >
    {pretitle && <div className="text-nx-accent-primary font-mono text-sm font-bold tracking-wider uppercase mb-4">{pretitle}</div>}
    <h2 className="text-4xl md:text-5xl font-display font-bold text-nx-text-primary mb-6 leading-tight">{title}</h2>
    {description && <p className="text-lg text-nx-text-secondary leading-relaxed">{description}</p>}
  </motion.div>
);

export default function Landing() {
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const dashboardY = useTransform(scrollY, [0, 600], [0, -100]);
  const dashboardScale = useTransform(scrollY, [0, 600], [1, 1.05]);

  return (
    <div className="bg-nx-bg-base min-h-screen text-nx-text-primary overflow-x-hidden font-body selection:bg-nx-accent-subtle selection:text-nx-accent-primary">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-start overflow-hidden">
        <ParticleBackground />
        
        {/* Radar scan line */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(29,78,216,0.8), transparent)',
          height: '2px',
          animation: 'scan 4s linear infinite',
        }} />

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-6 text-center mt-12 md:mt-24"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-[80px] font-display font-bold text-white tracking-tight leading-[1.05] mb-8"
          >
            Community needs,<br />precisely mapped.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            NexusAid transforms scattered paper surveys into real-time intelligence. 
            Match the right volunteers to the right communities, automatically.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <NavLink to="/login" className="h-14 px-8 bg-nx-accent-primary hover:bg-nx-accent-hover text-white rounded-lg font-medium text-lg flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-glow active:scale-95">
              Enter Platform <ArrowRight className="w-5 h-5" />
            </NavLink>
            <button onClick={() => setIsVideoOpen(true)} className="h-14 px-8 bg-nx-bg-surface border border-nx-border-default hover:bg-nx-bg-elevated text-nx-text-primary rounded-lg font-medium text-lg flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95">
              <PlayCircle className="w-5 h-5 text-nx-text-secondary" /> How it works
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-sm font-mono text-nx-text-secondary"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-nx-bg-surface/50 border border-nx-border-subtle backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-nx-green animate-pulse" /> 2,400+ NGOs
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-nx-bg-surface/50 border border-nx-border-subtle backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-nx-cyan animate-pulse" /> 840K families reached
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-nx-bg-surface/50 border border-nx-border-subtle backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-nx-accent-primary animate-pulse" /> 14 states active
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard 3D Preview */}
        <motion.div 
          style={{ y: dashboardY, scale: dashboardScale }}
          className="relative z-20 mt-20 w-full max-w-6xl px-6"
        >
          <div className="relative aspect-video rounded-xl bg-nx-bg-card border border-nx-border-default shadow-modal overflow-hidden"
               style={{ transform: "perspective(1200px) rotateX(15deg) translateY(-50px)", transformStyle: "preserve-3d" }}>
            {/* Mock Dashboard UI Header */}
            <div className="h-12 border-b border-nx-border-subtle bg-nx-bg-surface flex items-center px-4 gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-nx-crimson/80" />
                <div className="w-3 h-3 rounded-full bg-nx-amber/80" />
                <div className="w-3 h-3 rounded-full bg-nx-green/80" />
              </div>
              <div className="h-6 flex-1 max-w-md bg-nx-bg-base rounded-md border border-nx-border-subtle flex items-center px-3">
                <div className="w-4 h-4 text-nx-text-tertiary">🔍</div>
              </div>
            </div>
            {/* Mock Dashboard Body */}
            <div className="p-6 flex gap-6 h-full">
              <div className="w-64 flex flex-col gap-4">
                <div className="h-24 bg-nx-bg-surface rounded-lg border border-nx-border-subtle p-4 flex flex-col justify-between">
                   <div className="h-3 w-1/2 bg-nx-text-disabled rounded" />
                   <div className="h-8 w-3/4 bg-nx-accent-subtle rounded border border-nx-accent-primary/20" />
                </div>
                <div className="h-24 bg-nx-bg-surface rounded-lg border border-nx-border-subtle p-4" />
                <div className="flex-1 bg-nx-bg-surface rounded-lg border border-nx-border-subtle" />
              </div>
              <div className="flex-1 bg-nx-bg-base rounded-lg border border-nx-border-subtle relative overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-accent-primary)_1px,_transparent_1px)]" style={{ backgroundSize: '20px 20px' }} />
                 {/* Map markers mock */}
                 <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-nx-crimson rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse" />
                 <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-nx-cyan rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                 <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-nx-amber rounded-full shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-nx-bg-base via-transparent to-transparent opacity-80" />
          </div>
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-nx-accent-primary/20 blur-[100px] rounded-[100%]" />
        </motion.div>
      </section>

      {/* 2. MARQUEE STRIP */}
      <section className="bg-nx-bg-surface border-y border-nx-border-subtle py-4 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] items-center text-nx-accent-primary font-mono text-sm tracking-widest uppercase">
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="mx-6">Water Aid</span><Diamond className="w-3 h-3 opacity-50" />
              <span className="mx-6">Medical Relief</span><Diamond className="w-3 h-3 opacity-50" />
              <span className="mx-6">Education</span><Diamond className="w-3 h-3 opacity-50" />
              <span className="mx-6">Food Security</span><Diamond className="w-3 h-3 opacity-50" />
              <span className="mx-6">Sanitation</span><Diamond className="w-3 h-3 opacity-50" />
              <span className="mx-6">Disaster Response</span><Diamond className="w-3 h-3 opacity-50" />
              <span className="mx-6">Rural Development</span><Diamond className="w-3 h-3 opacity-50" />
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section id="features" className="py-32 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <SectionHeading 
            pretitle="The broken status quo"
            title="Data exists. Decisions don't."
            description="Billions are spent on social impact, yet field ops run on WhatsApp groups and paper forms. The disconnect between data collection and resource deployment costs lives."
          />
          
          <div className="flex flex-col gap-4">
            {[
              { icon: FileText, title: "Paper surveys sit in boxes for weeks", text: "Critical need data becomes obsolete before it's even digitized." },
              { icon: MessageSquare, title: "Volunteers called via WhatsApp group chaos", text: "No skill matching, no location filtering. Just noise." },
              { icon: Users, title: "NGOs unknowingly serve the same village", text: "Zero cross-org visibility leads to duplicate efforts and wasted funds." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-nx-bg-surface p-6 rounded-xl border-l-4 border-l-nx-crimson border border-y-nx-border-subtle border-r-nx-border-subtle flex gap-4 items-start shadow-card hover:-translate-y-1 transition-transform"
              >
                <div className="p-3 bg-nx-crimson-subtle rounded-lg text-nx-crimson mt-1 shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-nx-text-primary mb-2">{item.title}</h3>
                  <p className="text-nx-text-secondary leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOLUTION SECTION */}
      <section id="how-it-works" className="py-32 bg-nx-bg-surface border-y border-nx-border-subtle relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[800px] h-[800px] bg-nx-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading 
            pretitle="How NexusAid works"
            title="Intelligence at scale."
          />

          <div className="grid md:grid-cols-3 gap-8 relative mt-16">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-nx-border-strong z-0 overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 whileInView={{ x: "100%" }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                 className="w-full h-full bg-nx-accent-primary" 
               />
            </div>

            {[
              { icon: UploadCloud, title: "1. Upload", desc: "Snap a photo of a paper survey. Our OCR engine extracts data instantly." },
              { icon: Zap, title: "2. Analyze", desc: "AI categorizes need type and calculates an urgency score automatically." },
              { icon: CheckCircle2, title: "3. Deploy", desc: "Smart matching algorithms ping the nearest qualified volunteer." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-2xl bg-nx-bg-card border border-nx-border-default flex items-center justify-center mb-6 shadow-card group-hover:border-nx-accent-primary transition-colors group-hover:shadow-glow">
                  <item.icon className="w-10 h-10 text-nx-accent-primary" />
                </div>
                <h3 className="text-2xl font-bold text-nx-text-primary mb-3 font-display">{item.title}</h3>
                <p className="text-nx-text-secondary max-w-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. IMPACT METRICS */}
      <section id="impact" className="py-32 container mx-auto px-6 border-b border-nx-border-subtle">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-nx-border-subtle">
          {[
            { val: "247", sfx: "K", label: "Families Helped" },
            { val: "18", sfx: "m", label: "Avg Time-to-Match" },
            { val: "94", sfx: "%", label: "Volunteer Retention" },
            { val: "31", sfx: "", label: "Districts Covered" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center px-4"
            >
              <div className="text-5xl md:text-6xl font-mono font-bold text-nx-text-primary mb-2 flex">
                <AnimatedNumber value={stat.val} suffix={stat.sfx} />
              </div>
              <div className="text-sm font-bold text-nx-text-tertiary uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-40 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-nx-accent-primary/10" />
        <div className="absolute bottom-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_bottom,_var(--color-accent-subtle),_transparent_70%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold text-nx-text-primary mb-8 tracking-tight">Start mapping your community today.</h2>
          <p className="text-xl text-nx-text-secondary mb-12 max-w-2xl mx-auto">Deploy the world's most advanced civic intelligence platform for your organization in 5 minutes.</p>
          
          <NavLink to="/login" className="h-16 px-10 bg-nx-accent-primary hover:bg-nx-accent-hover text-white rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-glow active:scale-95 mx-auto">
            Get Started Free <ArrowRight className="w-6 h-6" />
          </NavLink>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm font-mono text-nx-text-tertiary">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nx-green" /> SOC 2 Compliant</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nx-green" /> DPDP Ready</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nx-green" /> 99.9% Uptime</span>
          </div>
        </motion.div>
      </section>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(1200px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-nx-bg-base/90 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsVideoOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-nx-bg-surface border border-nx-border-strong rounded-2xl shadow-modal overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-4 border-b border-nx-border-subtle bg-nx-bg-elevated/50">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-nx-accent-primary" />
                  <span className="font-bold text-nx-text-primary">NexusAid Platform Overview</span>
                </div>
                <button 
                  onClick={() => setIsVideoOpen(false)}
                  className="p-2 rounded-lg text-nx-text-secondary hover:text-nx-crimson hover:bg-nx-crimson-subtle transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video bg-nx-bg-elevated relative flex items-center justify-center overflow-hidden">
                <img 
                  src="/demo.webp" 
                  alt="NexusAid Platform Demo Walkthrough"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
