// src/App.jsx
import React from 'react';

function App() {
    return (
        <div className="min-h-screen relative selection:bg-blue-100 selection:text-blue-900 font-sans">

            {/* --- TRENDING: MOVING MESH BACKGROUND --- */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-neutral-50">
                <div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div
                    className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div
                    className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                {/* Noise texture overlay for professional texture */}
                <div className="absolute inset-0 opacity-[0.03]"
                     style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            </div>

            {/* --- NAVIGATION (Glassmorphism) --- */}
            <nav
                className="fixed top-0 left-0 right-0 z-[100] border-b border-white/40 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className="relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                            <div
                                className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"/>
                            <img src="./logo_full.png" alt="HPK AI Labs"
                                 className="h-12 w-auto object-contain relative z-10"/>
                        </div>
                        <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tight text-slate-900 leading-none">
                    HPK AI LABS
                </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- PROFESSIONAL SaaS HERO SECTION --- */}
            <header className="relative z-10 pt-40 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center md:text-left">
                    {/* Main Value Proposition */}
                   <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-slate-900 leading-[1.1]">
    Architecting the <br/>
    {/* Exact Gradient Match:
       #2563eb -> blue-600
       #7c3aed -> violet-600
       #06b6d4 -> cyan-500
    */}
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 via-cyan-600 to-blue-600 animate-optical-flow pb-2">
        Generative Future.
    </span>
</h1>

                    {/* Professional SaaS Description */}
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed font-normal">
                        A specialized framework of
                        <span className="font-semibold text-slate-900"> enterprise-scale generative and vision models </span>
                        designed to accelerate the next generation of
                        <span className="font-semibold text-slate-900"> intelligent workflows</span>.
                    </p>
                </div>
            </header>

            {/* --- PROJECTS GRID --- */}
            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                {/* Stylish Section Divider */}
                <div className="flex flex-col gap-2 mb-12">
                    {/* Top Row: Big Label + Divider */}
                    <div className="flex items-end gap-6">
                        <h2 className="text-2xl font-black text-slate-900 leading-none">
                            Deployed Models
                        </h2>
                        <div className="h-px flex-1 bg-slate-200 mb-2"></div>
                    </div>

                    {/* Bottom Row: Technical Specs */}
                    <div className="flex justify-between items-center pl-1">
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
            Status: <span className="text-emerald-500 font-bold">Active</span>
        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* --- CARD 1: MUSICGEN (Harmonic Filament Theme) --- */}
                    <a href="/musicgen/"
                       className="group relative flex flex-col h-full bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden hover:border-blue-200 transition-all duration-500 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1">

                        <div
                            className="h-56 bg-slate-900 relative overflow-hidden flex flex-col items-center justify-end pb-6">

                            {/* BACKGROUND: Deep Grid & Glow */}
                            <div
                                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                            {/* Central ambient glow to highlight the waves */}
                            <div
                                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] animate-glow-pulse"></div>

                            {/* LAYER 1: The "Harmonic Filaments" (Trending Audio Visualizer) */}
                            <div
                                className="absolute top-0 left-0 right-0 bottom-12 overflow-hidden flex items-center opacity-90">

                                {/* SVG DEFINITION FOR GRADIENTS */}
                                <svg width="0" height="0">
                                    <defs>
                                        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(56, 189, 248, 0)"/>
                                            {/* Transparent */}
                                            <stop offset="50%" stopColor="rgba(56, 189, 248, 1)"/>
                                            {/* Cyan */}
                                            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)"/>
                                            {/* Transparent */}
                                        </linearGradient>
                                        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(167, 139, 250, 0)"/>
                                            {/* Transparent */}
                                            <stop offset="50%" stopColor="rgba(167, 139, 250, 1)"/>
                                            {/* Violet */}
                                            <stop offset="100%" stopColor="rgba(167, 139, 250, 0)"/>
                                            {/* Transparent */}
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* WAVE 1: Slow, Deep (Violet) */}
                                <div
                                    className="absolute w-[200%] h-full flex items-center animate-filament-flow [animation-duration:12s] opacity-60">
                                    <svg className="w-full h-24" viewBox="0 0 1200 100" preserveAspectRatio="none">
                                        <path d="M0 50 Q 150 100 300 50 T 600 50 T 900 50 T 1200 50"
                                              fill="none" stroke="url(#waveGradient2)" strokeWidth="2"
                                              strokeLinecap="round"/>
                                    </svg>
                                </div>

                                {/* WAVE 2: Medium, Main (Blue/Cyan) */}
                                <div
                                    className="absolute w-[200%] h-full flex items-center animate-filament-flow [animation-duration:8s] opacity-80">
                                    <svg className="w-full h-32" viewBox="0 0 1200 100" preserveAspectRatio="none">
                                        <path d="M0 50 Q 100 20 200 50 T 400 50 T 600 50 T 800 50 T 1000 50 T 1200 50"
                                              fill="none" stroke="url(#waveGradient1)" strokeWidth="3"
                                              strokeLinecap="round"/>
                                    </svg>
                                </div>

                                {/* WAVE 3: Fast, High Frequency (White/Bright) - The "Detail" Layer */}
                                <div
                                    className="absolute w-[200%] h-full flex items-center animate-filament-flow [animation-duration:5s] opacity-40 mix-blend-overlay">
                                    <svg className="w-full h-40" viewBox="0 0 1200 100" preserveAspectRatio="none">
                                        <path
                                            d="M0 50 Q 50 80 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 T 900 50 T 1000 50 T 1100 50 T 1200 50"
                                            fill="none" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                                    </svg>
                                </div>

                            </div>

                            {/* LAYER 2: "Data Particles" Rising from Text (Kept the same) */}
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 pointer-events-none">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i}
                                         className="absolute bottom-0 left-1/2 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-particle shadow-[0_0_5px_cyan]"
                                         style={{
                                             left: `${Math.random() * 100}%`,
                                             animationDelay: `${i * 0.5}s`,
                                             opacity: 0 // Starts hidden
                                         }}
                                    />
                                ))}
                            </div>

                            {/* LAYER 3: The "Prompt Input" UI (The Source) */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                {/* The Floating Prompt Bubble */}
                                <div
                                    className="relative bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                                    {/* Status Dot */}
                                    <div
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>

                                    {/* Typing Text Container */}
                                    <div className="relative w-32 h-4 overflow-hidden flex items-center"><span
                                        className="text-[10px] font-mono text-cyan-200 whitespace-nowrap animate-type border-r border-cyan-400/50 pr-1">"Lo-fi chill beats"</span>
                                    </div>

                                    {/* Enter Icon */}
                                    <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2">
                                        <polyline points="9 10 4 15 9 20"></polyline>
                                        <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                                    </svg>
                                </div>

                                {/* Context Label */}
                                <span
                                    className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-cyan-600 transition-colors">Text-to-Music</span>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                Acoustic Intelligence
                                <ExternalIcon/>
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                                Generate professional-tier high-fidelity studio music from descriptive text using
                                advanced
                                neural transformers and diffusion modeling.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <TechTag label="EnCodec"/>
                                <TechTag label="ONNX"/>
                                <TechTag label="PyTorch"/>
                            </div>
                        </div>
                    </a>

                    {/* --- CARD 2: DEEPMASK AI (UPDATED ANIMATION) --- */}
                    <a href="/bg_remover/"
                       className="group relative flex flex-col h-full bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden hover:border-violet-200 transition-all duration-500 hover:shadow-xl hover:shadow-violet-900/5 hover:-translate-y-1">

                        {/* ANIMATION CONTAINER */}
                        <div
                            className="h-56 bg-neutral-100 relative overflow-hidden flex items-center justify-center border-b border-neutral-100">

                            {/* LAYER 1: Transparency Checkerboard (Base) */}
                            <div className="absolute inset-0 z-0 opacity-50" style={{
                                backgroundImage: 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%, transparent 75%, #cbd5e1 75%, #cbd5e1), linear-gradient(45deg, #cbd5e1 25%, transparent 25%, transparent 75%, #cbd5e1 75%, #cbd5e1)',
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 10px 10px'
                            }}></div>

                            {/* LAYER 2: Detailed Background Scene (Wiped Away) - UPDATED */}
                            <div className="absolute inset-0 z-10 animate-mask-wipe overflow-hidden bg-sky-300">
                                <svg className="w-full h-full" viewBox="0 0 400 224" xmlns="http://www.w3.org/2000/svg">
                                    {/* Sky is bg color */}
                                    {/* Distant Ground/Hills */}
                                    <path d="M0 160 Q 100 140 200 160 T 400 150 L 400 224 L 0 224 Z" fill="#86efac"/>
                                    {/* emerald-300 */}
                                    {/* Foreground Grass */}
                                    <rect x="0" y="180" width="400" height="44" fill="#22c55e"/>
                                    {/* emerald-500 */}

                                    {/* Detailed Objects to be removed */}
                                    {/* Tree Left */}
                                    <g transform="translate(40, 120)">
                                        <rect x="8" y="40" width="14" height="60" fill="#92400e"/>
                                        {/* trunk */}
                                        <circle cx="15" cy="30" r="35" fill="#166534"/>
                                        {/* leaves dark */}
                                        <circle cx="15" cy="25" r="25" fill="#15803d"/>
                                        {/* leaves light */}
                                    </g>

                                    {/* Tree Right (Distant) */}
                                    <g transform="translate(320, 140) scale(0.8)">
                                        <rect x="10" y="30" width="10" height="50" fill="#92400e"/>
                                        <path d="M0 40 L 15 10 L 30 40 Z" fill="#166534"/>
                                        <path d="M5 25 L 15 0 L 25 25 Z" fill="#15803d"/>
                                    </g>

                                    {/* Park Bench / Random Object */}
                                    <g transform="translate(240, 175)">
                                        <rect x="0" y="10" width="60" height="5" fill="#78350f"/>
                                        <rect x="5" y="15" width="5" height="15" fill="#57534e"/>
                                        <rect x="50" y="15" width="5" height="15" fill="#57534e"/>
                                    </g>

                                    {/* Small Bush */}
                                    <g transform="translate(180, 190)">
                                        <circle cx="10" cy="10" r="15" fill="#16a34a"/>
                                        <circle cx="25" cy="5" r="12" fill="#22c55e"/>
                                    </g>
                                </svg>
                            </div>

                            {/* LAYER 3: Slider Bar */}
                            <div className="absolute top-0 bottom-0 z-20 w-1.5 animate-slider-bar pointer-events-none">
                                <div
                                    className="w-full h-full bg-gradient-to-b from-blue-500 via-violet-500 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md border border-blue-100 flex items-center justify-center">
                                    <div className="w-0.5 h-2 bg-blue-400 rounded-full"></div>
                                </div>
                            </div>

                            {/* LAYER 4: The Dog (Always Visible) */}
                            <div className="relative z-30 animate-dog-life mt-6">
                                <svg width="140" height="140" viewBox="0 0 200 200" className="drop-shadow-xl">
                                    <defs>
                                        <linearGradient id="furGradientLight" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#fbbf24"/>
                                            {/* Amber 400 */}
                                            <stop offset="100%" stopColor="#d97706"/>
                                            {/* Amber 600 */}
                                        </linearGradient>
                                    </defs>
                                    <path d="M60 160 Q 50 130 70 110 L 130 110 Q 150 130 140 160 L 140 200 L 60 200 Z"
                                          fill="url(#furGradientLight)"/>
                                    <path d="M90 140 Q 100 160 110 140 Q 100 125 90 140" fill="#fffbeb" opacity="0.9"/>
                                    <path d="M65 70 Q 40 80 45 110 Q 55 120 70 95" fill="#b45309"/>
                                    <path d="M135 70 Q 160 80 155 110 Q 145 120 130 95" fill="#b45309"/>
                                    <path
                                        d="M70 50 Q 100 30 130 50 Q 145 70 140 90 Q 135 110 100 115 Q 65 110 60 90 Q 55 70 70 50"
                                        fill="url(#furGradientLight)"/>
                                    <ellipse cx="100" cy="92" rx="20" ry="16" fill="#fef3c7"/>
                                    <path d="M92 88 Q 100 85 108 88 Q 105 98 100 100 Q 95 98 92 88" fill="#1e1b4b"/>
                                    <path d="M95 100 Q 100 105 105 100" fill="none" stroke="#1e1b4b" strokeWidth="2"
                                          strokeLinecap="round"/>
                                    <circle cx="82" cy="70" r="5" fill="#1e1b4b"/>
                                    <circle cx="118" cy="70" r="5" fill="#1e1b4b"/>
                                    <circle cx="84" cy="68" r="1.5" fill="white"/>
                                    <circle cx="120" cy="68" r="1.5" fill="white"/>
                                </svg>
                            </div>

                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-violet-600 transition-colors flex items-center gap-2">
                                DeepMask AI
                                <ExternalIcon/>
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                                Achieve studio-grade background removal with sub-pixel precision. Designed for complex
                                semantic segmentation on a zero-retention security pipeline.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <TechTag label="Segmentation"/>
                                <TechTag label="PyTorch"/>
                                <TechTag label="FastAPI"/>
                            </div>
                        </div>
                    </a>

                    {/* --- COMING SOON CARD --- */}
                    <div
                        className="group relative flex flex-col h-full min-h-[400px] bg-white/40 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-8 items-center justify-center text-center transition-all duration-500 hover:bg-white/60 hover:border-blue-300">
                        {/* Animated Beaker Icon */}
                        <div
                            className="w-20 h-20 rounded-3xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-6 animate-pulse-subtle">
                            <span
                                className="text-4xl filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">🧪</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-700 mb-2">Coming Soon</h3>

                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">
                            Next-generation generative video models currently in training.
                        </p>

                        {/* Loading Dots */}
                        <div className="mt-8 flex gap-1.5 opacity-40">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></div>
                            <div
                                className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></div>
                            <div
                                className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>

                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="mt-20 border-t border-slate-200 bg-white/40 backdrop-blur-sm py-8 relative z-10">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div
                        className="flex items-center gap-3">
                        <img src="/logo_full.png" alt="HPK AI Labs Logo" className="h-14 w-auto"/>
                        <span className="text-xl font-bold text-slate-700">HPK AI LABS</span>
                    </div>

                    <div className="flex gap-6 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                        <span> &copy; <strong>{new Date().getFullYear()}</strong> All rights reserved.</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}

// --- HELPER COMPONENTS ---

const TechTag = ({label}) => (
    <span
        className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded transition-colors group-hover:border-blue-200 group-hover:text-blue-600 group-hover:bg-blue-50">
        {label}
    </span>
);

const ExternalIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
         strokeLinecap="round" strokeLinejoin="round"
         className="opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
        <path d="M7 17L17 7"/>
        <path d="M7 7h10v10"/>
    </svg>
);

export default App;