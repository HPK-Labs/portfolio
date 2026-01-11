import React from 'react';

// Simple Icons
const ExternalLink = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="ml-1">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);

function App() {
    return (
        <div
            className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">

            {/* Navigation */}
            <nav className="border-b border-neutral-200 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-bold text-xl tracking-tight">
                        <img src="/logo_full.png" alt="HPK AI Labs Logo" className="h-12 w-auto"/>
                        <span>HPK AI Labs</span>
                    </div>
                    <div className="text-sm text-neutral-500">Portfolio</div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="py-20 px-6 border-b border-neutral-100">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-neutral-900">
                        Building the future of <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Generative Intelligence.</span>
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
                        A collection of research prototypes and generative tools exploring the capabilities of modern AI
                        architectures.
                    </p>
                </div>
            </header>

            {/* Projects Grid */}
            <main className="max-w-5xl mx-auto px-6 py-20">
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8">Projects</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* --- MUSICGEN CARD --- */}
                    {/* --- MUSICGEN CARD --- */}
                    <a href="/musicgen/"
                       className="group block bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-2xl hover:border-neutral-300 transition-all duration-500 transform hover:-translate-y-1">
                        <div className="h-48 bg-[#0f172a] relative overflow-hidden flex items-center justify-center">

                            {/* --- Animated Waveform Bars --- */}
                            {/* ADDED: transition-opacity and group-hover:opacity-70 for the "Boost" effect */}
                            <div
                                className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center gap-1 opacity-30 group-hover:opacity-70 transition-opacity duration-500">
                                {[...Array(30)].map((_, i) => (
                                    <div
                                        key={i}
                                        // ADDED: group-hover gradients to shift colors to be brighter (cyan/fuchsia)
                                        // ADDED: transition-all duration-500 for smooth color shift
                                        className="w-1 bg-gradient-to-t from-blue-600 to-purple-600 group-hover:from-cyan-400 group-hover:to-fuchsia-500 rounded-full animate-waveform transition-all duration-500"
                                        style={{
                                            // We keep the height random, but make the base height slightly taller
                                            height: `${Math.random() * 30 + 20}%`,
                                            animationDelay: `${i * 0.1}s`,
                                            // Slightly faster base animation for more energy
                                            animationDuration: `${Math.random() * 0.6 + 0.6}s`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Background Blobs - Added subtle movement on hover */}
                            <div
                                className="absolute top-[-50%] left-[-10%] w-[150%] h-[150%] bg-blue-600/10 rounded-full blur-3xl transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-4"></div>
                            <div
                                className="absolute bottom-[-50%] right-[-10%] w-[150%] h-[150%] bg-purple-600/10 rounded-full blur-3xl transition-transform duration-700 group-hover:-translate-x-4 group-hover:-translate-y-4"></div>

                            <span
                                className="text-white font-bold text-xl relative z-10 flex items-center gap-2 drop-shadow-md">Acoustic Intelligence </span>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">The Sonic
                                Transformer</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed">
                                Bring your sonic visions to life by translating descriptive text into professional-tier
                                high-fidelity music through neural modeling.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <span
                                    className="text-[10px] font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">PyTorch</span>
                                <span
                                    className="text-[10px] font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">ONNX</span>
                                <span
                                    className="text-[10px] font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">FastAPI</span>
                            </div>
                        </div>
                    </a>

                    {/* --- COMING SOON CARD --- */}
                    <div
                        className="border border-dashed border-neutral-200 rounded-xl p-8 flex flex-col items-center justify-center text-center text-neutral-400 bg-neutral-50/50 min-h-[300px]">
                        <span className="mb-2 text-2xl">🚧</span>
                        <span className="font-medium text-sm">More coming soon</span>
                    </div>

                </div>
            </main>

            <footer className="border-t border-neutral-200 py-12 text-center text-neutral-400 text-sm">
                <p>&copy; {new Date().getFullYear()} HPK AI Labs. All rights reserved.</p>
            </footer>

        </div>
    );
}

export default App;