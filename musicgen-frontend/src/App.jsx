import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Download, Cpu, Music, Activity, AlertCircle, Layers, Zap, Radio, Settings, Database, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

// --- CONFIGURATION ---
const API_URL = "https://ai.ravelian.com/generate";

// --- STYLES ---
const styles = `
  @keyframes float {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.5;
    animation: float 15s infinite ease-in-out;
    mix-blend-mode: screen;
  }

  .glass-panel {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }

  /* Custom scrollbar for the textarea */
  textarea::-webkit-scrollbar {
    width: 8px;
  }
  textarea::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
  }
  textarea::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 4px;
  }
`;

// --- COMPONENTS ---

const SpecItem = ({ label, value }) => (
  <div className="flex flex-col p-3 bg-slate-950/40 rounded-lg border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
    <span className="text-[10px] uppercase tracking-widest text-indigo-300/50 font-bold mb-1">{label}</span>
    <span className="text-xs text-indigo-100 font-mono">{value}</span>
  </div>
);

const TechnicalInfo = () => (
  <div className="mt-12 relative overflow-hidden rounded-2xl glass-panel group">
    <div className="p-8 relative z-10">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Cpu className="text-indigo-400" size={24} />
        Architecture & Research
      </h3>

      {/* LAYOUT FIX: Changed to a direct grid (md:grid-cols-2).
         This ensures Row 1 items match height, and Row 2 items start at the exact same vertical line.
      */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 text-sm leading-relaxed text-slate-300 mb-10">

        {/* Item 1 */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-indigo-400 mb-3">
            <Layers size={16} />
            Neural Audio Compression
          </h4>
          <p className="text-slate-400">
            Raw audio is continuous and high-dimensional (44.1kHz). To model it effectively, we use <strong>EnCodec</strong>, a convolutional autoencoder that compresses audio into discrete latent codes using <strong>Residual Vector Quantization (RVQ)</strong>.
          </p>
        </div>

        {/* Item 2 */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-indigo-400 mb-3">
            <Zap size={16} />
            Autoregressive Transformer
          </h4>
          <p className="text-slate-400">
            The core is a <strong>Decoder-only Transformer</strong>. It predicts the next audio codebook pattern based on the history of previous tokens. By flattening the multi-codebook structure, the model learns melodic structure and acoustic details simultaneously.
          </p>
        </div>

        {/* Item 3 */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-indigo-400 mb-3">
            <Radio size={16} />
            Conditioning & Guidance
          </h4>
          <p className="text-slate-400">
            Text prompts are embedded using a frozen <strong>T5 Text Encoder</strong>. These embeddings cross-attend with the audio tokens during generation. We utilize <strong>Classifier-Free Guidance (CFG)</strong> to strictly adhere to your prompt.
          </p>
        </div>

        {/* Item 4 */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-indigo-400 mb-3">
            <Database size={16} />
            Large-Scale Training Data
          </h4>
          <p className="text-slate-400">
            The model is trained on 20,000 hours of licensed music, allowing it to learn a vast and diverse range of musical genres, instruments, and styles. This extensive dataset is key to its ability to generate high-quality, coherent audio.
          </p>
        </div>

      </div>

      {/* --- INFERENCE SPECS SECTION --- */}
      <div className="border-t border-white/5 pt-6">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-400 uppercase tracking-widest">
           <Settings size={14} />
           <span>Technical Specifications</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SpecItem label="Model Architecture" value="MusicGen-Medium (1.5B)" />
          <SpecItem label="Sampling Rate" value="32,000 Hz" />
          <SpecItem label="Context Window" value="30s Autoregressive" />
          <SpecItem label="Latent Dim" value="d_model = 1024" />

          <SpecItem label="Audio Codec" value="EnCodec (4 Codebooks)" />
          <SpecItem label="Attention Heads" value="16 Multi-Head Attn" />
          <SpecItem label="Quantization" value="Residual VQ (RVQ)" />
          <SpecItem label="Guidance Scale" value="CFG = 3.0" />
        </div>
      </div>

    </div>
  </div>
);

const WavePlayer = ({ audioBlob, duration }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !audioBlob) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(129, 140, 248, 0.3)', // Indigo-400 faded
      progressColor: '#818cf8', // Indigo-400
      cursorColor: '#ffffff',
      barWidth: 3,
      barGap: 3,
      barRadius: 3,
      height: 96,
      normalize: true,
      backend: 'WebAudio',
    });

    ws.loadBlob(audioBlob);
    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('audioprocess', (t) => setCurrentTime(t));
    ws.on('seek', (rel) => setCurrentTime(ws.getDuration() * rel));
    ws.on('finish', () => setIsPlaying(false));

    wavesurferRef.current = ws;
    return () => ws.destroy();
  }, [audioBlob]);

  const handlePlayPause = () => wavesurferRef.current?.playPause();

  const handleDownload = () => {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `musicgen_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-6 shadow-2xl relative group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
            <Music className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Generated Track</h3>
            <p className="text-xs text-indigo-300/80 font-mono uppercase tracking-wider">AI Generated • {duration}s</p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600"
        >
          <Download size={14} /> DOWNLOAD WAV
        </button>
      </div>
      <div ref={containerRef} className="w-full mb-6 cursor-pointer" />
      <div className="flex items-center gap-6">
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center w-14 h-14 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full transition-all shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <div className="font-mono text-sm text-slate-400">
          <span className="text-white">{formatTime(currentTime)}</span>
          <span className="mx-2 text-slate-600">/</span>
          {formatTime(duration)}
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---

function App() {
  const [formData, setFormData] = useState({ prompt: '', duration: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioResult, setAudioResult] = useState(null);
  const [generatedDuration, setGeneratedDuration] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.prompt.trim()) return;
    setLoading(true);
    setError(null);
    setAudioResult(null);

    const payload = { ...formData, loudness_norm: true };

    try {
      const response = await axios.post(API_URL, payload, {
        responseType: 'blob',
        timeout: 300000,
      });
      setAudioResult(response.data);
      setGeneratedDuration(formData.duration);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Connection failed. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="min-h-screen text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden font-sans">

        {/* --- LAYER 1: Solid Background Color --- */}
        <div className="fixed inset-0 bg-[#0B1121] -z-50" />

        {/* --- LAYER 2: Moving Blobs --- */}
        <div className="fixed inset-0 overflow-hidden -z-40 pointer-events-none">
           <div
             className="blob"
             style={{ top: '-10%', left: '-10%', width: '600px', height: '600px', backgroundColor: '#4f46e5' }}
           />
           <div
             className="blob"
             style={{ top: '0%', right: '-20%', width: '700px', height: '700px', backgroundColor: '#0891b2', animationDelay: '2s' }}
           />
           <div
             className="blob"
             style={{ bottom: '-20%', left: '10%', width: '600px', height: '600px', backgroundColor: '#7c3aed', animationDelay: '5s' }}
           />
        </div>

        {/* --- LAYER 3: Cinematic Noise Texture --- */}
        <div className="fixed inset-0 -z-30 opacity-[0.15] mix-blend-overlay pointer-events-none"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#0B1121]/80 to-[#0B1121] -z-20"></div>


        {/* --- LAYER 4: Main Content --- */}
        <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

          <header className="mb-16 text-center relative">
            <div className="inline-block px-3 py-1 mb-4 border border-indigo-400/30 rounded-full bg-indigo-500/10 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <span className="text-xs font-bold text-indigo-300 tracking-widest uppercase">Generative Audio AI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl leading-tight">
              Text to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Music</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
              Generate high-fidelity audio samples conditioned on text descriptions using
              Meta's <span className="text-white font-medium">MusicGen</span> transformer model.
            </p>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 items-start">

            <div className="lg:col-span-4">
              <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl shadow-2xl sticky top-8 hover:border-indigo-400/30 transition-all duration-300">
                <div className="space-y-8">
                  <div>
                    <label className="flex items-center justify-between text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">
                      <span>Sonic Description</span>
                      <span className="text-[10px] text-indigo-300/70 font-normal bg-indigo-500/10 px-2 py-1 rounded-full">Required</span>
                    </label>
                    <textarea
                      value={formData.prompt}
                      onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                      placeholder="e.g. An 80s synthwave track with driving bass and neon atmosphere..."
                      className="w-full h-44 px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none text-sm resize-none transition-all placeholder:text-slate-600 leading-relaxed text-slate-200 shadow-inner"
                      maxLength={500}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <label className="font-bold text-slate-300 uppercase tracking-wider">Duration</label>
                      <span className="text-indigo-300 font-mono font-bold bg-indigo-500/10 px-3 py-1 rounded-md text-xs border border-indigo-500/20">
                        {formData.duration}s
                      </span>
                    </div>
                    <div className="relative flex items-center h-4 group">
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 relative z-10 group-hover:accent-indigo-400 transition-all"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-600 mt-2">
                      <span>1 Sec</span>
                      <span>30 Sec (Max)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl
                      ${loading
                        ? 'bg-slate-800 cursor-not-allowed text-slate-500 border border-slate-700'
                        : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5'
                      }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <Activity className="animate-spin" size={18} /> Processing...
                      </span>
                    ) : (
                      "Generate Audio"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-8">
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel rounded-2xl p-12 text-center border-dashed border-indigo-400/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>

                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-slate-800/50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Generating Audio Tokens</h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Running autoregressive inference on GPU...
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-4"
                >
                  <div className="p-2 bg-red-500/20 rounded-xl text-red-400">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-100">Generation Error</h4>
                    <p className="text-sm text-red-200/70 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {!loading && audioResult && (
                <WavePlayer audioBlob={audioResult} duration={generatedDuration} />
              )}

              {!loading && !audioResult && !error && (
                <div className="glass-panel rounded-2xl p-16 text-center hover:border-indigo-400/30 transition-all duration-300 group">
                  <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <Music size={36} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Ready to Generate</h3>
                  <p className="text-slate-400 text-base mt-2 max-w-md mx-auto font-light leading-relaxed">
                    Describe the vibe, genre, or instruments you want to hear. Set the duration, and let the AI compose your track.
                  </p>
                </div>
              )}

              <TechnicalInfo />

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;