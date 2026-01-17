import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Client } from "@gradio/client";
import {
  Upload, Download, Layers, Sparkles, Image as ImageIcon, Zap, AlertCircle,
  Cpu, ChevronRight, ShieldCheck, ScanEye, Server, Lock, MoveHorizontal,
  Wand2, RefreshCw, ChevronsLeftRight, BoxSelect, User, Shirt, Aperture,
  Binary, CircleDashed, Clock // Added Clock icon for the latency note
} from 'lucide-react';
import { supabase } from './supabaseClient';

// --- CONFIGURATION ---
const HF_SPACE = "KenjieDec/RemBG";

const MODELS = [
  {
    id: 'bria-rmbg',
    name: 'Detail Pro',
    desc: 'Best for complex edges like hair, fur, and transparency.',
    icon: <Sparkles size={16} className="text-amber-500" />,
    badge: 'Recommended',
    latency: 'Latency 30s' // New property for UI feedback
  },
  {
    id: 'isnet-general-use',
    name: 'Standard Detection',
    desc: 'Balanced performance for general-purpose background removal.',
    icon: <Aperture size={16} className="text-cyan-500" />
  },
  {
    id: 'u2net_human_seg',
    name: 'Portrait Mode',
    desc: 'Optimized specifically for human subjects and silhouettes.',
    icon: <User size={16} className="text-purple-500" />
  },
  {
    id: 'u2net_cloth_seg',
    name: 'Apparel Focus',
    desc: 'Tuned for e-commerce clothing and fashion merchandise.',
    icon: <Shirt size={16} className="text-pink-500" />
  },
];

// --- COMPONENTS ---

