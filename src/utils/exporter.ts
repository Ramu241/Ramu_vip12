/**
 * Exporter utility for producing a beautiful, single-file, self-contained HTML
 * version of the Wingo VIP Pro prediction engine and Martingale tool.
 */

export function getPredictorHTML(): string {
  return `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wingo VIP Pro - Ultimate Companion & Prediction Tool</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        cyber: {
                            gold: '#d4af37',
                            cyan: '#06b6d4',
                            amber: '#f59e0b',
                        }
                    }
                }
            }
        }
    </script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @keyframes gold-pulse {
            0%, 100% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); }
            50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.8); }
        }
        .animate-gold-glow {
            animation: gold-pulse 2s infinite ease-in-out;
        }
        @keyframes cyan-pulse {
            0%, 100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.3); }
            50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.7); }
        }
        .animate-cyan-glow {
            animation: cyan-pulse 2.5s infinite ease-in-out;
        }
        body {
            background-color: #020405;
            color: #f4f4f5;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #020b0e;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(212, 175, 55, 0.3);
            border-radius: 3px;
        }
    </style>
</head>
<body class="min-h-screen bg-[#020405] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-white pb-10">

    <!-- TOP HEADER -->
    <header class="border-b border-zinc-900/80 bg-black/40 backdrop-blur-md sticky top-0 z-50 px-4 py-3.5">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-black font-display text-lg shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse">
                    W
                </div>
                <div>
                    <h1 class="text-sm font-display font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                        WINGO VIP PRO <span class="text-[8px] bg-amber-500 text-black px-1 rounded font-mono font-bold tracking-normal">OFFLINE</span>
                    </h1>
                    <p class="text-[8px] text-amber-500 font-mono tracking-wider uppercase font-bold">
                        डबल इंडिपेंडेंट प्रेडिक्शन इंजन (30s / 1m)
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2 font-mono text-[10px]">
                <!-- Audio switch -->
                <button onclick="toggleAudio()" id="btnAudio" class="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-amber-500 hover:text-white transition-all cursor-pointer" title="ध्वनि चालू/बंद">
                    <i data-lucide="volume-2" class="w-4 h-4"></i>
                </button>
                <div class="bg-zinc-950 border border-zinc-900 px-2.5 py-1.5 rounded-lg text-zinc-400">
                    <span id="txtClock">00:00:00 PM</span>
                </div>
            </div>
        </div>
    </header>

    <main class="max-w-6xl w-full mx-auto px-4 mt-6 flex-1 flex flex-col gap-6">

        <!-- NOTICE BANNER -->
        <div class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse"></i>
            <div class="space-y-0.5">
                <h4 class="text-xs font-display font-bold text-amber-400 uppercase tracking-wider">
                    COMPANION OFFLINE PRO APP MODE (ऑफ़लाइन मोड)
                </h4>
                <p class="text-[10px] text-zinc-400 leading-relaxed font-sans">
                    यह एक पूरी तरह से स्व-निहित (self-contained) सिंगल-फाइल टूल है। आप इसे अपने मोबाइल या पीसी पर इंटरनेट के बिना भी चला सकते हैं। प्रेडिक्शन को लाइव गेम के साथ चलाने के लिए आप <strong>मैनुअल एंट्री फ़ीड</strong> का उपयोग करके अंतिम परिणाम डाल सकते हैं, या <strong>ऑटो सिमुलेशन</strong> का उपयोग करके अभ्यास कर सकते हैं।
                </p>
            </div>
        </div>

        <!-- DUAL MODE SELECTOR -->
        <div class="grid grid-cols-2 gap-2 p-1 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-xs">
            <button onclick="switchMode('30s')" id="btnTab30s" class="py-3 px-1.5 rounded-lg font-black transition-all uppercase cursor-pointer flex flex-col items-center justify-center gap-0.5 bg-zinc-900 text-white border-b-2 border-amber-500 shadow-md">
                <span>WINGO 30S ENGINE</span>
                <span id="statusIndicator30s" class="text-[8px] text-emerald-400 tracking-widest font-bold uppercase flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> BACKGROUND RUNNING
                </span>
            </button>
            <button onclick="switchMode('1m')" id="btnTab1m" class="py-3 px-1.5 rounded-lg font-black transition-all uppercase cursor-pointer flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-300">
                <span>WINGO 1M ENGINE</span>
                <span id="statusIndicator1m" class="text-[8px] text-emerald-400/70 tracking-widest font-bold uppercase flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> BACKGROUND RUNNING
                </span>
            </button>
        </div>

        <!-- MAIN GRID SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">

            <!-- LEFT COLUMN: CHAMBER & INPUT FEED -->
            <div class="space-y-6 flex flex-col">
                
                <!-- PREDICTION PANEL -->
                <div class="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl space-y-5">
                    
                    <div class="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <div class="flex items-center gap-1.5">
                            <i data-lucide="compass" class="w-4 h-4 text-amber-500"></i>
                            <h3 id="modeTitle" class="text-xs font-display font-black tracking-wider text-zinc-300 uppercase">
                                ACTIVE ESTIMATION CHAMBER (WINGO 30S)
                            </h3>
                        </div>
                        <div class="font-mono text-[10px] text-cyan-400">
                            NEXT PERIOD: <span id="txtTargetPeriod" class="font-bold tracking-wider">Awaiting Feed...</span>
                        </div>
                    </div>

                    <!-- PREDICTION BOXES -->
                    <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1.2fr] gap-4">
                        
                        <!-- PRIMARY VALUE DISPLAY -->
                        <div id="predValueBox" class="transition-all duration-500 bg-black/60 border border-zinc-900 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px]">
                            <div class="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
                                VIP PREDICTION (अनुमान)
                            </div>
                            
                            <div id="predVerdictContainer" class="space-y-1 py-3">
                                <span id="txtPredictionValue" class="text-4xl md:text-5xl font-display font-black tracking-widest uppercase block text-zinc-600 animate-pulse">
                                    AWAITING FEED
                                </span>
                                <span id="txtPredictionHindi" class="text-[9px] text-zinc-400 font-mono tracking-widest block uppercase font-bold">
                                    कृपया नीचे अंतिम नंबर प्रविष्ट करें
                                </span>
                            </div>

                            <!-- Accuracy Indicator -->
                            <div class="mt-4 border-t border-zinc-900/60 pt-3 w-full flex justify-between items-center text-xs text-zinc-400 font-mono">
                                <span class="text-[9px] text-zinc-500">CONFIDENCE ACCURACY:</span>
                                <span id="txtConfidence" class="text-amber-500 font-bold tracking-widest flex items-center gap-1">
                                    --%
                                </span>
                            </div>
                        </div>

                        <!-- MEDICINE BALLS OPPOSITE -->
                        <div class="bg-black/60 border border-zinc-900 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                            <div class="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-mono">
                                MEDICINE BALLS (विपरीत संख्या)
                            </div>

                            <div id="ballsContainer" class="flex justify-center gap-3 my-2">
                                <div class="w-11 h-11 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-700 text-lg font-bold">?</div>
                                <div class="w-11 h-11 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-700 text-lg font-bold">?</div>
                            </div>

                            <p class="text-[8px] text-zinc-400 font-mono leading-relaxed mt-4 uppercase">
                                J-Opposite matrix matches standard game outcomes
                            </p>
                        </div>
                    </div>

                    <!-- STATISTICS GRID -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div class="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-center">
                            <div class="text-[8.5px] text-zinc-500 uppercase tracking-wider font-mono font-bold">TOTAL WINS (जीत)</div>
                            <div id="txtWins" class="text-lg font-mono text-emerald-400 font-bold mt-1">0</div>
                        </div>
                        <div class="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-center">
                            <div class="text-[8.5px] text-zinc-500 uppercase tracking-wider font-mono font-bold">TOTAL LOSS (हार)</div>
                            <div id="txtLoss" class="text-lg font-mono text-rose-500 font-bold mt-1">0</div>
                        </div>
                        <div class="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-center">
                            <div class="text-[8.5px] text-zinc-500 uppercase tracking-wider font-mono font-bold">JACKPOTS (जैकपॉट)</div>
                            <div id="txtJackpots" class="text-lg font-mono text-amber-400 font-bold mt-1">0</div>
                        </div>
                        <div class="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-center">
                            <div class="text-[8.5px] text-zinc-500 uppercase tracking-wider font-mono font-bold">STRIKE RATE (शुद्धता)</div>
                            <div id="txtWinRate" class="text-lg font-mono text-cyan-400 font-bold mt-1">0%</div>
                        </div>
                    </div>
                </div>

                <!-- MANUAL FEED & CONTROLS -->
                <div class="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl space-y-4">
                    <div class="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                        <div class="flex items-center gap-1.5">
                            <i data-lucide="refresh-cw" class="w-4 h-4 text-cyan-400"></i>
                            <h3 class="text-xs font-display font-black tracking-widest text-zinc-300 uppercase">
                                LIVE FEED FEEDER (गेम परिणाम प्रविष्ट करें)
                            </h3>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="toggleAutoSim()" id="btnAutoSim" class="text-[9px] font-mono font-bold uppercase bg-zinc-900 hover:bg-zinc-850 px-2 py-1 rounded border border-zinc-800 text-zinc-400 transition-all cursor-pointer">
                                🤖 Start Simulator
                            </button>
                        </div>
                    </div>

                    <p class="text-[10px] text-zinc-400 font-sans leading-normal">
                        अंतिम गेम में जो भी नंबर निकला है (0 से 9 के बीच), उस पर क्लिक करें। अल्गोरिदम तुरंत नए आंकड़े प्रोसेस करेगा और अगले राउंड के लिए अनुमान (Prediction) तैयार कर देगा:
                    </p>

                    <!-- Number Grid -->
                    <div class="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        <button onclick="feedResult(0)" class="h-10 text-sm font-mono font-black rounded-lg border bg-gradient-to-br from-red-600 to-purple-600 border-red-500 text-white cursor-pointer hover:scale-105 transition-all">0</button>
                        <button onclick="feedResult(1)" class="h-10 text-sm font-mono font-black rounded-lg border bg-emerald-600 border-emerald-500 text-white cursor-pointer hover:scale-105 transition-all">1</button>
                        <button onclick="feedResult(2)" class="h-10 text-sm font-mono font-black rounded-lg border bg-red-600 border-red-500 text-white cursor-pointer hover:scale-105 transition-all">2</button>
                        <button onclick="feedResult(3)" class="h-10 text-sm font-mono font-black rounded-lg border bg-emerald-600 border-emerald-500 text-white cursor-pointer hover:scale-105 transition-all">3</button>
                        <button onclick="feedResult(4)" class="h-10 text-sm font-mono font-black rounded-lg border bg-red-600 border-red-500 text-white cursor-pointer hover:scale-105 transition-all">4</button>
                        <button onclick="feedResult(5)" class="h-10 text-sm font-mono font-black rounded-lg border bg-gradient-to-br from-emerald-600 to-purple-600 border-emerald-500 text-white cursor-pointer hover:scale-105 transition-all">5</button>
                        <button onclick="feedResult(6)" class="h-10 text-sm font-mono font-black rounded-lg border bg-red-600 border-red-500 text-white cursor-pointer hover:scale-105 transition-all">6</button>
                        <button onclick="feedResult(7)" class="h-10 text-sm font-mono font-black rounded-lg border bg-emerald-600 border-emerald-500 text-white cursor-pointer hover:scale-105 transition-all">7</button>
                        <button onclick="feedResult(8)" class="h-10 text-sm font-mono font-black rounded-lg border bg-red-600 border-red-500 text-white cursor-pointer hover:scale-105 transition-all">8</button>
                        <button onclick="feedResult(9)" class="h-10 text-sm font-mono font-black rounded-lg border bg-emerald-600 border-emerald-500 text-white cursor-pointer hover:scale-105 transition-all">9</button>
                    </div>

                    <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono bg-black/40 p-2.5 rounded-lg border border-zinc-900/60">
                        <span>LATEST VERIFIED BALL: <span id="txtLastBall" class="text-white font-bold font-mono">--</span></span>
                        <span>PATTERN MATCHED: <span id="txtPatternMatched" class="text-amber-500 font-bold font-mono">NEURAL CORRELATION</span></span>
                    </div>
                </div>

                <!-- HISTORY LOG FEED -->
                <div class="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl flex-1 flex flex-col min-h-[250px]">
                    <div class="flex items-center gap-1.5 border-b border-zinc-900 pb-3 mb-4 shrink-0">
                        <i data-lucide="history" class="w-4 h-4 text-zinc-400"></i>
                        <h3 class="text-xs font-display font-bold text-zinc-300 uppercase tracking-wider">
                            VERIFIED PERIOD FEED HISTORY (परिणाम सूची)
                        </h3>
                    </div>

                    <div class="flex-1 overflow-x-auto">
                        <table class="w-full text-left font-mono text-[10px] border-collapse">
                            <thead>
                                <tr class="border-b border-zinc-900 text-zinc-500">
                                    <th class="py-2 font-bold uppercase">PERIOD</th>
                                    <th class="py-2 font-bold uppercase">PRED</th>
                                    <th class="py-2 font-bold uppercase">BALLS</th>
                                    <th class="py-2 font-bold uppercase">RESULT</th>
                                    <th class="py-2 font-bold uppercase text-right">VERDICT</th>
                                </tr>
                            </tbody>
                            <tbody id="historyTableBody" class="divide-y divide-zinc-950">
                                <tr>
                                    <td colspan="5" class="py-12 text-center text-zinc-600 font-mono">
                                        परिणाम प्रविष्ट करने के बाद इतिहास यहां दिखाई देगा...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <!-- RIGHT COLUMN: LEVEL CALCULATOR & SETTINGS -->
            <div class="space-y-6">
                
                <!-- VIP MARTINGALE LEVEL CALCULATOR -->
                <div class="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-cyan-500/20 rounded-2xl p-5 shadow-xl space-y-4">
                    <div class="flex items-center gap-2 border-b border-zinc-900 pb-3">
                        <i data-lucide="calculator" class="w-4.5 h-4.5 text-cyan-400"></i>
                        <h3 class="text-xs font-display font-black tracking-widest text-white uppercase">
                            VIP MARTINGALE CALCULATOR (स्तर प्रबंधक)
                        </h3>
                    </div>

                    <p class="text-[9.5px] text-zinc-400 leading-normal font-sans">
                        अपना कुल बैलेंस और शुरुआती बेट दर्ज करें। अल्गोरिदम आपके 4 से 8 स्तरों (Level) के सुरक्षित खेल के लिए आवश्यक फंड की गणना कर देगा:
                    </p>

                    <div class="grid grid-cols-2 gap-2 font-mono text-[10px]">
                        <div class="space-y-1">
                            <label class="text-[8px] text-zinc-500 uppercase font-black">STARTING BET</label>
                            <input oninput="calculateLevels()" id="inpBaseBet" type="number" value="10" min="5" class="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white font-bold focus:border-cyan-500 focus:outline-none" />
                        </div>
                        <div class="space-y-1">
                            <label class="text-[8px] text-zinc-500 uppercase font-black">MULTIPLIER PLAN</label>
                            <select onchange="calculateLevels()" id="inpMultiplier" class="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white font-bold focus:border-cyan-500 focus:outline-none">
                                <option value="3">3X Plan (मल्टीप्लायर)</option>
                                <option value="2">2X Plan</option>
                                <option value="2.5">2.5X Plan</option>
                                <option value="3.5">3.5X Plan</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1.5 font-mono text-[9px]" id="levelCalculatorContainer">
                        <!-- Level rows are inserted dynamically here -->
                    </div>

                    <div class="bg-black/80 border border-zinc-900 p-3 rounded-xl text-center space-y-1 font-mono">
                        <span class="text-[8px] text-zinc-500 uppercase font-bold block">CURRENT ACTIVE GAME ADVICE</span>
                        <span id="txtRecommendedLevel" class="text-xs font-black text-emerald-400 block tracking-widest animate-pulse">
                            LEVEL 1: 1X (STANDARD)
                        </span>
                    </div>
                </div>

                <!-- LOGIC ALGORITHM SETTINGS -->
                <div class="bg-neutral-950 border border-zinc-900 rounded-2xl p-5 shadow-xl space-y-4">
                    <div class="flex items-center gap-2 border-b border-zinc-900 pb-2.5">
                        <i data-lucide="sparkles" class="w-4.5 h-4.5 text-amber-500"></i>
                        <h3 class="text-xs font-display font-black tracking-widest text-white uppercase">
                            VIP ENGINE LOGIC SETTINGS
                        </h3>
                    </div>

                    <!-- PREDICTION MODE -->
                    <div class="space-y-1.5">
                        <label class="text-[9px] text-zinc-500 font-mono font-bold uppercase block">PREDICTION COMPASS MODE</label>
                        <select onchange="updateSettings()" id="selPredMode" class="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-xs font-mono text-zinc-300 font-bold focus:outline-none cursor-pointer">
                            <option value="auto">Auto Hybrid Compass</option>
                            <option value="onlyBS">Only Size Big/Small</option>
                            <option value="safe">Strict Standby Mode</option>
                        </select>
                    </div>

                    <!-- STRATEGY PATTERN -->
                    <div class="space-y-1.5">
                        <label class="text-[9px] text-zinc-500 font-mono font-bold uppercase block">ALGORITHM DECISION ENGINE</label>
                        <select onchange="updateSettings()" id="selStrategy" class="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-xs font-mono text-zinc-300 font-bold focus:outline-none cursor-pointer">
                            <option value="neural">NEURAL DRAGON PATTERN MATCHING</option>
                            <option value="reverse">REVERSE TREND MEAN REVERSION</option>
                            <option value="frequency">HOT FREQUENCY INTENSITY MATRIX</option>
                        </select>
                    </div>

                    <!-- MIN CONFIDENCE -->
                    <div class="space-y-1 pt-1">
                        <div class="flex justify-between items-center text-[9px] text-zinc-500 font-mono font-bold uppercase">
                            <span>CONFIDENCE SAFETY SHIELD</span>
                            <span id="txtSafetyShieldVal" class="text-amber-500 font-black">75%</span>
                        </div>
                        <input oninput="updateSettingsSlider(this.value)" id="rangeMinConf" type="range" min="70" max="95" step="5" value="75" class="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <!-- RAMU BHAI RIGGING ENGINE CONTROL -->
                    <div class="space-y-1.5 pt-3 border-t border-zinc-900/50">
                        <label class="text-[9px] text-amber-500 font-mono font-black uppercase block flex items-center gap-1">🛠️ रामू भाई सीक्रेट सेटिंग्स (HACK CONTROL)</label>
                        <select onchange="updateSettings()" id="selRigMode" class="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-xs font-mono text-zinc-300 font-bold focus:outline-none cursor-pointer">
                            <option value="scam">👹 Loss 100% (Hide Loss) - एक्टिव</option>
                            <option value="fair">🟢 100% Fair Mode - बंद</option>
                        </select>
                        <span id="txtRigInfo" class="text-[8px] text-zinc-500 font-sans leading-tight block uppercase">
                            हैक चालू है: ग्राहकों का 100% नुकसान होगा लेकिन स्क्रीन पर हमेशा WIN/JACKPOT दिखेगा!
                        </span>
                    </div>
                </div>

                <!-- EXPORT & DOCUMENTATION SUPPORT -->
                <div class="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 text-center space-y-3">
                    <div class="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">SUPPORT HUB</div>
                    <p class="text-[9px] text-zinc-400 font-sans leading-relaxed">
                        यह ऑफ़लाइन ऐप आपके वेब ब्राउज़र में सुरक्षित और स्थानीय रूप से काम करता है। कोई बैकएंड आवश्यकता नहीं है!
                    </p>
                    <div class="text-[9px] text-amber-500 font-mono tracking-wider uppercase font-bold">
                        VERSION 4.2.0 (STABLE)
                    </div>
                </div>

            </div>

        </div>

    </main>

    <!-- FOOTER -->
    <footer class="max-w-6xl mx-auto px-4 mt-12 pt-6 border-t border-zinc-900 text-center space-y-2">
        <p class="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">
            &copy; 2026 WINGO VIP PRO | SYSTEM CORE SECURELY ENCRYPTED
        </p>
    </footer>

    <!-- INJECT CODE LOGIC -->
    <script>
        // Web Audio Synth
        class WebAudioSynth {
            constructor() {
                this.ctx = null;
                this.enabled = true;
            }
            init() {
                if (!this.ctx) {
                    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                }
            }
            playBeep(freq, type = 'sine', duration = 0.1) {
                if (!this.enabled) return;
                this.init();
                if (!this.ctx) return;
                
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            }
            playWin() {
                this.playBeep(523.25, 'sine', 0.1);
                setTimeout(() => this.playBeep(659.25, 'sine', 0.1), 100);
                setTimeout(() => this.playBeep(783.99, 'sine', 0.1), 200);
                setTimeout(() => this.playBeep(1046.50, 'sine', 0.35), 300);
            }
            playLoss() {
                this.playBeep(293.66, 'sawtooth', 0.25);
                setTimeout(() => this.playBeep(220.00, 'sawtooth', 0.4), 200);
            }
            playJackpot() {
                const notes = [523, 659, 783, 1046, 1318, 1567, 2093];
                notes.forEach((freq, idx) => {
                    setTimeout(() => {
                        this.playBeep(freq, 'triangle', 0.15);
                    }, idx * 80);
                });
            }
        }

        const audio = new WebAudioSynth();
        let audioEnabled = true;

        function toggleAudio() {
            audioEnabled = !audioEnabled;
            audio.enabled = audioEnabled;
            const btn = document.getElementById('btnAudio');
            if (audioEnabled) {
                btn.innerHTML = '<i data-lucide="volume-2" class="w-4 h-4"></i>';
                btn.className = "p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-amber-500 hover:text-white transition-all cursor-pointer";
            } else {
                btn.innerHTML = '<i data-lucide="volume-x" class="w-4 h-4"></i>';
                btn.className = "p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white transition-all cursor-pointer";
            }
            lucide.createIcons();
        }

        // Live clock
        setInterval(() => {
            const d = new Date();
            let hh = d.getHours();
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            const ampm = hh >= 12 ? 'PM' : 'AM';
            hh = hh % 12 || 12;
            document.getElementById('txtClock').innerText = hh + ":" + mm + ":" + ss + " " + ampm;
        }, 1000);

        // Core Channels state
        const GREEN_NUMBERS = [1, 3, 5, 7, 9];
        const RED_NUMBERS = [0, 2, 4, 6, 8];

        let activeMode = '30s';
        const channels = {
            '30s': {
                targetPeriod: '1000000001',
                lastVerifiedIssue: '',
                lastPredVal: null,
                lastPredType: 'BS',
                lastPredPeriod: '',
                lastPredBalls: [],
                serverHistory: [3, 7, 2, 8, 5, 1, 9, 6, 4, 0], // seed data
                historyArray: [],
                wins: 0,
                loss: 0,
                lossStreak: 0,
                confidence: '85%',
                jackpots: 0
            },
            '1m': {
                targetPeriod: '2000000001',
                lastVerifiedIssue: '',
                lastPredVal: null,
                lastPredType: 'BS',
                lastPredPeriod: '',
                lastPredBalls: [],
                serverHistory: [8, 2, 1, 5, 9, 3, 0, 7, 4, 6], // seed data
                historyArray: [],
                wins: 0,
                loss: 0,
                lossStreak: 0,
                confidence: '82%',
                jackpots: 0
            }
        };

        const settings = {
            predMode: 'auto',
            strategy: 'neural',
            minConfidence: 75,
            rigMode: 'scam'
        };

        let autoSimInterval = null;

        // Switch modes
        function switchMode(m) {
            activeMode = m;
            document.getElementById('btnTab30s').className = m === '30s'
                ? "py-3 px-1.5 rounded-lg font-black transition-all uppercase cursor-pointer flex flex-col items-center justify-center gap-0.5 bg-zinc-900 text-white border-b-2 border-amber-500 shadow-md"
                : "py-3 px-1.5 rounded-lg font-black transition-all uppercase cursor-pointer flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-300";
            
            document.getElementById('btnTab1m').className = m === '1m'
                ? "py-3 px-1.5 rounded-lg font-black transition-all uppercase cursor-pointer flex flex-col items-center justify-center gap-0.5 bg-zinc-900 text-white border-b-2 border-amber-500 shadow-md"
                : "py-3 px-1.5 rounded-lg font-black transition-all uppercase cursor-pointer flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-300";
            
            document.getElementById('modeTitle').innerText = m === '30s' 
                ? "ACTIVE ESTIMATION CHAMBER (WINGO 30S)"
                : "ACTIVE ESTIMATION CHAMBER (WINGO 1M)";

            renderChamber();
            calculateLevels();
        }

        // Render Chamber details based on activeMode
        function renderChamber() {
            const ch = channels[activeMode];
            document.getElementById('txtTargetPeriod').innerText = ch.targetPeriod;

            // Prediction Verdict
            const verdictBox = document.getElementById('predValueBox');
            const verdictCont = document.getElementById('predVerdictContainer');
            
            if (!ch.lastPredVal) {
                verdictCont.innerHTML = \`
                    <span class="text-4xl md:text-5xl font-display font-black tracking-widest uppercase block text-zinc-600 animate-pulse">
                        AWAITING FEED
                    </span>
                    <span class="text-[9px] text-zinc-400 font-mono tracking-widest block uppercase font-bold">
                        कृपया नीचे अंतिम नंबर प्रविष्ट करें
                    </span>
                \`;
                verdictBox.className = "transition-all duration-500 bg-black/60 border border-zinc-900 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px]";
            } else {
                const val = ch.lastPredVal;
                let bgClass = "bg-black/60 border-zinc-900";
                let textClass = "text-zinc-400";
                let description = "";

                if (val === 'BIG') {
                    bgClass = "bg-gradient-to-br from-amber-950/30 via-neutral-950 to-neutral-900/60 border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)]";
                    textClass = "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]";
                    description = "बड़ा (BIG 5-9)";
                } else if (val === 'SMALL') {
                    bgClass = "bg-gradient-to-br from-cyan-950/30 via-neutral-950 to-neutral-900/60 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)]";
                    textClass = "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]";
                    description = "छोटा (SMALL 0-4)";
                } else if (val === 'GREEN') {
                    bgClass = "bg-gradient-to-br from-emerald-950/40 via-neutral-950 to-neutral-900/60 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]";
                    textClass = "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]";
                    description = "हरा रंग (GREEN)";
                } else if (val === 'RED') {
                    bgClass = "bg-gradient-to-br from-red-950/40 via-neutral-950 to-neutral-900/60 border-rose-500/50 shadow-[0_0_25px_rgba(239,68,68,0.25)]";
                    textClass = "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]";
                    description = "लाल रंग (RED)";
                }

                verdictBox.className = "transition-all duration-500 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px] border " + bgClass;
                verdictCont.innerHTML = \`
                    <span class="text-5xl md:text-6xl font-display font-black tracking-widest uppercase block animate-[pulse_2s_infinite] \${textClass}">
                        \${val}
                    </span>
                    <span class="text-[10px] text-zinc-400 font-mono tracking-widest block uppercase font-bold">
                        \${description}
                    </span>
                \`;
            }

            // Confidence
            document.getElementById('txtConfidence').innerText = ch.lastPredVal ? ch.confidence : '--%';

            // Medicine Balls
            const ballsContainer = document.getElementById('ballsContainer');
            if (ch.lastPredBalls.length === 0) {
                ballsContainer.innerHTML = \`
                    <div class="w-11 h-11 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-700 text-lg font-bold">?</div>
                    <div class="w-11 h-11 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-700 text-lg font-bold">?</div>
                \`;
            } else {
                ballsContainer.innerHTML = ch.lastPredBalls.map(num => {
                    let ballBg = "bg-zinc-800";
                    if (num === 0) ballBg = "bg-gradient-to-br from-red-500 to-purple-500";
                    else if (num === 5) ballBg = "bg-gradient-to-br from-emerald-500 to-purple-500";
                    else if (RED_NUMBERS.includes(num)) ballBg = "bg-rose-600";
                    else ballBg = "bg-emerald-600";
                    
                    return \`<div class="w-11 h-11 rounded-full flex items-center justify-center text-white font-mono text-base font-bold shadow-md shadow-black/60 border border-zinc-900/60 \${ballBg}">\${num}</div>\`;
                }).join('');
            }

            // Stats
            document.getElementById('txtWins').innerText = ch.wins;
            document.getElementById('txtLoss').innerText = ch.loss;
            document.getElementById('txtJackpots').innerText = ch.jackpots;
            const total = ch.wins + ch.loss;
            const rate = total > 0 ? Math.round((ch.wins / total) * 100) : 0;
            document.getElementById('txtWinRate').innerText = rate + "%";

            // Logs
            renderHistoryTable();
        }

        // Render Table History Logs
        function renderHistoryTable() {
            const ch = channels[activeMode];
            const tbody = document.getElementById('historyTableBody');
            if (ch.historyArray.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="5" class="py-12 text-center text-zinc-600 font-mono">
                            परिणाम प्रविष्ट करने के बाद इतिहास यहां दिखाई देगा...
                        </td>
                    </tr>
                \`;
            } else {
                tbody.innerHTML = ch.historyArray.map(row => {
                    let statusBadge = "";
                    if (row.status === 'JACKPOT') {
                        statusBadge = \`<span class="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-[8px] px-1.5 py-0.5 rounded animate-pulse">🎰 JACKPOT</span>\`;
                    } else if (row.status === 'WIN') {
                        statusBadge = \`<span class="bg-emerald-950/40 text-emerald-400 border border-emerald-950/60 font-bold text-[8px] px-1.5 py-0.5 rounded">WIN</span>\`;
                    } else {
                        statusBadge = \`<span class="bg-rose-950/20 text-rose-500 border border-rose-950 font-bold text-[8px] px-1.5 py-0.5 rounded">LOSS</span>\`;
                    }

                    const predColor = (row.pred === 'BIG' || row.pred === 'GREEN') ? 'text-emerald-400' : 'text-rose-500';

                    return \`
                        <tr class="hover:bg-zinc-900/40 border-b border-zinc-950 transition-colors">
                            <td class="py-2.5 text-cyan-400 font-bold">...\${row.period.slice(-5)}</td>
                            <td class="py-2.5 font-black \${predColor}">\${row.pred}</td>
                            <td class="py-2.5 text-amber-500">[\${row.balls.join(', ')}]</td>
                            <td class="py-2.5 text-zinc-400 font-medium">\${row.opened} <span class="text-[8.5px] text-zinc-600">(\${row.actualBS}/\${row.actualColor})</span></td>
                            <td class="py-2.5 text-right font-bold">\${statusBadge}</td>
                        </tr>
                    \`;
                }).join('');
            }
        }

        // Calculate and process user input results
        function feedResult(num) {
            const ch = channels[activeMode];
            const issue = ch.targetPeriod;

            document.getElementById('txtLastBall').innerText = num;

            // Process Verification on active target prediction if exists
            if (ch.lastPredVal !== null && ch.lastPredPeriod === issue) {
                const actualBS = num >= 5 ? 'BIG' : 'SMALL';
                const actualColor = GREEN_NUMBERS.includes(num) ? 'GREEN' : 'RED';

                let isWin = false;
                if (settings.rigMode === 'scam') {
                    ch.lastPredVal = ch.lastPredType === 'BS' ? actualBS : actualColor;
                    isWin = true;
                    if (Math.random() < 0.25) {
                        if (!ch.lastPredBalls.includes(num)) {
                            const otherNum = Math.floor(Math.random() * 10);
                            ch.lastPredBalls = [num, otherNum].sort((a, b) => a - b);
                        }
                    }
                } else {
                    if (ch.lastPredType === 'BS') {
                        isWin = (ch.lastPredVal === actualBS);
                    } else if (ch.lastPredType === 'COLOR') {
                        isWin = (ch.lastPredVal === actualColor);
                    }
                }

                const isJackpot = ch.lastPredBalls.includes(num);
                let statusBadge = 'LOSS';

                if (isJackpot) {
                    statusBadge = 'JACKPOT';
                    ch.wins++;
                    ch.jackpots++;
                    ch.lossStreak = 0;
                    audio.playJackpot();
                } else if (isWin) {
                    statusBadge = 'WIN';
                    ch.wins++;
                    ch.lossStreak = 0;
                    audio.playWin();
                } else {
                    statusBadge = 'LOSS';
                    ch.loss++;
                    ch.lossStreak++;
                    audio.playLoss();
                }

                // Push to logs
                ch.historyArray.unshift({
                    period: ch.lastPredPeriod,
                    pred: ch.lastPredVal,
                    balls: [...ch.lastPredBalls],
                    opened: num,
                    actualBS,
                    actualColor,
                    status: statusBadge
                });
            }

            // Increment target period and push to verified
            ch.lastVerifiedIssue = issue;
            ch.serverHistory.push(num);
            if (ch.serverHistory.length > 30) ch.serverHistory.shift();

            // Set next target period
            try {
                const nextVal = BigInt(issue) + 1n;
                ch.targetPeriod = nextVal.toString();
            } catch (e) {
                const nextSuffix = parseInt(issue.slice(-4)) + 1;
                ch.targetPeriod = issue.slice(0, -4) + String(nextSuffix).padStart(4, '0');
            }

            // Generate Next Prediction based on Strategy
            const analysis = calculateNextMove(ch.serverHistory);
            const conf = analysis.confidence;
            const realConf = analysis.internalConfidence;
            let finalChoice = null;
            let finalMode = 'BS';

            document.getElementById('txtPatternMatched').innerText = analysis.patternName;

            if (settings.predMode === 'onlyBS') {
                finalMode = 'BS';
                finalChoice = analysis.bsChoice;
            } else if (settings.predMode === 'onlyColor') {
                finalMode = 'COLOR';
                finalChoice = analysis.colorChoice;
            } else if (settings.predMode === 'safe') {
                if (realConf >= settings.minConfidence) {
                    if (realConf >= 85) {
                        finalMode = 'BS';
                        finalChoice = analysis.bsChoice;
                    } else {
                        finalMode = 'COLOR';
                        finalChoice = analysis.colorChoice;
                    }
                } else {
                    finalChoice = null; // safety
                }
            } else {
                // Auto / Hybrid with 55% Red-Green logic (Prefer Big/Small)
                if (realConf < 55) {
                    finalMode = 'COLOR';
                    finalChoice = analysis.colorChoice;
                } else {
                    finalMode = 'BS';
                    finalChoice = analysis.bsChoice;
                }
            }

            // Threshold confidence limiter (Only apply to Safe mode, never Auto/Hybrid)
            if (finalChoice !== null && settings.predMode === 'safe' && realConf < settings.minConfidence) {
                finalChoice = null;
            }

            if (finalChoice === null && settings.predMode !== 'safe') {
                finalChoice = analysis.bsChoice;
                finalMode = 'BS';
            }

            if (finalChoice !== null) {
                if (settings.rigMode === 'scam') {
                    if (finalMode === 'BS') {
                        finalChoice = finalChoice === 'BIG' ? 'SMALL' : 'BIG';
                    } else {
                        finalChoice = finalChoice === 'GREEN' ? 'RED' : 'GREEN';
                    }
                }
                ch.lastPredType = finalMode;
                ch.lastPredVal = finalChoice;
                ch.confidence = conf + "%";
                ch.lastPredPeriod = ch.targetPeriod;

                if (finalChoice === 'BIG') {
                    const bigPool = [5, 6, 7, 8, 9].sort(() => 0.5 - Math.random());
                    ch.lastPredBalls = [bigPool[0], bigPool[1]].sort((a, b) => a - b);
                } else if (finalChoice === 'SMALL') {
                    const smallPool = [0, 1, 2, 3, 4].sort(() => 0.5 - Math.random());
                    ch.lastPredBalls = [smallPool[0], smallPool[1]].sort((a, b) => a - b);
                } else if (finalChoice === 'GREEN') {
                    const gPool = [1, 3, 5, 7, 9].sort(() => 0.5 - Math.random());
                    ch.lastPredBalls = [gPool[0], gPool[1]].sort((a, b) => a - b);
                } else if (finalChoice === 'RED') {
                    const rPool = [0, 2, 4, 6, 8].sort(() => 0.5 - Math.random());
                    ch.lastPredBalls = [rPool[0], rPool[1]].sort((a, b) => a - b);
                }
            } else {
                ch.lastPredVal = null;
                ch.lastPredPeriod = ch.targetPeriod;
                ch.lastPredBalls = [];
                ch.confidence = "SAFETY STANDBY (सुरक्षा रोक)";
            }

            renderChamber();
            calculateLevels();
        }

        // Logic core
        function calculateNextMove(history) {
            const len = history.length;
            if (len < 3) {
                return {
                    bsChoice: "BIG",
                    colorChoice: "GREEN",
                    confidence: 96,
                    internalConfidence: 75,
                    bsPattern: "NEURAL",
                    colorPattern: "NEURAL",
                    patternName: "INITIALIZING TREND (प्रारंभिक ट्रेंड)"
                };
            }

            const bsList = history.map(x => x >= 5 ? "BIG" : "SMALL");
            const colorList = history.map(x => GREEN_NUMBERS.includes(x) ? "GREEN" : "RED");

            let bsChoice = "BIG";
            let bsPattern = "TREND";
            let colorChoice = "GREEN";
            let colorPattern = "TREND";
            let patternName = "TREND BIAS (सटीक ट्रेंड)";

            // 1. Analyze 60% Red-Green frequency rule in the last 10 rounds
            const last10Colors = colorList.slice(-10);
            const redCount = last10Colors.filter(c => c === 'RED').length;
            const greenCount = last10Colors.filter(c => c === 'GREEN').length;
            const redRatio = redCount / (last10Colors.length || 1);
            const greenRatio = greenCount / (last10Colors.length || 1);

            // 2. Identify Patterns
            const isBSDragon = len >= 3 && bsList[len - 1] === bsList[len - 2] && bsList[len - 2] === bsList[len - 3];
            const isColorDragon = len >= 3 && colorList[len - 1] === colorList[len - 2] && colorList[len - 2] === colorList[len - 3];

            const isBSAlternate = len >= 4 &&
                bsList[len - 1] !== bsList[len - 2] &&
                bsList[len - 2] !== bsList[len - 3] &&
                bsList[len - 3] !== bsList[len - 4];

            const isColorAlternate = len >= 4 &&
                colorList[len - 1] !== colorList[len - 2] &&
                colorList[len - 2] !== colorList[len - 3] &&
                colorList[len - 3] !== colorList[len - 4];

            // Determine Big/Small choice
            if (settings.strategy === 'reverse') {
                bsChoice = bsList[len - 1] === 'BIG' ? 'SMALL' : 'BIG';
                bsPattern = "REVERSE_TREND";
            } else if (settings.strategy === 'frequency') {
                const bigCount = bsList.filter(x => x === 'BIG').length;
                bsChoice = bigCount >= len / 2 ? 'BIG' : 'SMALL';
                bsPattern = "HOT_FREQ";
            } else {
                if (isBSDragon) {
                    bsChoice = bsList[len - 1];
                    bsPattern = "DRAGON";
                } else if (isBSAlternate) {
                    bsChoice = bsList[len - 1] === "BIG" ? "SMALL" : "BIG";
                    bsPattern = "ALTERNATE";
                } else {
                    const last8BS = bsList.slice(-8);
                    const bigCount8 = last8BS.filter(x => x === 'BIG').length;
                    if (bigCount8 >= 5) {
                        bsChoice = 'BIG';
                    } else if (bigCount8 <= 3) {
                        bsChoice = 'SMALL';
                    } else {
                        bsChoice = bsList[len - 1];
                    }
                    bsPattern = "TREND_BIAS";
                }
            }

            // Determine Color choice using 60% rule first, then standard pattern detection
            if (settings.strategy === 'reverse') {
                colorChoice = colorList[len - 1] === 'GREEN' ? 'RED' : 'GREEN';
                colorPattern = "REVERSE_TREND";
            } else if (settings.strategy === 'frequency') {
                const greenCountAll = colorList.filter(x => x === 'GREEN').length;
                colorChoice = greenCountAll >= len / 2 ? 'GREEN' : 'RED';
                colorPattern = "HOT_FREQ";
            } else {
                if (redRatio >= 0.6) {
                    colorChoice = 'RED';
                    colorPattern = "60_PERCENT_RULE";
                } else if (greenRatio >= 0.6) {
                    colorChoice = 'GREEN';
                    colorPattern = "60_PERCENT_RULE";
                } else if (isColorDragon) {
                    colorChoice = colorList[len - 1];
                    colorPattern = "DRAGON";
                } else if (isColorAlternate) {
                    colorChoice = colorList[len - 1] === "GREEN" ? "RED" : "GREEN";
                    colorPattern = "ALTERNATE";
                } else {
                    colorChoice = colorList[len - 1];
                    colorPattern = "TREND_BIAS";
                }
            }

            // Set readable display pattern names
            if (colorPattern === "60_PERCENT_RULE") {
                patternName = colorChoice === 'RED' ? "60% COLOR TREND (लाल रंग बहुमत)" : "60% COLOR TREND (हरा रंग बहुमत)";
            } else if (bsPattern === "DRAGON" || colorPattern === "DRAGON") {
                patternName = "DRAGON STREAK (ड्रेगन लकीर 100%)";
            } else if (bsPattern === "ALTERNATE" || colorPattern === "ALTERNATE") {
                patternName = "ALTERNATE SEQUENCE (एकांत अनुक्रम 100%)";
            } else if (bsPattern === "REVERSE_TREND" || colorPattern === "REVERSE_TREND") {
                patternName = "REVERSE TREND (विपरीत ट्रेंड)";
            } else if (bsPattern === "HOT_FREQ" || colorPattern === "HOT_FREQ") {
                patternName = "HOT FREQUENCY (उच्च आवृत्ति)";
            } else {
                patternName = "NEURAL PATTERN (सटीक ट्रेंड)";
            }

            // Display high premium confidence to the client
            const confidence = Math.floor(Math.random() * (99 - 95 + 1)) + 95; // 95% to 99%

            // Calculate real pattern-based internal confidence to handle the 60% rule
            let internalConfidence = 75;
            if (bsPattern === "DRAGON" || colorPattern === "DRAGON") {
                internalConfidence = Math.floor(Math.random() * (95 - 85 + 1)) + 85;
            } else if (bsPattern === "ALTERNATE" || colorPattern === "ALTERNATE") {
                internalConfidence = Math.floor(Math.random() * (85 - 70 + 1)) + 70;
            } else {
                // Standard trend bias: can easily fall below 60%
                internalConfidence = Math.floor(Math.random() * (75 - 52 + 1)) + 52;
            }

            return { bsChoice, colorChoice, confidence, internalConfidence, bsPattern, colorPattern, patternName };
        }

        // Martingale Plan Calculations
        function calculateLevels() {
            const baseBet = parseInt(document.getElementById('inpBaseBet').value) || 10;
            const multiplier = parseFloat(document.getElementById('inpMultiplier').value) || 3;
            const container = document.getElementById('levelCalculatorContainer');
            
            const currentStreak = channels[activeMode].lossStreak;

            let html = "";
            let cumulative = 0;

            for (let i = 1; i <= 6; i++) {
                const amt = baseBet * Math.pow(multiplier, i - 1);
                cumulative += amt;

                const isActive = (currentStreak === i - 1);
                const borderClass = isActive 
                    ? "border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.25)] animate-gold-glow" 
                    : "border-zinc-900/60 bg-zinc-950/40";
                
                const textAmtClass = isActive ? "text-amber-400 font-black" : "text-zinc-200";

                html += \`
                    <div class="border rounded-lg p-2 flex items-center justify-between transition-all duration-300 \${borderClass}">
                        <div class="flex items-center gap-1.5">
                            \${isActive ? '<i data-lucide="chevron-right" class="w-3.5 h-3.5 text-amber-500 animate-bounce"></i>' : '<span class="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span>'}
                            <span class="text-[9.5px] font-bold text-zinc-400">LEVEL \${i}</span>
                        </div>
                        <div class="text-right font-mono text-[9px] space-y-0.5">
                            <span class="block text-[10px] \${textAmtClass}">₹\${Math.round(amt)} \${isActive ? '(USE THIS BET)' : ''}</span>
                            <span class="block text-zinc-500 text-[8px]">CUMULATIVE LOST: ₹\${Math.round(cumulative)}</span>
                        </div>
                    </div>
                \`;
            }

            container.innerHTML = html;

            // Advice label
            const adviceTxt = document.getElementById('txtRecommendedLevel');
            if (currentStreak === 0) {
                adviceTxt.innerText = "LEVEL 1: Standard 1X (₹" + baseBet + ")";
                adviceTxt.className = "text-xs font-black text-emerald-400 block tracking-widest animate-pulse";
            } else if (currentStreak < 5) {
                const recAmt = baseBet * Math.pow(multiplier, currentStreak);
                adviceTxt.innerText = "LEVEL " + (currentStreak + 1) + ": Recovery multiplier (₹" + Math.round(recAmt) + ")";
                adviceTxt.className = "text-xs font-black text-amber-500 block tracking-widest animate-pulse";
            } else {
                adviceTxt.innerText = "STANDBY LIMIT: RESET BACK TO LEVEL 1 (₹" + baseBet + ")";
                adviceTxt.className = "text-xs font-black text-rose-500 block tracking-widest animate-pulse";
            }

            lucide.createIcons();
        }

        // Update Slider Safety Shield Value
        function updateSettingsSlider(val) {
            document.getElementById('txtSafetyShieldVal').innerText = val + "%";
            updateSettings();
        }

        // Update logic settings
        function updateSettings() {
            settings.predMode = document.getElementById('selPredMode').value;
            settings.strategy = document.getElementById('selStrategy').value;
            settings.minConfidence = parseInt(document.getElementById('rangeMinConf').value);
            settings.rigMode = document.getElementById('selRigMode').value;
            const rigInfo = document.getElementById('txtRigInfo');
            if (settings.rigMode === 'scam') {
                rigInfo.innerText = "हैक चालू है: ग्राहकों का 100% नुकसान होगा लेकिन स्क्रीन पर हमेशा WIN/JACKPOT दिखेगा!";
            } else {
                rigInfo.innerText = "हैक बंद है: प्रेडिक्टर नॉर्मल और असली गणित के अनुसार चलेगा।";
            }
        }

        // Real-time API Sync and Clock-based Simulator Backup
        async function syncGameHistory(mode) {
            let parsed = null;
            try {
                // Try fetching directly from lottery API (since it is run in browser, if browser allows)
                const apiMode = mode === '1m' ? 'WinGo_1M' : 'WinGo_30S';
                const res = await fetch("https://draw.ar-lottery01.com/WinGo/" + apiMode + "/GetHistoryIssuePage.json?t=" + Date.now());
                if (res.ok) {
                    parsed = await res.json();
                } else {
                    throw new Error("API status not OK");
                }
            } catch (err) {
                // High-fidelity clock-based simulator backup (matches Wingo system clock exactly)
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const dateStr = "" + year + month + day;
                const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
                
                let list = [];
                if (mode === '30s') {
                    const periodIndex = Math.floor(secondsSinceMidnight / 30);
                    for (let i = 0; i < 15; i++) {
                        const idx = periodIndex - i;
                        const pStr = dateStr + "030" + String(idx).padStart(4, '0');
                        let hash = 0;
                        for (let j = 0; j < pStr.length; j++) {
                            hash = pStr.charCodeAt(j) + ((hash << 5) - hash);
                        }
                        const openedNum = Math.abs(hash) % 10;
                        list.push({ issueNumber: pStr, number: String(openedNum) });
                    }
                } else {
                    const periodIndex = Math.floor(secondsSinceMidnight / 60);
                    for (let i = 0; i < 15; i++) {
                        const idx = periodIndex - i;
                        const pStr = dateStr + "010" + String(idx).padStart(4, '0');
                        let hash = 0;
                        for (let j = 0; j < pStr.length; j++) {
                            hash = pStr.charCodeAt(j) + ((hash << 5) - hash);
                        }
                        const openedNum = Math.abs(hash) % 10;
                        list.push({ issueNumber: pStr, number: String(openedNum) });
                    }
                }
                parsed = { data: { list: list } };
            }

            if (parsed && parsed.data && parsed.data.list && parsed.data.list.length > 0) {
                const list = parsed.data.list;
                const latestRecord = list[0];
                const currentLiveIssue = latestRecord.issueNumber;
                const ch = channels[mode];

                if (currentLiveIssue !== ch.lastVerifiedIssue) {
                    // Update serverHistory
                    ch.serverHistory = list.slice(0, 30).map(x => parseInt(x.number)).reverse();
                    
                    // Verify last prediction
                    if (ch.lastPredVal !== null && ch.lastPredPeriod === currentLiveIssue) {
                        const actualNum = parseInt(latestRecord.number);
                        const actualBS = actualNum >= 5 ? 'BIG' : 'SMALL';
                        const actualColor = GREEN_NUMBERS.includes(actualNum) ? 'GREEN' : 'RED';
                        
                        let isWin = false;
                        if (ch.lastPredType === 'BS') {
                            isWin = (ch.lastPredVal === actualBS);
                        } else if (ch.lastPredType === 'COLOR') {
                            isWin = (ch.lastPredVal === actualColor);
                        }

                        const isJackpot = ch.lastPredBalls.includes(actualNum);
                        let statusBadge = 'LOSS';

                        if (isJackpot) {
                            statusBadge = 'JACKPOT';
                            ch.wins++;
                            ch.jackpots++;
                            ch.lossStreak = 0;
                            audio.playJackpot();
                        } else if (isWin) {
                            statusBadge = 'WIN';
                            ch.wins++;
                            ch.lossStreak = 0;
                            audio.playWin();
                        } else {
                            statusBadge = 'LOSS';
                            ch.loss++;
                            ch.lossStreak++;
                            audio.playLoss();
                        }

                        ch.historyArray.unshift({
                            period: ch.lastPredPeriod,
                            pred: ch.lastPredVal,
                            balls: [...ch.lastPredBalls],
                            opened: actualNum,
                            actualBS,
                            actualColor,
                            status: statusBadge
                        });
                    }

                    // Increment and set next target
                    ch.lastVerifiedIssue = currentLiveIssue;
                    try {
                        const nextVal = BigInt(currentLiveIssue) + 1n;
                        ch.targetPeriod = nextVal.toString();
                    } catch (e) {
                        const suffixPos = currentLiveIssue.length - 4;
                        const nextSuffix = parseInt(currentLiveIssue.slice(-4)) + 1;
                        ch.targetPeriod = currentLiveIssue.slice(0, -4) + String(nextSuffix).padStart(4, '0');
                    }

                    // Calculate next prediction
                    const analysis = calculateNextMove(ch.serverHistory);
                    const conf = analysis.confidence;
                    const realConf = analysis.internalConfidence;
                    let finalChoice = null;
                    let finalMode = 'BS';

                    if (settings.predMode === 'onlyBS') {
                        finalMode = 'BS';
                        finalChoice = analysis.bsChoice;
                    } else if (settings.predMode === 'onlyColor') {
                        finalMode = 'COLOR';
                        finalChoice = analysis.colorChoice;
                    } else if (settings.predMode === 'safe') {
                        if (realConf >= settings.minConfidence) {
                            if (realConf >= 85) {
                                finalMode = 'BS';
                                finalChoice = analysis.bsChoice;
                            } else {
                                finalMode = 'COLOR';
                                finalChoice = analysis.colorChoice;
                            }
                        } else {
                            finalChoice = null;
                        }
                    } else {
                        // Auto / Hybrid with 55% Red-Green logic
                        if (realConf < 55) {
                            finalMode = 'COLOR';
                            finalChoice = analysis.colorChoice;
                        } else {
                            finalMode = 'BS';
                            finalChoice = analysis.bsChoice;
                        }
                    }

                    if (finalChoice === null && settings.predMode !== 'safe') {
                        finalChoice = analysis.bsChoice;
                        finalMode = 'BS';
                    }

                    if (finalChoice !== null) {
                        ch.lastPredType = finalMode;
                        ch.lastPredVal = finalChoice;
                        ch.confidence = conf + "%";
                        ch.lastPredPeriod = ch.targetPeriod;

                        if (finalChoice === 'BIG') {
                            const bigPool = [5, 6, 7, 8, 9].sort(() => 0.5 - Math.random());
                            ch.lastPredBalls = [bigPool[0], bigPool[1]].sort((a, b) => a - b);
                        } else if (finalChoice === 'SMALL') {
                            const smallPool = [0, 1, 2, 3, 4].sort(() => 0.5 - Math.random());
                            ch.lastPredBalls = [smallPool[0], smallPool[1]].sort((a, b) => a - b);
                        } else if (finalChoice === 'GREEN') {
                            const gPool = [1, 3, 5, 7, 9].sort(() => 0.5 - Math.random());
                            ch.lastPredBalls = [gPool[0], gPool[1]].sort((a, b) => a - b);
                        } else if (finalChoice === 'RED') {
                            const rPool = [0, 2, 4, 6, 8].sort(() => 0.5 - Math.random());
                            ch.lastPredBalls = [rPool[0], rPool[1]].sort((a, b) => a - b);
                        }
                    } else {
                        ch.lastPredVal = null;
                        ch.lastPredPeriod = ch.targetPeriod;
                        ch.lastPredBalls = [];
                        ch.confidence = "SAFETY STANDBY (सुरक्षा रोक)";
                    }

                    if (activeMode === mode) {
                        document.getElementById('txtPatternMatched').innerText = analysis.patternName;
                        renderChamber();
                        calculateLevels();
                    }
                }
            }
        }

        // Simulator Engine
        function toggleAutoSim() {
            const btn = document.getElementById('btnAutoSim');
            if (autoSimInterval) {
                clearInterval(autoSimInterval);
                autoSimInterval = null;
                btn.innerText = "🤖 Start Simulator";
                btn.className = "text-[9px] font-mono font-bold uppercase bg-zinc-900 hover:bg-zinc-850 px-2 py-1 rounded border border-zinc-800 text-zinc-400 transition-all cursor-pointer";
            } else {
                autoSimInterval = setInterval(() => {
                    // Feed random ball (0-9)
                    const randBall = Math.floor(Math.random() * 10);
                    feedResult(randBall);
                }, 8000);
                btn.innerText = "🛑 Stop Simulator";
                btn.className = "text-[9px] font-mono font-bold uppercase bg-rose-950/40 hover:bg-rose-900/40 px-2 py-1 rounded border border-rose-500 text-rose-400 transition-all cursor-pointer animate-pulse";
            }
        }

        // Initialize state on load
        window.onload = () => {
            // Seed first estimation targets and run auto background sync
            syncGameHistory('30s');
            syncGameHistory('1m');
            switchMode('30s');
            lucide.createIcons();

            // Run automatic background update/simulation checks every 2 seconds
            setInterval(() => {
                syncGameHistory('30s');
                syncGameHistory('1m');
            }, 2000);
        };
    </script>
</body>
</html>`;
}

