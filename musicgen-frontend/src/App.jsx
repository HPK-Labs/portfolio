import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Download, Cpu, Music, Activity, AlertCircle, Zap, Radio, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

// --- CONFIGURATION ---
const API_URL = "https://ai.ravelian.com/generate"; // Verify this matches your backend

// --- COMPONENTS ---

/**
 * Technical Info Section
 * Expanded with deep-tech terminology (RVQ, CFG, etc.)
 */
const TechnicalInfo = () => (
  <div className="mt-12 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-md shadow-2xl">
    {/* Decorative background element */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -z-10"></div>

    <div className="p-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Cpu className="text-brand-accent" size={24} />
        Architecture & Research
      </h3>

      <div className="grid md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-300">
        <div className="space-y-6">
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-brand-accent mb-2">
              <Layers size={16} />
              Neural Audio Compression (EnCodec)
            </h4>
            <p className="text-slate-400">
              Raw audio is continuous and high-dimensional (44.1kHz). To model it effectively, we use <strong>EnCodec</strong>, a convolutional autoencoder that compresses audio into discrete latent codes using <strong>Residual Vector Quantization (RVQ)</strong>. This allows the model to predict multiple parallel streams of "audio tokens" rather than raw waveforms.
            </p>
          </div>
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-brand-accent mb-2">
              <Zap size={16} />
              Autoregressive Transformer
            </h4>
            <p className="text-slate-400">
              The core is a <strong>Decoder-only Transformer</strong> (similar to GPT-4). It predicts the next audio codebook pattern based on the history of previous tokens. By flattening the multi-codebook structure, the model learns both the coarse melodic structure and fine acoustic details simultaneously.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-brand-accent mb-2">
              <Radio size={16} />
              Conditioning & Guidance
            </h4>
            <p className="text-slate-400">
              Text prompts are embedded using a frozen <strong>T5 Text Encoder</strong>. These embeddings cross-attend with the audio tokens during generation. We utilize <strong>Classifier-Free Guidance (CFG)</strong> during inference to strictly adhere to your prompt, trading off diversity for higher fidelity and prompt alignment.
            </p>
          </div>
           <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <h4 className="font-semibold text-white mb-2 text-xs uppercase tracking-wider">Inference Specs</h4>
            <ul className="grid grid-cols-2 gap-y-2 text-xs text-slate-400">
              <li>• Model: Meta MusicGen Small/Medium</li>
              <li>• Context Window: 30s (Autoregressive)</li>
              <li>• Sampling Rate: 32kHz</li>
              <li>• Vocoder: EnCodec Decoder</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Waveform Player
 */
const WavePlayer = ({ audioBlob, duration }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !audioBlob) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(56, 189, 248, 0.3)', // brand-accent with opacity
      progressColor: '#38bdf8', // brand-accent
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
      className="bg-slate-900/60 backdrop-blur-md rounded-xl p-6 border border-brand-accent/20 shadow-2xl relative group"
    >
      {/* Glow effect behind player */}
      <div className="absolute inset-0 bg-brand-accent/5 rounded-xl blur-xl -z-10 transition-opacity group-hover:bg-brand-accent/10"></div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-accent/10 rounded-xl border border-brand-accent/20">
            <Music className="text-brand-accent" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Generated Track</h3>
            <p className="text-xs text-brand-accent/80 font-mono uppercase tracking-wider">AI Generated • {duration}s</p>
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
          className="flex items-center justify-center w-14 h-14 bg-brand-accent hover:bg-brand-glow text-brand-dark rounded-full transition-all shadow-lg shadow-brand-accent/25 hover:scale-105 active:scale-95"
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
  const [formData, setFormData] = useState({
    prompt: '',
    duration: 10,
    // loudness_norm is handled implicitly in submission
  });
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

    // Prepare payload with implicit loudness_norm
    const payload = {
      ...formData,
      loudness_norm: true
    };

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
    <div className="min-h-screen bg-brand-dark text-slate-200 selection:bg-brand-accent/30 selection:text-brand-accent relative overflow-x-hidden">

      {/* --- BACKGROUND EFFECTS --- */}
      {/* 1. Gradient Mesh */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-fast"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/10 rounded-full blur-[120px]"></div>
      </div>
      {/* 2. Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10"></div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-16 text-center relative">
          <div className="inline-block px-3 py-1 mb-4 border border-brand-accent/30 rounded-full bg-brand-accent/5 backdrop-blur-sm">
            <span className="text-xs font-bold text-brand-accent tracking-widest uppercase">Generative Audio AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-6 tracking-tight drop-shadow-sm">
            Text to Music
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Generate high-fidelity audio samples conditioned on text descriptions using
            Meta's <span className="text-white font-medium">MusicGen</span> transformer model.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Input Form (4 cols) */}
          <div className="lg:col-span-4">
            <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl sticky top-8">
              <div className="space-y-8">

                {/* Prompt Input */}
                <div>
                  <label className="flex items-center justify-between text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    <span>Sonic Description</span>
                    <span className="text-xs text-slate-500 font-normal">Required</span>
                  </label>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                    placeholder="e.g. An 80s synthwave track with driving bass and neon atmosphere..."
                    className="w-full h-40 px-4 py-4 bg-slate-950/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent/50 outline-none text-sm resize-none transition-all placeholder:text-slate-600 leading-relaxed text-slate-200"
                    maxLength={500}
                    required
                  />
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Duration</label>
                    <span className="text-brand-accent font-mono bg-brand-accent/10 px-2 py-0.5 rounded text-xs">
                      {formData.duration}s
                    </span>
                  </div>
                  <div className="relative flex items-center h-4">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent relative z-10"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-slate-600 mt-2">
                    <span>1 Sec</span>
                    <span>30 Sec (Max)</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl
                    ${loading
                      ? 'bg-slate-800 cursor-not-allowed text-slate-500 border border-slate-700'
                      : 'bg-brand-accent hover:bg-brand-glow text-brand-dark shadow-brand-accent/20 hover:shadow-brand-accent/40 hover:-translate-y-0.5'
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

          {/* Right Column: Results & Info (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-12 text-center border border-slate-800 border-dashed"
              >
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-brand-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Generating Audio Tokens</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Running autoregressive inference on GPU...
                </p>
                <div className="flex justify-center gap-1.5 h-8 items-center">
                   {[...Array(8)].map((_, i) => (
                     <motion.div
                       key={i}
                       className="w-1 bg-brand-accent rounded-full"
                       animate={{
                         height: [10, 32, 10],
                         opacity: [0.3, 1, 0.3]
                       }}
                       transition={{
                         duration: 1,
                         repeat: Infinity,
                         delay: i * 0.1
                       }}
                     />
                   ))}
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-4"
              >
                <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-red-200">Generation Error</h4>
                  <p className="text-sm text-red-200/70 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Audio Player Result */}
            {!loading && audioResult && (
              <WavePlayer audioBlob={audioResult} duration={generatedDuration} />
            )}

            {/* Placeholder when idle */}
            {!loading && !audioResult && !error && (
              <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-16 text-center border border-slate-800/50">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music size={32} className="text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">Ready to Generate</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                  Describe the music you want to hear, set the duration, and let the AI compose it.
                </p>
              </div>
            )}

            <TechnicalInfo />

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;