import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Download, Volume2, Cpu, Music, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
// REPLACE THIS with your actual local backend URL if different
const API_URL = "https://ai.ravelian.com/generate";

// --- COMPONENTS ---

/**
 * Technical Info Section
 * Explains how MusicGen works to showcase technical knowledge.
 */
const TechnicalInfo = () => (
  <div className="mt-12 p-6 bg-brand-card rounded-xl border border-slate-700/50 shadow-lg">
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <Cpu className="text-brand-accent" size={20} />
      How It Works: The MusicGen Architecture
    </h3>
    <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
      <div>
        <h4 className="font-semibold text-brand-accent mb-2">Audio Tokenization (EnCodec)</h4>
        <p className="mb-4">
          Unlike traditional audio generation that works on raw spectrograms, this system uses
          Facebook's <strong>EnCodec</strong> neural audio codec. It compresses raw audio into distinct
          discrete codes (tokens), similar to how LLMs process text tokens.
        </p>
        <h4 className="font-semibold text-brand-accent mb-2">Transformer Decoder</h4>
        <p>
          The core is a single-stage <strong>Transformer Language Model</strong>. It takes your text prompt
          and predicts the audio tokens autoregressively. It models the audio structure (melody, rhythm)
          simultaneously across multiple codebooks.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-brand-accent mb-2">Conditioning</h4>
        <p className="mb-4">
          The text prompt is processed via a T5 text encoder. This embedding conditions the Transformer,
          steering the generation probabilities towards the desired musical style and instrumentation.
        </p>
        <h4 className="font-semibold text-brand-accent mb-2">Technical Specs</h4>
        <ul className="list-disc pl-5 space-y-1 text-slate-400">
          <li><strong>Sampling Rate:</strong> 32kHz</li>
          <li><strong>Architecture:</strong> Autoregressive Transformer</li>
          <li><strong>Post-processing:</strong> Loudness Normalization (-14 LUFS)</li>
        </ul>
      </div>
    </div>
  </div>
);

/**
 * Waveform Player
 * Handles visualization, playing, pausing, and downloading.
 */
const WavePlayer = ({ audioBlob, duration }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !audioBlob) return;

    // Create WaveSurfer instance
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#334155',
      progressColor: '#38bdf8',
      cursorColor: '#ffffff',
      barWidth: 2,
      barGap: 3,
      barRadius: 3,
      height: 80,
      normalize: true,
      backend: 'WebAudio',
    });

    // Load blob
    ws.loadBlob(audioBlob);

    // Event listeners
    ws.on('ready', () => console.log('Waveform ready'));
    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('audioprocess', (t) => setCurrentTime(t));
    ws.on('seek', (rel) => setCurrentTime(ws.getDuration() * rel));
    ws.on('finish', () => setIsPlaying(false));

    wavesurferRef.current = ws;

    return () => ws.destroy();
  }, [audioBlob]);

  const handlePlayPause = () => {
    wavesurferRef.current?.playPause();
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated_music_${Date.now()}.wav`;
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
      className="bg-brand-card rounded-xl p-6 border border-slate-700 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-accent/10 rounded-lg">
            <Music className="text-brand-accent" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Generated Track</h3>
            <p className="text-xs text-slate-400">MusicGen • {duration}s • 32kHz</p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
        >
          <Download size={14} /> Download WAV
        </button>
      </div>

      <div ref={containerRef} className="w-full mb-4 cursor-pointer" />

      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center w-12 h-12 bg-brand-accent hover:bg-brand-glow text-brand-dark rounded-full transition-all shadow-lg shadow-brand-accent/20"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>
        <div className="font-mono text-sm text-slate-400">
          {formatTime(currentTime)} / {formatTime(duration)}
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
    loudness_norm: true
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

    try {
      // NOTE: Axios responseType must be 'blob' for binary files
      const response = await axios.post(API_URL, formData, {
        responseType: 'blob',
        timeout: 300000, // 5 minutes timeout (generation is slow)
      });

      setAudioResult(response.data);
      setGeneratedDuration(formData.duration);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to generate audio. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 selection:bg-brand-accent/30 selection:text-brand-accent">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-purple-400 mb-4 tracking-tight">
            AI Music Generator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Generate high-fidelity music samples from text descriptions using
            Meta's <span className="text-brand-accent font-medium">MusicGen</span> model.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Input Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-brand-card p-6 rounded-xl border border-slate-700 shadow-xl sticky top-6">
              <div className="space-y-6">

                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                    placeholder="Lo-fi hip hop beat with jazz piano..."
                    className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none text-sm resize-none transition-all placeholder:text-slate-600"
                    maxLength={500}
                    required
                  />
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <label className="font-medium text-slate-300">Duration</label>
                    <span className="text-brand-accent font-mono">{formData.duration}s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30" // Keeping it safe for demo, backend caps at 300
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1s</span>
                    <span>30s</span>
                  </div>
                </div>

                {/* Loudness Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-slate-400"/>
                    <span className="text-sm text-slate-300">Normalize Audio</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.loudness_norm}
                    onChange={(e) => setFormData({...formData, loudness_norm: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-600 text-brand-accent focus:ring-brand-accent bg-slate-700"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg
                    ${loading
                      ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                      : 'bg-gradient-to-r from-brand-accent to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-brand-accent/25'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Activity className="animate-spin" size={16} /> Generating...
                    </span>
                  ) : (
                    "Generate Music"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Results & Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-brand-card rounded-xl p-12 text-center border border-slate-700 border-dashed"
              >
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-brand-accent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-white mt-6">Composing your track</h3>
                <p className="text-slate-400 mt-2 text-sm">
                  Inference takes time. The Transformer is predicting audio tokens...
                </p>
                <div className="mt-4 flex justify-center gap-1">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="w-1 h-8 bg-brand-accent/50 rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold">Generation Failed</h4>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* Audio Player Result */}
            {!loading && audioResult && (
              <WavePlayer audioBlob={audioResult} duration={generatedDuration} />
            )}

            {/* Placeholder when idle */}
            {!loading && !audioResult && !error && (
              <div className="bg-brand-card/50 rounded-xl p-12 text-center border border-slate-800 text-slate-500">
                <Music size={48} className="mx-auto mb-4 opacity-20" />
                <p>Enter a prompt and click generate to create music.</p>
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