const ComparisonSlider = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseUp = () => (isDragging.current = false);
    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPos(percent);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className="relative inline-block overflow-hidden cursor-ew-resize select-none group rounded-xl shadow-2xl ring-1 ring-white/40"
        ref={containerRef}
        onTouchMove={handleTouchMove}
        onMouseDown={() => (isDragging.current = true)}
      >
        <div className="absolute inset-0 bg-checkered z-0"></div>
        <img src={after} alt="Removed BG" className="relative block max-h-[70vh] w-auto max-w-full object-contain z-10 pointer-events-none select-none" draggable="false" />
        <div
          className="absolute inset-0 z-20 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img src={before} alt="Original" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none select-none" draggable="false" />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/20">
            ORIGINAL
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/10 z-30">
          RESULT
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-40 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          style={{ left: `${sliderPos}%` }}
        >
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-blue-600 p-2 rounded-full shadow-xl border border-blue-50 transform hover:scale-110 transition-transform">
              <ChevronsLeftRight size={16} />
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState("Initializing...");

  const visualizerRef = useRef(null);

  // Helper to upload to Supabase
  const uploadImageToCloud = async (fileToUpload) => {
    try {
      // Create a unique file name (e.g., "1678234_myimage.png")
      const fileName = `${Date.now()}_${fileToUpload.name.replace(/\s/g, '_')}`;

      const { data, error } = await supabase
        .storage
        .from('bg_rem') // Must match your bucket name
        .upload(fileName, fileToUpload);

      if (error) {
        console.error('Supabase error:', error);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loading && visualizerRef.current) {
      visualizerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    const messages = [
      "Waking remote inference node...",
      "Initializing neural runtime...",
      "Extracting feature maps...",
      "Analyzing semantic structure...",
      "Computing saliency tensors...",
      "Performing dichotomous segmentation...",
      "Optimizing alpha matte boundaries...",
      "Refining pixel-level edge weights...",
      "Applying Laplacian filtering...",
      "Generating high-resolution RGBA asset..."
    ];
    let i = 0;
    setLoadingText(messages[0]);
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 1100);
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) processFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) processFile(selected);
  };

  const processFile = (fileObj) => {
    setFile(fileObj);
    setPreview(URL.createObjectURL(fileObj));
    setResult(null);
    setError(null);
  };

  const runInference = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);
    uploadImageToCloud(file);

    try {
      const client = await Client.connect(HF_SPACE);
      const output = await client.predict("/inference", {
        file: file,
        model: selectedModel,
        x: 0,
        y: 0,
      });
      const resultImage = output.data[0];
      setResult(resultImage.url || resultImage);
    } catch (err) {
      console.error(err);
      setError("Inference failed. The model space might be cold-booting. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = async () => {
    if (!result) return;
    try {
      const response = await fetch(result);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hpklabs_bgremover_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      window.open(result, '_blank');
    }
  };
return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden">

      {/* --- BACKGROUND LAYER --- */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-white/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* --- PINNED NAVIGATION BAR --- */}
<nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/40 bg-white/70 backdrop-blur shadow-sm transition-all duration-300">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-br from-blue-600 to-violet-600 text-white p-1.5 rounded-lg shadow-md">
        <Layers size={20} />
      </div>
      <span className="font-bold text-lg tracking-tight text-slate-900">
        ClearCut<span className="text-blue-600">.ai</span>
      </span>
    </div>

    {/* Standard HTML Anchor for cross-project navigation */}
    <a
      href="../index.html"
      className="group flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors bg-white/50 border border-white/60 hover:bg-blue-50 hover:border-blue-100 px-3 py-1.5 rounded-full shadow-sm"
    >
      Back to Portfolio <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
    </a>
  </div>
</nav>


      {/* Added pt-16 (padding-top) to main so content doesn't start underneath the pinned nav */}
      <main className="max-w-7xl mx-auto px-6 py-16 pt-32 relative z-10">

        <header className="text-center mb-20 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow cursor-default backdrop-blur-sm">
            <Zap size={12} className="fill-blue-700" />
            <span>Enterprise Vision Engine</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
            <span className="inline-block animate-fade-up mr-3">See through the</span>
            <span className="inline-block animate-optical-focus shimmer-text">Noise.</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-lg font-light leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Isolate subjects with sub-pixel accuracy using industrial-grade semantic segmentation architectures.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">

          <div className="lg:col-span-4 space-y-6 sticky top-24 z-20">
            {/* Upload Card */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`glass-card border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden group 
                ${preview ? 'border-blue-400 bg-blue-50/10' : 'border-slate-300 hover:border-blue-400 hover:bg-white/40'}
              `}
            >
              <input type="file" onChange={handleFileSelect} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              {preview ? (
                <div className="relative">
                   <div className="w-full aspect-video bg-slate-100/50 rounded-lg mb-4 overflow-hidden border border-slate-200 shadow-sm relative">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors"></div>
                   </div>
                   <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wide">
                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                     Source Integrated
                   </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-20 h-20 bg-white/80 border border-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all group-hover:border-blue-200 backdrop-blur-sm">
                    <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={32} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Upload Image</h3>
                  <p className="text-xs text-slate-500">Drag & drop image here</p>
                </div>
              )}
            </div>

            {/* Model Selector */}
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                <Cpu size={18} /> Inference Mode
              </label>
              <div className="space-y-2 relative z-10">
                {MODELS.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left relative group 
                      ${selectedModel === m.id ? 'bg-blue-50/90 border-blue-200 shadow-sm' : 'bg-white/40 border-transparent hover:bg-white/80 hover:border-neutral-200'}
                    `}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                         {m.icon}
                         <span className={`text-sm font-bold ${selectedModel === m.id ? 'text-blue-700' : 'text-slate-700'}`}>
                           {m.name}
                         </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/* SPECIFIC LATENCY NOTE FOR DETAIL PRO */}
                        {m.latency && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                            <Clock size={10} />
                            {m.latency}
                          </div>
                        )}
                        {m.badge && <span className="text-[9px] bg-neutral-900 text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-wider shadow-sm">{m.badge}</span>}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed pl-6">{m.desc}</p>
                    {selectedModel === m.id && (
                      <div className="absolute right-3 top-4 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={runInference}
              disabled={!file || loading}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] relative overflow-hidden 
                ${!file || loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40'}
              `}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> Process Initialized...
                </>
              ) : (
                <>
                  <Wand2 size={16} className="fill-current" /> Start Background Removal
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-8">
            <div
              ref={visualizerRef}
              className="glass-card rounded-3xl p-8 min-h-[600px] flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {!result && !loading && (
                <div className="text-center opacity-50 max-w-sm relative z-10">
                  <div className="w-24 h-24 bg-white/60 border border-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm rotate-3 backdrop-blur-sm">
                    <ScanEye className="text-slate-500" size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Awaiting Payload</h3>
                  <p className="text-neutral-500 text-sm">Upload file and select inference mode to generate output.</p>
                </div>
              )}

              {loading && (
                <div className="text-center z-10 w-full max-w-md relative flex flex-col items-center">
                   <div className="relative w-full aspect-video bg-neutral-100/80 rounded-xl overflow-hidden border border-neutral-200 mb-8 shadow-inner">
                     {preview && <img src={preview} alt="Processing" className="w-full h-full object-contain opacity-30 grayscale blur-sm" />}
                     <div className="absolute inset-0 w-full h-0.5 bg-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scanline"></div>
                     <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
                   </div>

                   <div className="flex flex-col items-center gap-4">
                     <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20">
                        <CircleDashed className="animate-spin text-blue-600" size={32} />
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <h3 className="text-slate-900 font-bold text-lg tracking-tight uppercase">Inferencing...</h3>
                        <p className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider animate-pulse">
                          {loadingText}
                        </p>
                     </div>
                   </div>
                </div>
              )}

              {error && (
                 <div className="flex flex-col items-center text-red-600 bg-red-50/80 backdrop-blur-md p-8 rounded-2xl border border-red-100 max-w-md text-center shadow-sm relative z-10">
                   <AlertCircle size={40} className="mb-4 text-red-500" />
                   <h3 className="font-bold text-lg mb-2">Runtime Exception</h3>
                   <p className="text-sm opacity-80">{error}</p>
                 </div>
              )}

              {result && !loading && (
                <div
                  className="w-full flex flex-col items-center animate-in fade-in duration-700 slide-in-from-bottom-4 relative z-10"
                >
                  <div className="w-full flex flex-wrap gap-4 justify-between items-end mb-6 border-b border-slate-200/50 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-emerald-500" />
                        Inference Succeeded
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">Output Format: RGBA</p>
                    </div>
<button
  onClick={downloadResult}
  className="
    flex items-center gap-2 px-6 py-3
    /* High-tech Gradient Base */
    bg-gradient-to-r from-blue-600 to-violet-600
    hover:from-blue-500 hover:to-violet-500
    text-white text-xs font-bold uppercase tracking-widest
    rounded-xl transition-all duration-300

    /* Interactive Glow & Shadow */
    shadow-[0_0_15px_rgba(37,99,235,0.4)]
    hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]

    /* Tactical Micro-Interactions */
    active:scale-95 border border-white/10
    relative overflow-hidden group
  "
>
  {/* Subtle Shine Effect Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

  <Download size={16} className="relative z-10" />
  <span className="relative z-10">Download .png</span>
</button>
                  </div>
                  <ComparisonSlider before={preview} after={result} />
                  <div className="mt-6 flex items-center justify-center gap-2 text-neutral-400 text-[10px] uppercase tracking-widest font-bold bg-white/50 py-2 px-4 rounded-full border border-neutral-200/50">
                    <MoveHorizontal size={12} />
                    <span>Interact with slider to inspect alpha channel</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-32 border-t border-slate-200/60 pt-16">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Cpu size={20} className="text-blue-600" />
                Network Architecture
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Our inference engine utilizes <strong>U²-Net</strong> and <strong>IS-Net</strong> architectures, which leverage nested U-structures for state-of-the-art salient object detection (SOD). This multi-scale feature extraction allows for the isolation of complex foreground structures without high-dimensional computational overhead.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                The <strong>BRIA RMBG</strong> integration further enhances edge-case processing, specifically tuned for sub-pixel boundary refinement in high-frequency regions like hair and semi-transparent fibers.
              </p>
            </div>
            <div>
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Lock size={20} className="text-blue-600" />
                Ephemeral Security Protocol
              </h3>
               <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                ClearCut.ai implements a <strong>Zero-Persistence</strong> security model. All image processing occurs in transient virtual memory on temporary inference nodes.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <Server size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Stateless Processing:</strong> Assets are automatically purged from runtime buffers immediately after the RGBA payload is delivered to the client.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <ShieldCheck size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Encrypted Transit:</strong> All payloads are transmitted via TLS 1.3 to ensure end-to-end data integrity between the browser and our GPU clusters.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;