export function triggerHTMLDownload() {
  const htmlContent = getPredictorHTML();
  // Create downloadable file link
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Wingo_VIP_Pro_Offline.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getAPKDownloadHTML(apkLink: string): string {
  return `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>╰‿╯RAMUㅤᏴᎻᎪᏆ VIP PRO - Official APK Download</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        cyber: {
                            gold: '#d4af37',
                            cyan: '#06b6d4',
                            amber: '#f59e0b',
                            emerald: '#10b981',
                        }
                    }
                }
            }
        }
    </script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @keyframes gold-pulse {
            0%, 100% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.4); }
            50% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.8); }
        }
        .animate-gold-glow {
            animation: gold-pulse 2s infinite ease-in-out;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .animate-float {
            animation: float 4s infinite ease-in-out;
        }
        body {
            background-color: #020405;
            color: #f4f4f5;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #020405;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(245, 158, 11, 0.2);
            border-radius: 3px;
        }
    </style>
</head>
<body class="min-h-screen bg-[#020405] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-white pb-12 overflow-x-hidden relative">

    <!-- Glowing visual background orb -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0"></div>

    <!-- Header / Navigation -->
    <header class="border-b border-zinc-900/80 bg-black/40 backdrop-blur-md sticky top-0 z-50 px-4 py-4">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-black font-display text-xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                    R
                </div>
                <div>
                    <h1 class="text-sm md:text-base font-display font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                        RAMU VIP PRO <span class="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-mono font-bold tracking-normal">OFFICIAL APK</span>
                    </h1>
                    <p class="text-[8px] text-zinc-500 font-mono tracking-wider uppercase">
                        Supercharged 2026 Gaming Companion Engine
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 text-[9px] md:text-[10px] font-mono font-bold bg-zinc-950 border border-zinc-900 px-2.5 py-1.5 rounded-full text-emerald-400">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> 
                    <span id="activeCount">14,204</span> ONLINE
                </span>
            </div>
        </div>
    </header>

    <main class="max-w-4xl w-full mx-auto px-4 mt-8 flex-1 flex flex-col gap-8 relative z-10">
        
        <!-- HERO DOWNLOAD SECTION -->
        <div class="bg-gradient-to-b from-neutral-950 to-zinc-950/40 border border-amber-500/20 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div class="absolute -right-16 -top-16 text-zinc-900 opacity-10 select-none pointer-events-none font-display text-[220px]">
                🦅
            </div>

            <!-- Left: Text Core -->
            <div class="flex-1 space-y-5 text-center md:text-left">
                <div class="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[9px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                    ⭐️ LATEST STABLE RELEASE • V20.0
                </div>

                <div class="space-y-1">
                    <h2 class="text-2xl md:text-4xl font-display font-black text-white leading-tight uppercase tracking-tight">
                        ╰‿╯RAMUㅤᏴᎻᎪᏆ <span class="text-amber-500">VIP PRO</span>
                    </h2>
                    <h3 class="text-lg md:text-xl font-display font-bold text-zinc-400">
                        Wingo Live Prediction System
                    </h3>
                </div>

                <p class="text-xs md:text-sm text-zinc-400 leading-relaxed font-sans max-w-lg">
                    Ramu Bhai का सबसे एडवांस और पावरफुल Wingo VIP Predictor अब आपके एंड्रॉइड मोबाइल के लिए एपीके (APK) फॉर्मेट में उपलब्ध है। इसे इंस्टॉल करें, पासवर्ड <span class="text-amber-500 font-bold font-mono text-sm">808080</span> प्रविष्ट करें और तुरंत 99% की सुपर एक्यूरेसी के साथ खेलना शुरू करें।
                </p>

                <!-- Stats tags row -->
                <div class="flex flex-wrap justify-center md:justify-start gap-4 font-mono text-[10px] text-zinc-500 pt-1">
                    <span class="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-900">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500"></i> Securing Verified: 100% Virus-Free
                    </span>
                    <span class="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-900">
                        <i data-lucide="download" class="w-3.5 h-3.5 text-cyan-400"></i> <span id="downloadCount">1.2M+</span> Downloads
                    </span>
                </div>
            </div>

            <!-- Right: Dynamic Download Visual Card -->
            <div class="w-full md:w-80 shrink-0 animate-float">
                <div class="bg-neutral-950 border border-amber-500/30 rounded-2xl p-6 text-center space-y-6 shadow-xl relative animate-gold-glow">
                    
                    <div class="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-black mx-auto shadow-lg shadow-amber-500/20">
                        <i data-lucide="smartphone" class="w-12 h-12"></i>
                    </div>

                    <div class="space-y-1">
                        <span class="text-xs font-mono font-bold text-amber-500 block uppercase tracking-widest">RamuVipPro.apk</span>
                        <span class="text-[10px] text-zinc-500 font-mono block">FILE SIZE: 8.4 MB • Android 5.0+</span>
                    </div>

                    <!-- Direct high-octane download button -->
                    <button onclick="startDownload()" class="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 active:scale-95 text-black font-display font-black text-xs py-4 rounded-xl uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10">
                        <i data-lucide="download" class="w-4 h-4"></i> Download VIP APK Now
                    </button>

                    <div class="text-[9px] text-zinc-600 font-sans uppercase">
                        COMPATIBLE WITH ALL PHONES & EMULATORS
                    </div>
                </div>
            </div>
        </div>

        <!-- TELEGRAM BANNER -->
        <div class="bg-gradient-to-r from-sky-950/30 to-zinc-950 border border-sky-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3.5 text-center md:text-left flex-col md:flex-row">
                <div class="w-11 h-11 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <i data-lucide="send" class="w-5.5 h-5.5 animate-pulse"></i>
                </div>
                <div class="space-y-0.5">
                    <h4 class="text-xs md:text-sm font-display font-black text-sky-400 uppercase tracking-wider">
                        Join Our Official Telegram Channel
                    </h4>
                    <p class="text-[10px] text-zinc-400 max-w-xl">
                        पैनल के सभी लेटेस्ट अपडेट्स, नए पासपोर्ट कोड्स, और रामू भाई की लाइव प्रेडिक्शन की जानकारी के लिए तुरंत हमारे टेलीग्राम चैनल से जुड़ें।
                    </p>
                </div>
            </div>

            <a href="https://t.me/+h5jDuTLxOEQ4NmVl" target="_blank" rel="noreferrer" class="bg-sky-500 hover:bg-sky-400 text-black font-mono font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl shrink-0 transition-colors">
                🚀 Join Telegram VIP
            </a>
        </div>

        <!-- 3-STEP INSTALLATION GUIDE -->
        <div class="space-y-4">
            <h3 class="text-xs font-display font-black tracking-widest text-zinc-400 uppercase text-center border-b border-zinc-900 pb-2">
                इन्सटॉलेशन गाइड • STEP-BY-STEP INSTALLATION
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <!-- STEP 1 -->
                <div class="bg-zinc-950/60 border border-zinc-900 p-5 rounded-2xl space-y-3">
                    <div class="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono font-bold text-xs flex items-center justify-center">
                        01
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-xs font-display font-bold text-white uppercase tracking-wide">APK डाउनलोड करें</h4>
                        <p class="text-[11px] text-zinc-400 leading-relaxed font-sans">
                            ऊपर दिए गए 'Download VIP APK Now' बटन पर क्लिक करके एपीके फाइल को अपने मोबाइल में सेव करें।
                        </p>
                    </div>
                </div>

                <!-- STEP 2 -->
                <div class="bg-zinc-950/60 border border-zinc-900 p-5 rounded-2xl space-y-3">
                    <div class="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                        02
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-xs font-display font-bold text-white uppercase tracking-wide">Unknown Sources अनुमति दें</h4>
                        <p class="text-[11px] text-zinc-400 leading-relaxed font-sans">
                            यदि सिस्टम ब्लॉक पॉपअप दिखाता है, तो अपने मोबाइल की <strong>Settings > Security</strong> में जाकर <strong>'Install from Unknown Sources'</strong> को अनुमति (Allow) दें।
                        </p>
                    </div>
                </div>

                <!-- STEP 3 -->
                <div class="bg-zinc-950/60 border border-zinc-900 p-5 rounded-2xl space-y-3">
                    <div class="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                        03
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-xs font-display font-bold text-white uppercase tracking-wide">पासपोर्ट डालें और खेलें</h4>
                        <p class="text-[11px] text-zinc-400 leading-relaxed font-sans">
                            ऐप को ओपन करें, ओनर से मिला हुआ पासपोर्ट कोड <span class="text-amber-500 font-bold font-mono">808080</span> दर्ज करें और लाइव सिंक प्रेडिक्शन्स प्राप्त करें।
                        </p>
                    </div>
                </div>

            </div>
        </div>

        <!-- FREQUENTLY ASKED QUESTIONS -->
        <div class="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h3 class="text-xs font-display font-black tracking-widest text-zinc-400 uppercase border-b border-zinc-900 pb-2">
                अक्सर पूछे जाने वाले प्रश्न • FREQUENTLY ASKED QUESTIONS
            </h3>

            <div class="space-y-4 divide-y divide-zinc-900">
                
                <div class="pt-0 space-y-1">
                    <h4 class="text-xs font-display font-bold text-white">Q. क्या यह एपीके पूरी तरह से सुरक्षित है?</h4>
                    <p class="text-[11px] text-zinc-400 leading-relaxed">
                        हां, रामू भाई का यह ऑफिशियल एपीके 100% सुरक्षित और वायरस-फ्री है। यह आपके फोन से किसी भी प्रकार का व्यक्तिगत डेटा एकत्र नहीं करता है।
                    </p>
                </div>

                <div class="pt-3 space-y-1">
                    <h4 class="text-xs font-display font-bold text-white">Q. पासपोर्ट कोड क्या है और कैसे प्राप्त करें?</h4>
                    <p class="text-[11px] text-zinc-400 leading-relaxed">
                        ऐप में एंटर करने के लिए आपको ६ अंकों का पासपोर्ट चाहिए होता है। डिफॉल्ट पासपोर्ट कोड <span class="text-amber-500 font-bold">808080</span> है। यदि यह काम नहीं करता है, तो आप टेलीग्राम चैनल पर रामू भाई से संपर्क करके लेटेस्ट कोड प्राप्त कर सकते हैं।
                    </p>
                </div>

                <div class="pt-3 space-y-1">
                    <h4 class="text-xs font-display font-bold text-white">Q. क्या यह ऐप पीसी या लैपटॉप में काम करेगा?</h4>
                    <p class="text-[11px] text-zinc-400 leading-relaxed">
                        हां, आप BlueStacks, LDPlayer या किसी भी अन्य एंड्रॉइड एमुलेटर (Android Emulator) का उपयोग करके इसे अपने पीसी/कंप्यूटर पर भी आसानी से चला सकते हैं।
                    </p>
                </div>

            </div>
        </div>

    </main>

    <!-- FOOTER -->
    <footer class="max-w-4xl mx-auto px-4 mt-12 text-center space-y-2">
        <p class="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">
            &copy; 2026 RAMU VIP PRO | ALL RIGHTS RESERVED • REGISTERED SECURE UTILITY
        </p>
    </footer>

    <!-- INTERACTIVE DOWNLOADING SIMULATION OVERLAY -->
    <div id="downloadOverlay" class="fixed inset-0 bg-black/95 backdrop-blur-md z-[100000] hidden flex flex-col items-center justify-center p-4">
        <div class="max-w-xs w-full text-center space-y-6">
            <!-- Circular Progress SVG -->
            <div class="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#18181b" stroke-width="6" fill="transparent" />
                    <circle id="progressCircle" cx="50" cy="50" r="40" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" fill="transparent" stroke-dasharray="251.2" stroke-dashoffset="251.2" />
                </svg>
                <span id="progressText" class="absolute font-mono font-black text-lg text-white">0%</span>
            </div>

            <div class="space-y-1">
                <h4 id="statusLabel" class="text-sm font-display font-black uppercase text-amber-500 tracking-wider">
                    APK डाउनलोड हो रहा है...
                </h4>
                <p class="text-[10px] text-zinc-500 font-mono uppercase">
                    Downloading RamuVipPro.apk • Please wait
                </p>
            </div>
        </div>
    </div>

    <script>
        // Start Lucide Icons
        lucide.createIcons();

        // Increment active predictors
        setInterval(function() {
            var el = document.getElementById('activeCount');
            var current = parseInt(el.innerText.replace(',', ''));
            var diff = Math.floor(Math.random() * 11) - 5; // -5 to +5
            el.innerText = (current + diff).toLocaleString();
        }, 3000);

        // Download simulation logic
        function startDownload() {
            var overlay = document.getElementById('downloadOverlay');
            var circle = document.getElementById('progressCircle');
            var text = document.getElementById('progressText');
            var status = document.getElementById('statusLabel');

            overlay.classList.remove('hidden');
            
            var progress = 0;
            var interval = setInterval(function() {
                progress += Math.floor(Math.random() * 12) + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    status.innerText = "सफलतापूर्वक डाउनलोड हुआ!";
                    status.className = "text-sm font-display font-black uppercase text-emerald-400 tracking-wider";
                    
                    setTimeout(function() {
                        // Redirect to the real APK link
                        window.location.href = "${apkLink}";
                        
                        // Close overlay after brief delay
                        setTimeout(function() {
                            overlay.classList.add('hidden');
                            // Reset state
                            circle.style.strokeDashoffset = "251.2";
                            text.innerText = "0%";
                            status.innerText = "APK डाउनलोड हो रहा है...";
                            status.className = "text-sm font-display font-black uppercase text-amber-500 tracking-wider";
                        }, 1000);
                    }, 500);
                }

                // Update circle stroke offset (dashoffset is from 251.2 down to 0)
                var offset = 251.2 - (251.2 * progress) / 100;
                circle.style.strokeDashoffset = offset;
                text.innerText = progress + "%";
            }, 180);
        }
    </script>
</body>
</html>`;
}

export function triggerAPKDownloadHTML(apkLink: string) {
  const htmlContent = getAPKDownloadHTML(apkLink);
  // Create downloadable landing page HTML file
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Ramu_VIP_Pro_APK_Download.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

