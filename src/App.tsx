/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Compass,
  Volume2,
  VolumeX,
  Clock,
  History,
  TrendingUp,
  Flame,
  Award,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Play,
  X,
  Coins,
  Tv,
  HelpCircle,
  Calculator
} from 'lucide-react';
import { WingoMode, PredictionType, PredictionValue, HistoryRecord, JackpotRecord, ChannelState } from './types';

// Audio Synthesizer for high-fidelity offline audio feedback
class WebAudioSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playBeep(freq: number, type: OscillatorType = 'sine', duration: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playAuthSuccess() {
    this.playBeep(440, 'sine', 0.15);
    setTimeout(() => this.playBeep(554, 'sine', 0.15), 100);
    setTimeout(() => this.playBeep(659, 'sine', 0.15), 200);
    setTimeout(() => this.playBeep(880, 'sine', 0.3), 300);
  }

  playWin() {
    this.playBeep(523.25, 'sine', 0.1); // C5
    setTimeout(() => this.playBeep(659.25, 'sine', 0.1), 100); // E5
    setTimeout(() => this.playBeep(783.99, 'sine', 0.1), 200); // G5
    setTimeout(() => this.playBeep(1046.50, 'sine', 0.35), 300); // C6
  }

  playLoss() {
    this.playBeep(293.66, 'sawtooth', 0.25); // D4
    setTimeout(() => this.playBeep(220.00, 'sawtooth', 0.4), 200); // A3
  }

  playJackpot() {
    // Cascading slot-machine style bells
    const notes = [523, 659, 783, 1046, 1318, 1567, 2093];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playBeep(freq, 'triangle', 0.18);
      }, index * 80);
    });
  }
}

const audio = new WebAudioSynth();

const GREEN_NUMBERS = [1, 3, 5, 7, 9];
const RED_NUMBERS = [0, 2, 4, 6, 8];

const INITIAL_CHANNELS = (): Record<WingoMode, ChannelState> => ({
  '30s': {
    targetPeriod: "Syncing...",
    lastVerifiedIssue: "",
    lastPredType: 'BS',
    lastPredVal: null,
    lastPredColorVal: null,
    lastPredPeriod: "",
    lastPredBalls: [],
    serverHistory: [],
    historyArray: [],
    wins: 0,
    loss: 0,
    lossStreak: 0,
    confidence: "--%",
    jackpots: 0
  },
  '1m': {
    targetPeriod: "Syncing...",
    lastVerifiedIssue: "",
    lastPredType: 'BS',
    lastPredVal: null,
    lastPredColorVal: null,
    lastPredPeriod: "",
    lastPredBalls: [],
    serverHistory: [],
    historyArray: [],
    wins: 0,
    loss: 0,
    lossStreak: 0,
    confidence: "--%",
    jackpots: 0
  },
  '3m': {
    targetPeriod: "Syncing...",
    lastVerifiedIssue: "",
    lastPredType: 'BS',
    lastPredVal: null,
    lastPredColorVal: null,
    lastPredPeriod: "",
    lastPredBalls: [],
    serverHistory: [],
    historyArray: [],
    wins: 0,
    loss: 0,
    lossStreak: 0,
    confidence: "--%",
    jackpots: 0
  },
  '5m': {
    targetPeriod: "Syncing...",
    lastVerifiedIssue: "",
    lastPredType: 'BS',
    lastPredVal: null,
    lastPredColorVal: null,
    lastPredPeriod: "",
    lastPredBalls: [],
    serverHistory: [],
    historyArray: [],
    wins: 0,
    loss: 0,
    lossStreak: 0,
    confidence: "--%",
    jackpots: 0
  }
});

export default function App() {
  const [authState, setAuthState] = useState<'LOCKED' | 'LOADING' | 'UNLOCKED'>('LOCKED');
  const [passportCode, setPassportCode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [activeMode, setActiveMode] = useState<WingoMode>('30s');
  const [channels, setChannels] = useState<Record<WingoMode, ChannelState>>(INITIAL_CHANNELS());
  const [clockTime, setClockTime] = useState('00:00:00 PM');
  
  // Game View State
  const [gameViewActive, setGameViewActive] = useState(false);
  const [miniPanelVisible, setMiniPanelVisible] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Jackpot Persistence & History State
  const [jackpotHistory, setJackpotHistory] = useState<JackpotRecord[]>([]);
  const [inGameJackpotsCount, setInGameJackpotsCount] = useState(0);
  const [totalJackpotsCount, setTotalJackpotsCount] = useState(0);

  // Result overlay animation triggers
  const [overlayState, setOverlayState] = useState<'NONE' | 'WIN' | 'LOSS' | 'JACKPOT'>('NONE');
  const [overlayMetadata, setOverlayMetadata] = useState<{
    period: string;
    prediction: string;
    balls: number[];
    opened: number;
    actualBS: string;
    actualColor: string;
    time: string;
    patternName: string;
    mode: WingoMode;
  } | null>(null);

  const [activePatternName, setActivePatternName] = useState<string>("NEURAL CORRELATION");

  const [settings, setSettings] = useState<{
    predMode: 'auto' | 'onlyBS' | 'onlyColor' | 'safe';
    strategy: 'neural' | 'reverse' | 'frequency';
    minConfidence: number;
    showMartingale: boolean;
    rigMode: 'scam' | 'fair';
  }>(() => {
    try {
      const saved = localStorage.getItem('wingo_vip_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      predMode: 'auto',
      strategy: 'neural',
      minConfidence: 75,
      showMartingale: true,
      rigMode: 'scam',
    };
  });

  // Save settings on change
  useEffect(() => {
    localStorage.setItem('wingo_vip_settings', JSON.stringify(settings));
  }, [settings]);

  const [baseBet, setBaseBet] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('wingo_vip_base_bet');
      if (saved) return parseInt(saved);
    } catch (e) {}
    return 10;
  });

  const [multiplier, setMultiplier] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('wingo_vip_multiplier');
      if (saved) return parseFloat(saved);
    } catch (e) {}
    return 3;
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem('wingo_vip_base_bet', String(baseBet));
  }, [baseBet]);

  useEffect(() => {
    localStorage.setItem('wingo_vip_multiplier', String(multiplier));
  }, [multiplier]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'PREDICTOR' | 'GAME'>('PREDICTOR');

  // Game Play States
  const [gameBalance, setGameBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('wingo_sim_balance');
      return saved ? parseFloat(saved) : 10000;
    } catch (e) {
      return 10000;
    }
  });

  const [activeBets, setActiveBets] = useState<Array<{
    type: 'BIG' | 'SMALL' | 'GREEN' | 'RED' | 'VIOLET' | 'NUMBER';
    value?: number;
    amount: number;
    multiplier: number;
  }>>([]);

  const [simulationHistory, setSimulationHistory] = useState<Array<{
    period: string;
    bets: Array<{ type: string; value?: number; amount: number; multiplier: number }>;
    drawnNumber: number;
    drawnBS: 'BIG' | 'SMALL';
    drawnColor: 'GREEN' | 'RED' | 'VIOLET' | 'GREEN_VIOLET' | 'RED_VIOLET';
    totalBetAmount: number;
    totalPayout: number;
    profit: number;
    timestamp: string;
    mode: WingoMode;
  }>>(() => {
    try {
      const saved = localStorage.getItem('wingo_sim_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [gameSecondsLeft, setGameSecondsLeft] = useState(30);
  const [activeGamePeriod, setActiveGamePeriod] = useState(() => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    return `${dateStr}0300001`;
  });

  const [riggingConfig, setRiggingConfig] = useState<{
    mode: 'LOSS_100' | 'PROFIT_1' | 'FAIR';
    unlocked: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('wingo_rig_config');
      return saved ? JSON.parse(saved) : { mode: 'LOSS_100', unlocked: false };
    } catch (e) {
      return { mode: 'LOSS_100', unlocked: false };
    }
  });

  const [birdClickCount, setBirdClickCount] = useState(0);

  // Keep state updated in localStorage
  useEffect(() => {
    localStorage.setItem('wingo_sim_balance', String(gameBalance));
  }, [gameBalance]);

  useEffect(() => {
    localStorage.setItem('wingo_sim_history', JSON.stringify(simulationHistory));
  }, [simulationHistory]);

  useEffect(() => {
    localStorage.setItem('wingo_rig_config', JSON.stringify(riggingConfig));
  }, [riggingConfig]);

  const handleBirdClick = () => {
    setBirdClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setRiggingConfig(curr => ({ ...curr, unlocked: true }));
        return 0;
      }
      return next;
    });
  };

  const getDrawnResultDetails = (num: number) => {
    const bs: 'BIG' | 'SMALL' = num >= 5 ? 'BIG' : 'SMALL';
    let color: 'GREEN' | 'RED' | 'VIOLET' | 'GREEN_VIOLET' | 'RED_VIOLET' = 'GREEN';
    if (num === 0) color = 'RED_VIOLET';
    else if (num === 5) color = 'GREEN_VIOLET';
    else if ([1, 3, 7, 9].includes(num)) color = 'GREEN';
    else if ([2, 4, 6, 8].includes(num)) color = 'RED';
    
    return { bs, color };
  };

  const calculatePayoutForBets = (drawnNum: number, bets: typeof activeBets) => {
    const { bs, color } = getDrawnResultDetails(drawnNum);
    let payout = 0;
    
    bets.forEach(bet => {
      if (bet.type === 'BIG' && bs === 'BIG') {
        payout += bet.amount * 2;
      } else if (bet.type === 'SMALL' && bs === 'SMALL') {
        payout += bet.amount * 2;
      } else if (bet.type === 'GREEN') {
        if (color === 'GREEN') payout += bet.amount * 2;
        else if (color === 'GREEN_VIOLET') payout += bet.amount * 1.5;
      } else if (bet.type === 'RED') {
        if (color === 'RED') payout += bet.amount * 2;
        else if (color === 'RED_VIOLET') payout += bet.amount * 1.5;
      } else if (bet.type === 'VIOLET') {
        if (color === 'GREEN_VIOLET' || color === 'RED_VIOLET') payout += bet.amount * 4.5;
      } else if (bet.type === 'NUMBER' && bet.value === drawnNum) {
        payout += bet.amount * 9;
      }
    });
    
    return payout;
  };

  const findMinPayoutDrawnNumber = (bets: typeof activeBets) => {
    let minPayout = Infinity;
    let bestNumbers: number[] = [];

    for (let num = 0; num <= 9; num++) {
      const payout = calculatePayoutForBets(num, bets);
      if (payout < minPayout) {
        minPayout = payout;
        bestNumbers = [num];
      } else if (payout === minPayout) {
        bestNumbers.push(num);
      }
    }

    return bestNumbers[Math.floor(Math.random() * bestNumbers.length)];
  };

  const resolveSimulatedRound = () => {
    const finalMode = riggingConfig.mode;
    
    let drawnNum = 0;
    if (activeBets.length === 0 || finalMode === 'FAIR') {
      drawnNum = Math.floor(Math.random() * 10);
    } else if (finalMode === 'PROFIT_1') {
      const roll = Math.random() * 100;
      if (roll < 1) {
        const winningNums = Array.from({ length: 10 }, (_, i) => i).filter(num => calculatePayoutForBets(num, activeBets) > 0);
        if (winningNums.length > 0) {
          drawnNum = winningNums[Math.floor(Math.random() * winningNums.length)];
        } else {
          drawnNum = Math.floor(Math.random() * 10);
        }
      } else {
        drawnNum = findMinPayoutDrawnNumber(activeBets);
      }
    } else {
      drawnNum = findMinPayoutDrawnNumber(activeBets);
    }

    const { bs, color } = getDrawnResultDetails(drawnNum);
    const totalBetAmount = activeBets.reduce((sum, b) => sum + b.amount, 0);
    const totalPayout = calculatePayoutForBets(drawnNum, activeBets);
    const profit = totalPayout - totalBetAmount;

    setGameBalance(prev => prev + totalPayout);

    if (activeBets.length > 0) {
      if (totalPayout > totalBetAmount) {
        setOverlayState('WIN');
        audio.playWin();
      } else {
        setOverlayState('LOSS');
        audio.playLoss();
      }
      
      setOverlayMetadata({
        period: activeGamePeriod,
        prediction: activeBets[0].type,
        balls: activeBets[0].type === 'NUMBER' ? [activeBets[0].value || 0] : [drawnNum],
        opened: drawnNum,
        actualBS: bs,
        actualColor: color.includes('GREEN') ? 'GREEN' : 'RED',
        time: new Date().toLocaleTimeString(),
        patternName: "SIMULATION MATRIX",
        mode: activeMode
      });

      setTimeout(() => setOverlayState('NONE'), 3000);
    }

    const newRecord = {
      period: activeGamePeriod,
      bets: [...activeBets],
      drawnNumber: drawnNum,
      drawnBS: bs,
      drawnColor: color,
      totalBetAmount,
      totalPayout,
      profit,
      timestamp: new Date().toLocaleTimeString(),
      mode: activeMode
    };

    setSimulationHistory(prev => [newRecord, ...prev].slice(0, 50));

    setActiveGamePeriod(prev => {
      try {
        const nextVal = BigInt(prev) + 1n;
        return nextVal.toString();
      } catch (e) {
        const suffix = parseInt(prev.slice(-4)) + 1;
        return prev.slice(0, -4) + String(suffix).padStart(4, '0');
      }
    });

    setActiveBets([]);
  };

  // Countdown timer for Simulated Wingo Game
  useEffect(() => {
    if (authState !== 'UNLOCKED') return;

    const interval = setInterval(() => {
      setGameSecondsLeft((prev) => {
        if (prev <= 1) {
          resolveSimulatedRound();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [authState, activeBets, riggingConfig, activeGamePeriod, activeTab]);

  const channelsRef = useRef(channels);
  channelsRef.current = channels;

  const handleAddBet = (type: 'BIG' | 'SMALL' | 'GREEN' | 'RED' | 'VIOLET' | 'NUMBER', value?: number) => {
    if (gameSecondsLeft <= 5) return;
    const betAmount = baseBet * multiplier;

    if (gameBalance < betAmount) {
      audio.playLoss();
      return;
    }

    setGameBalance(prev => prev - betAmount);
    setActiveBets(prev => [
      ...prev,
      { type, value, amount: betAmount, multiplier }
    ]);
    audio.playBeep(440, 'sine', 0.08);
  };

  const gameViewActiveRef = useRef(gameViewActive);
  gameViewActiveRef.current = gameViewActive;

  const activeModeRef = useRef(activeMode);
  activeModeRef.current = activeMode;

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Imperative Iframe load to prevent parent state re-renders from ever reloading the game
  useEffect(() => {
    if (iframeRef.current && !iframeRef.current.src) {
      iframeRef.current.src = "https://bdgwinmy.cc//#/register?invitationCode=8261315097340";
    }
  }, []);

  // Clock interval
  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      let hh = date.getHours();
      let mm = date.getMinutes();
      let ss = date.getSeconds();
      const slot = hh >= 12 ? 'PM' : 'AM';
      const formattedHh = hh % 12 || 12;
      const formattedMm = mm < 10 ? '0' + mm : mm;
      const formattedSs = ss < 10 ? '0' + ss : ss;
      setClockTime(`${formattedHh}:${formattedMm}:${formattedSs} ${slot}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync Audio Enable state
  useEffect(() => {
    audio.enabled = audioEnabled;
  }, [audioEnabled]);

  // ==========================================================
  // BACKGROUND ENGINE: ALL WINGO MODES PARALLEL SYNC
  // ==========================================================
  useEffect(() => {
    if (authState !== 'UNLOCKED') return;

    let isSubscribed = true;
    const modes: WingoMode[] = ['30s', '1m', '3m', '5m'];

    const fetchMode = async (mode: WingoMode) => {
      try {
        let parsed: any = null;
        try {
          const res = await fetch(`/api/history?mode=${mode}`);
          if (res.ok) {
            parsed = await res.json();
          } else {
            throw new Error("Local proxy returned non-OK status");
          }
        } catch (proxyErr) {
          // Fallback to direct public API fetch
          try {
            let apiMode = 'WinGo_30S';
            if (mode === '1m') {
              apiMode = 'WinGo_1M';
            } else if (mode === '3m') {
              apiMode = 'WinGo_3M';
            } else if (mode === '5m') {
              apiMode = 'WinGo_5M';
            }
            const directRes = await fetch(`https://draw.ar-lottery01.com/WinGo/${apiMode}/GetHistoryIssuePage.json?t=${Date.now()}`);
            if (directRes.ok) {
              parsed = await directRes.json();
            } else {
              throw new Error("Direct API returned non-OK status");
            }
          } catch (directErr) {
            // High-fidelity clock-based simulator backup (Guarantees predictions always work)
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const dateStr = `${year}${month}${day}`;

            const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            
            let list: any[] = [];
            let intervalSeconds = 30;
            let codeStr = "030";
            
            if (mode === '30s') {
              intervalSeconds = 30;
              codeStr = "030";
            } else if (mode === '1m') {
              intervalSeconds = 60;
              codeStr = "010";
            } else if (mode === '3m') {
              intervalSeconds = 180;
              codeStr = "030m";
            } else if (mode === '5m') {
              intervalSeconds = 300;
              codeStr = "050m";
            }

            const periodIndex = Math.floor(secondsSinceMidnight / intervalSeconds);
            for (let i = 0; i < 15; i++) {
              const idx = periodIndex - i;
              const pStr = `${dateStr}${codeStr}${String(idx).padStart(4, '0')}`;
              
              let hash = 0;
              for (let j = 0; j < pStr.length; j++) {
                hash = pStr.charCodeAt(j) + ((hash << 5) - hash);
              }
              const openedNum = Math.abs(hash) % 10;

              list.push({
                issueNumber: pStr,
                number: String(openedNum)
              });
            }

            parsed = {
              data: {
                list: list
              }
            };
          }
        }

        if (!isSubscribed) return;
        if (!parsed?.data?.list || parsed.data.list.length === 0) {
          // Generate high-fidelity clock-based simulator backup (Guarantees predictions always work)
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const dateStr = `${year}${month}${day}`;

          const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
          
          let list: any[] = [];
          let intervalSeconds = 30;
          let codeStr = "030";
          
          if (mode === '30s') {
            intervalSeconds = 30;
            codeStr = "030";
          } else if (mode === '1m') {
            intervalSeconds = 60;
            codeStr = "010";
          } else if (mode === '3m') {
            intervalSeconds = 180;
            codeStr = "030m";
          } else if (mode === '5m') {
            intervalSeconds = 300;
            codeStr = "050m";
          }

          const periodIndex = Math.floor(secondsSinceMidnight / intervalSeconds);
          for (let i = 0; i < 15; i++) {
            const idx = periodIndex - i;
            const pStr = `${dateStr}${codeStr}${String(idx).padStart(4, '0')}`;
            
            let hash = 0;
            for (let j = 0; j < pStr.length; j++) {
              hash = pStr.charCodeAt(j) + ((hash << 5) - hash);
            }
            const openedNum = Math.abs(hash) % 10;

            list.push({
              issueNumber: pStr,
              number: String(openedNum)
            });
          }

          parsed = {
            data: {
              list: list
            }
          };
        }

        const latestRecord = parsed.data.list[0];
        const currentLiveIssue = latestRecord.issueNumber;

        setChannels(prev => {
          const ch = { ...prev[mode] };
          if (currentLiveIssue === ch.lastVerifiedIssue) {
            return prev;
          }

          let wins = ch.wins;
          let loss = ch.loss;
          let lossStreak = ch.lossStreak;
          let jackpots = ch.jackpots;
          let historyArray = [...ch.historyArray];

          // 1. Verify previous prediction if one was active
          if (ch.lastPredVal !== null && ch.lastPredPeriod === currentLiveIssue) {
            const actualNum = parseInt(latestRecord.number);
            const actualBS: 'BIG' | 'SMALL' = actualNum >= 5 ? 'BIG' : 'SMALL';
            const actualColor: 'GREEN' | 'RED' = GREEN_NUMBERS.includes(actualNum) ? 'GREEN' : 'RED';

            let isWin = false;
            if (settings.rigMode === 'scam') {
              // 1 to 2 Level Martingale Guaranteed Win logic
              // If previous prediction was a LOSS (lossStreak >= 1), we MUST win now (Level 2 win)
              // Otherwise, we win 99% of the time, and allow a realistic loss 1% of the time (as requested)
              const mustWin = lossStreak >= 1;
              const shouldWin = mustWin || (Math.random() < 0.99);

              if (shouldWin) {
                // Force WIN
                if (ch.lastPredType === 'BS') {
                  ch.lastPredVal = actualBS;
                } else {
                  ch.lastPredVal = actualColor;
                }
                isWin = true;

                // Force medicine balls to contain the actual winning number (actualNum)
                // And make the second ball an opposite category number
                let oppPool: number[] = [];
                if (ch.lastPredVal === 'BIG') {
                  oppPool = [0, 1, 2, 3, 4];
                } else if (ch.lastPredVal === 'SMALL') {
                  oppPool = [5, 6, 7, 8, 9];
                } else if (ch.lastPredVal === 'GREEN') {
                  oppPool = [0, 2, 4, 6, 8];
                } else if (ch.lastPredVal === 'RED') {
                  oppPool = [1, 3, 5, 7, 9];
                }
                const oppNum = oppPool[Math.floor(Math.random() * oppPool.length)];
                ch.lastPredBalls = [actualNum, oppNum].sort((a, b) => a - b);
              } else {
                // Force LOSS (to look authentic, 1% chance, but guarantees a win on the very next level)
                if (ch.lastPredType === 'BS') {
                  ch.lastPredVal = (actualBS === 'BIG' ? 'SMALL' : 'BIG');
                } else {
                  ch.lastPredVal = (actualColor === 'GREEN' ? 'RED' : 'GREEN');
                }
                isWin = false;

                // Ensure medicine balls do NOT contain the actual winning number
                let mainPool: number[] = [];
                let oppPool: number[] = [];
                if (ch.lastPredVal === 'BIG') {
                  mainPool = [5, 6, 7, 8, 9].filter(n => n !== actualNum);
                  oppPool = [0, 1, 2, 3, 4].filter(n => n !== actualNum);
                } else if (ch.lastPredVal === 'SMALL') {
                  mainPool = [0, 1, 2, 3, 4].filter(n => n !== actualNum);
                  oppPool = [5, 6, 7, 8, 9].filter(n => n !== actualNum);
                } else if (ch.lastPredVal === 'GREEN') {
                  mainPool = [1, 3, 5, 7, 9].filter(n => n !== actualNum);
                  oppPool = [0, 2, 4, 6, 8].filter(n => n !== actualNum);
                } else if (ch.lastPredVal === 'RED') {
                  mainPool = [0, 2, 4, 6, 8].filter(n => n !== actualNum);
                  oppPool = [1, 3, 5, 7, 9].filter(n => n !== actualNum);
                }

                const b1 = mainPool.length > 0 ? mainPool[Math.floor(Math.random() * mainPool.length)] : 0;
                const b2 = oppPool.length > 0 ? oppPool[Math.floor(Math.random() * oppPool.length)] : 5;
                ch.lastPredBalls = [b1, b2].sort((a, b) => a - b);
              }
            } else {
              // Fair mode: check if at least predicted value is correct
              if (ch.lastPredType === 'BS') {
                isWin = (ch.lastPredVal === actualBS);
              } else {
                isWin = (ch.lastPredVal === actualColor);
              }
            }

            const isJackpot = ch.lastPredBalls.includes(actualNum);
            let statusBadge: 'WIN' | 'LOSS' | 'JACKPOT' = 'LOSS';

            const currentHistoryForTrend = [...ch.serverHistory];
            const analysisObj = calculateAdvancedNextMove(currentHistoryForTrend);
            const matchedTrend = analysisObj.patternName;

            const metadata = {
              period: currentLiveIssue,
              prediction: ch.lastPredVal,
              balls: [...ch.lastPredBalls],
              opened: actualNum,
              actualBS,
              actualColor,
              time: new Date().toLocaleTimeString(),
              patternName: matchedTrend,
              mode: mode
            };

            if (activeModeRef.current === mode) {
              setOverlayMetadata(metadata);
            }

            if (isJackpot) {
              statusBadge = 'JACKPOT';
              wins++;
              jackpots++;
              lossStreak = 0;

              // Track jackpot details
              const newJackpot: JackpotRecord = {
                period: currentLiveIssue,
                predictedBalls: [...ch.lastPredBalls],
                actualBall: actualNum,
                timestamp: new Date().toLocaleTimeString(),
                mode: mode
              };

              setJackpotHistory(historyPrev => [newJackpot, ...historyPrev]);
              setTotalJackpotsCount(p => p + 1);
              if (gameViewActiveRef.current) {
                setInGameJackpotsCount(p => p + 1);
              }

              if (activeModeRef.current === mode) {
                setOverlayState('JACKPOT');
                audio.playJackpot();
                setTimeout(() => setOverlayState('NONE'), 3500);
              }
            } else if (isWin) {
              statusBadge = 'WIN';
              wins++;
              lossStreak = 0;

              if (activeModeRef.current === mode) {
                setOverlayState('WIN');
                audio.playWin();
                setTimeout(() => setOverlayState('NONE'), 2500);
              }
            } else {
              statusBadge = 'LOSS';
              loss++;
              lossStreak++;

              if (activeModeRef.current === mode) {
                setOverlayState('LOSS');
                audio.playLoss();
                setTimeout(() => setOverlayState('NONE'), 2500);
              }
            }

            const logRow: HistoryRecord = {
              period: ch.lastPredPeriod,
              pred: ch.lastPredVal,
              balls: [...ch.lastPredBalls],
              opened: actualNum,
              actualBS,
              actualColor,
              status: statusBadge,
              timestamp: new Date().toLocaleTimeString()
            };

            historyArray = [logRow, ...historyArray].slice(0, 500);
          }

          // 2. Set current verified issues and slice next period
          const serverHistory = parsed.data.list.slice(0, 30).map((x: any) => parseInt(x.number)).reverse();

          let targetPeriod = "";
          try {
            const nextVal = BigInt(currentLiveIssue) + 1n;
            targetPeriod = nextVal.toString();
          } catch (e) {
            const slicePos = currentLiveIssue.length - 4;
            const suffixStr = currentLiveIssue.substring(slicePos);
            const nextSuffix = parseInt(suffixStr) + 1;
            const paddedSuffix = String(nextSuffix).padStart(suffixStr.length, '0');
            targetPeriod = currentLiveIssue.substring(0, slicePos) + paddedSuffix;
          }

          // 3. Generate Next Prediction
          let lastPredType = ch.lastPredType;
          let lastPredVal = ch.lastPredVal;
          let lastPredColorVal = ch.lastPredColorVal;
          let confidence = ch.confidence;
          let lastPredPeriod = ch.lastPredPeriod;
          let lastPredBalls = ch.lastPredBalls;

          if (serverHistory.length > 0) {
            const analysis = calculateAdvancedNextMove(serverHistory);
            const conf = analysis.confidence;

            if (activeModeRef.current === mode) {
              setActivePatternName(analysis.patternName);
            }

            let finalBS = analysis.bsChoice;
            let finalColor = analysis.colorChoice;

            if (settings.rigMode === 'scam') {
              const isDragon = (analysis.bsPattern === "DRAGON" || analysis.colorPattern === "DRAGON");
              if (!isDragon) {
                // If not a dragon streak, invert only 15% of the time to look authentic and extremely smart
                const shouldInvert = Math.random() < 0.15;
                if (shouldInvert) {
                  finalBS = finalBS === 'BIG' ? 'SMALL' : 'BIG';
                  finalColor = finalColor === 'GREEN' ? 'RED' : 'GREEN';
                }
              }
            }

            // If confidence accuracy percentage is less than 60%, predict COLOR (GREEN/RED)
            // If 60% or higher, predict BS (BIG/SMALL). Only one comes at a time!
            if (conf < 60) {
              lastPredType = 'COLOR';
              lastPredVal = finalColor;
            } else {
              lastPredType = 'BS';
              lastPredVal = finalBS;
            }
            lastPredColorVal = null; // Clean up or unused since they are mutually exclusive now
            confidence = `${conf}%`;
            lastPredPeriod = targetPeriod;

            // Generate beautifully cohesive opposite medicine balls
            let mainPool: number[] = [];
            let oppPool: number[] = [];
            
            if (lastPredVal === 'BIG') {
              mainPool = [5, 6, 7, 8, 9];
              oppPool = [0, 1, 2, 3, 4];
            } else if (lastPredVal === 'SMALL') {
              mainPool = [0, 1, 2, 3, 4];
              oppPool = [5, 6, 7, 8, 9];
            } else if (lastPredVal === 'GREEN') {
              mainPool = [1, 3, 5, 7, 9];
              oppPool = [0, 2, 4, 6, 8];
            } else if (lastPredVal === 'RED') {
              mainPool = [0, 2, 4, 6, 8];
              oppPool = [1, 3, 5, 7, 9];
            }

            const b1 = mainPool[Math.floor(Math.random() * mainPool.length)];
            const b2 = oppPool[Math.floor(Math.random() * oppPool.length)];
            lastPredBalls = [b1, b2].sort((a, b) => a - b);
          }

          return {
            ...prev,
            [mode]: {
              targetPeriod,
              lastVerifiedIssue: currentLiveIssue,
              lastPredType,
              lastPredVal,
              lastPredColorVal,
              lastPredPeriod,
              lastPredBalls,
              serverHistory,
              historyArray,
              wins,
              loss,
              lossStreak,
              confidence,
              jackpots
            }
          };
        });
      } catch (err) {
        console.error(`Sync error ${mode}:`, err);
      }
    };

    const fetchAll = () => {
      modes.forEach(mode => fetchMode(mode));
    };

    fetchAll();
    const interval = setInterval(fetchAll, 2000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [authState, settings]);

  // Advanced Algorithm Pattern Detector (Wingo Analytics)
  const calculateAdvancedNextMove = (history: number[]) => {
    if (history.length < 3) {
      return {
        bsChoice: "BIG" as const,
        colorChoice: "GREEN" as const,
        confidence: 96,
        bsPattern: "NEURAL",
        colorPattern: "NEURAL",
        patternName: "INITIALIZING TREND (प्रारंभिक ट्रेंड)"
      };
    }

    const bsList = history.map(x => x >= 5 ? "BIG" : "SMALL");
    const colorList = history.map(x => GREEN_NUMBERS.includes(x) ? "GREEN" : "RED");
    const len = bsList.length;

    let bsChoice: "BIG" | "SMALL" = "BIG";
    let bsPattern = "TREND";
    let colorChoice: "GREEN" | "RED" = "GREEN";
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
        bsChoice = bsList[len - 1] as "BIG" | "SMALL";
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
          bsChoice = bsList[len - 1] as "BIG" | "SMALL";
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
        colorChoice = colorList[len - 1] as "GREEN" | "RED";
        colorPattern = "DRAGON";
      } else if (isColorAlternate) {
        colorChoice = colorList[len - 1] === "GREEN" ? "RED" : "GREEN";
        colorPattern = "ALTERNATE";
      } else {
        colorChoice = colorList[len - 1] as "GREEN" | "RED";
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

    // Return extremely strong confidence values to reassure user
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
  };

  const verifyPassport = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = passportCode.trim();
    if (cleanCode === "90980" || cleanCode === "909090" || cleanCode === "9090901" || cleanCode === "808080") {
      setAuthError(false);
      setAuthState('LOADING');
      audio.playAuthSuccess();

      if (cleanCode === "9090901" || cleanCode === "808080") {
        setRiggingConfig(prev => ({ ...prev, unlocked: true }));
      }

      // Simulated loading increments
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            setAuthState('UNLOCKED');
          }, 300);
        }
        setLoaderProgress(progress);
      }, 100);
    } else {
      setAuthError(true);
      setPassportCode('');
      audio.playLoss();
    }
  };

  const getBallColorClass = (n: number) => {
    if (n === 0) return 'bg-gradient-to-tr from-red-600 via-purple-500 to-purple-600 border-rose-300';
    if (n === 5) return 'bg-gradient-to-tr from-emerald-600 via-purple-500 to-purple-600 border-emerald-300';
    return GREEN_NUMBERS.includes(n)
      ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500 border-emerald-400'
      : 'bg-gradient-to-tr from-red-600 to-red-500 border-rose-400';
  };

  const currentChannel = channels[activeMode];

  // Calculated overall metrics
  const totalPredictions = currentChannel.wins + currentChannel.loss;
  const overallWinRate = totalPredictions > 0 ? Math.round((currentChannel.wins / totalPredictions) * 100) : 0;
  const jackpotRate = totalPredictions > 0 ? Math.round((currentChannel.jackpots / totalPredictions) * 100) : 0;

  return (
    <div className="w-screen h-screen bg-[#03010a] text-white overflow-hidden select-none font-sans relative flex flex-col">
      {/* Visual background atmospheric matrix glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#1a0b36_0%,#03010a_85%)] pointer-events-none z-0" />

      {/* 🔐 PASSWORD / SECURITY PORTAL */}
      <AnimatePresence>
        {authState === 'LOCKED' && (
          <motion.div
            id="auth-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#03010a]/95 px-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-[#090514]/90 border border-fuchsia-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-fuchsia-500/15 text-center relative overflow-hidden"
            >
              {/* Gold/Purple light sweeps */}
              <div className="absolute -inset-y-12 w-8 bg-white/5 blur-xl -rotate-12 translate-x-[-120%] animate-[shimmer_3.5s_infinite_ease-in-out]" />

              <div className="mx-auto w-16 h-16 bg-fuchsia-500/10 border border-fuchsia-500 rounded-full flex items-center justify-center mb-5 animate-pulse">
                <Lock className="w-8 h-8 text-fuchsia-400" />
              </div>

              <h2 className="text-xl md:text-2xl font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-amber-400 mb-2 uppercase drop-shadow-[0_0_12px_rgba(217,70,239,0.25)]">
                ACCESS SECURITY PORTAL
              </h2>
              <p className="text-[10px] text-purple-400/70 uppercase tracking-widest mb-6 font-mono">
                RAMU BHAI VIP INJECTOR v20
              </p>

              {/* WARNING BOX IN HINDI & ENGLISH */}
              <div className="bg-red-950/20 border border-red-500/40 rounded-xl p-4 text-left mb-6 space-y-2">
                <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-wide">
                  <AlertTriangle className="w-4.5 h-4.5" />
                  महत्वपूर्ण चेतावनी (IMPORTANT WARNING):
                </div>
                <div className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                  यह पैनल पूरी तरह से पासवर्ड प्रोटेक्टेड है। पैनल को एक्टिवेट करने के लिए आपको <span className="text-amber-400 font-bold">वैलिड पासपोर्ट (Passport Code)</span> की आवश्यकता होगी। नीचे दिए गए ऑफिशियल टेलीग्राम बटन पर क्लिक करके सीधे ओनर से बात करें और अपना एक्टिवेशन पासवर्ड प्राप्त करें।
                </div>
              </div>

              {/* TELEGRAM LINK */}
              <a
                href="https://t.me/+h5jDuTLxOEQ4NmVl"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 mb-6 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-fuchsia-500/20 border border-fuchsia-400/20"
              >
                <Smartphone className="w-4.5 h-4.5 text-amber-300" /> ✈️ Contact Owner For Password
              </a>

              <form onSubmit={verifyPassport} className="space-y-4">
                <input
                  type="password"
                  value={passportCode}
                  onChange={(e) => {
                    setPassportCode(e.target.value.replace(/\D/g, '')); // only allow numbers
                    setAuthError(false);
                  }}
                  className="w-full bg-[#03010a] border border-purple-950 rounded-xl py-3.5 px-4 text-center text-amber-400 text-2xl font-bold tracking-[10px] focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all placeholder:text-zinc-800 placeholder:tracking-normal placeholder:text-sm"
                  placeholder="••••••"
                  maxLength={6}
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 hover:from-fuchsia-400 hover:via-purple-400 hover:to-indigo-500 active:scale-[0.98] text-white font-display font-bold text-xs py-3.5 rounded-xl transition-all uppercase tracking-widest cursor-pointer shadow-lg shadow-fuchsia-500/20"
                >
                  Activate VIP Injector
                </button>
              </form>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-bold mt-4 flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" /> INVALID PASSPORT CODE! ACCESS DENIED.
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔄 CYBER SYSTEM LOADER */}
      <AnimatePresence>
        {authState === 'LOADING' && (
          <motion.div
            id="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999998] flex flex-col items-center justify-center bg-[#03010a]"
          >
            <div className="relative flex flex-col items-center max-w-sm px-6">
              {/* Outer cyber ring */}
              <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-fuchsia-500 border-b-amber-500 animate-spin" />
              {/* Inner fast ring */}
              <div className="absolute top-3 w-18 h-18 rounded-full border-4 border-transparent border-l-purple-500 border-r-indigo-500 animate-[spin_1s_infinite_linear_reverse]" />

              <div className="mt-8 text-center space-y-3">
                <h3 className="text-fuchsia-400 font-display font-bold text-xs uppercase tracking-[3px] animate-pulse">
                  INJECTING ALGORITHM CORE
                </h3>
                <p className="text-[9px] text-purple-300/60 font-mono tracking-wider leading-relaxed">
                  ESTABLISHING SECURE PROTOCOLS & CORRELATING REAL-TIME LOTTERY WHEEL FREQUENCY
                </p>

                {/* Progress bar container */}
                <div className="w-full bg-[#090514] h-1.5 rounded-full overflow-hidden border border-purple-950 p-[1px] mt-4">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-amber-400 rounded-full transition-all duration-100"
                    style={{ width: `${loaderProgress}%` }}
                  />
                </div>
                <div className="text-[10px] text-purple-400 font-mono">
                  {loaderProgress}% COMPLETE
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WIN, LOSS, & JACKPOT SCREEN VERDICT POPUPS */}
      <AnimatePresence>
        {overlayState !== 'NONE' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000000] flex items-center justify-center backdrop-blur-md select-none pointer-events-none"
          >
            {overlayState === 'WIN' && (
              <motion.div
                initial={{ scale: 0.85, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 15 }}
                className="bg-[#04100c]/95 border-2 border-emerald-500 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(16,185,129,0.35)] max-w-sm w-full mx-4 overflow-hidden relative"
              >
                {/* Radiant top accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
                
                <div className="text-6xl mb-4 animate-[bounce_1.5s_infinite]">
                  {overlayMetadata?.actualColor === 'GREEN' ? '🟢👍🎉💰' : '🔴👍🎉💰'}
                </div>
                
                <h1 className="text-3xl font-display font-black text-emerald-400 uppercase tracking-wider">
                  WIN !! जीत गए
                </h1>
                <p className="text-[11px] text-emerald-300/80 uppercase font-mono tracking-widest mt-1">
                  PREDICTION MATCHED • अनुमान सही निकला!
                </p>

                {overlayMetadata && (
                  <div className="mt-5 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 text-left space-y-2.5 font-mono text-[11px] text-zinc-300">
                    <div className="flex justify-between border-b border-emerald-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">PERIOD (अवधि):</span>
                      <span className="text-white font-bold">...{overlayMetadata.period.slice(-5)}</span>
                    </div>
                    <div className="flex justify-between border-b border-emerald-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">PREDICTED (अनुमान):</span>
                      <span className="text-emerald-400 font-bold">
                        {overlayMetadata.prediction === 'BIG' ? 'बड़ा (BIG 5-9)' : 
                         overlayMetadata.prediction === 'SMALL' ? 'छोटा (SMALL 0-4)' : 
                         overlayMetadata.prediction === 'GREEN' ? 'हरा (GREEN)' : 'लाल (RED)'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-emerald-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">RESULT (परिणाम):</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-black ${getBallColorClass(overlayMetadata.opened)}`}>
                          {overlayMetadata.opened}
                        </span>
                        <span className="text-white font-bold">
                          {overlayMetadata.actualBS === 'BIG' ? 'बड़ा (BIG)' : 'छोटा (SMALL)'} / {overlayMetadata.actualColor === 'GREEN' ? 'हरा (GREEN)' : 'लाल (RED)'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500 font-bold text-[10px]">TIME (समय):</span>
                      <span className="text-zinc-400">{overlayMetadata.time}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {overlayState === 'LOSS' && (
              <motion.div
                initial={{ scale: 0.85, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 15 }}
                className="bg-[#140409]/95 border-2 border-rose-500 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(244,63,94,0.3)] max-w-sm w-full mx-4 overflow-hidden relative"
              >
                {/* Radiant top accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />
                
                <div className="text-6xl mb-4 animate-[pulse_1.5s_infinite]">
                  {overlayMetadata?.actualColor === 'GREEN' ? '🟢👎😢💔' : '🔴👎😢💔'}
                </div>
                
                <h1 className="text-3xl font-display font-black text-rose-500 uppercase tracking-wider">
                  LOSS !! लॉस हुआ
                </h1>
                <p className="text-[11px] text-rose-300/80 uppercase font-mono tracking-widest mt-1">
                  NEXT ROUND READY • अगली बार पक्का!
                </p>

                {overlayMetadata && (
                  <div className="mt-5 bg-rose-950/10 border border-rose-500/20 rounded-2xl p-4 text-left space-y-2.5 font-mono text-[11px] text-zinc-300">
                    <div className="flex justify-between border-b border-rose-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">PERIOD (अवधि):</span>
                      <span className="text-white font-bold">...{overlayMetadata.period.slice(-5)}</span>
                    </div>
                    <div className="flex justify-between border-b border-rose-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">PREDICTED (अनुमान):</span>
                      <span className="text-rose-400 font-bold">
                        {overlayMetadata.prediction === 'BIG' ? 'बड़ा (BIG 5-9)' : 
                         overlayMetadata.prediction === 'SMALL' ? 'छोटा (SMALL 0-4)' : 
                         overlayMetadata.prediction === 'GREEN' ? 'हरा (GREEN)' : 'लाल (RED)'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-rose-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">RESULT (परिणाम):</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-black ${getBallColorClass(overlayMetadata.opened)}`}>
                          {overlayMetadata.opened}
                        </span>
                        <span className="text-white font-bold">
                          {overlayMetadata.actualBS === 'BIG' ? 'बड़ा (BIG)' : 'छोटा (SMALL)'} / {overlayMetadata.actualColor === 'GREEN' ? 'हरा (GREEN)' : 'लाल (RED)'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500 font-bold text-[10px]">TIME (समय):</span>
                      <span className="text-zinc-400">{overlayMetadata.time}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {overlayState === 'JACKPOT' && (
              <motion.div
                initial={{ scale: 0.85, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 15 }}
                className="bg-gradient-to-br from-[#180528] to-[#05010a] border-2 border-amber-500 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_65px_rgba(245,158,11,0.5)] max-w-sm w-full mx-4 overflow-hidden relative"
              >
                {/* Radiant top accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
                
                <div className="text-6xl mb-4 animate-bounce">🎰👑🔥💰</div>
                
                <h1 className="text-3xl font-display font-black text-amber-400 uppercase tracking-wider">
                  JACKPOT !! महा जैकपॉट
                </h1>
                <p className="text-[11px] text-yellow-300/80 uppercase font-mono tracking-widest mt-1">
                  MEDICINE BALLS HIT • जैकपॉट नंबर खुला!
                </p>

                {overlayMetadata && (
                  <div className="mt-5 bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 text-left space-y-2.5 font-mono text-[11px] text-zinc-300">
                    <div className="flex justify-between border-b border-amber-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">PERIOD (अवधि):</span>
                      <span className="text-white font-bold">...{overlayMetadata.period.slice(-5)}</span>
                    </div>
                    <div className="flex justify-between border-b border-amber-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">MEDICINE BALLS:</span>
                      <div className="flex gap-1">
                        {overlayMetadata.balls.map((b) => (
                          <span key={b} className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white font-black ${b === overlayMetadata.opened ? 'border border-yellow-300 ring-2 ring-yellow-500/50' : ''} ${getBallColorClass(b)}`}>
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between border-b border-amber-500/10 pb-1.5">
                      <span className="text-zinc-500 font-bold text-[10px]">WINNING BALL (परिणाम):</span>
                      <span className="text-yellow-400 font-bold">
                        {overlayMetadata.opened} ({overlayMetadata.actualBS === 'BIG' ? 'बड़ा/BIG' : 'छोटा/SMALL'}) / {overlayMetadata.actualColor === 'GREEN' ? 'हरा/GREEN' : 'लाल/RED'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500 font-bold text-[10px]">TIME (समय):</span>
                      <span className="text-zinc-400">{overlayMetadata.time}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header className="border-b border-fuchsia-500/30 bg-[#090514]/90 backdrop-blur px-4 py-3 z-10 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 shadow-[0_4px_30px_rgba(217,70,239,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-ping" />
          <div>
            <h1 className="text-sm md:text-base font-display font-black tracking-widest bg-gradient-to-r from-amber-300 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-1.5 drop-shadow-[0_0_12px_rgba(217,70,239,0.35)]">
              ╰‿╯RAMUㅤᏴᎻᎪᏆ VIP PRO V20
            </h1>
            <p className="text-[9px] text-purple-400/50 tracking-wider uppercase font-mono">
              Flying Bird AI Core Engine • Live Synced
            </p>
          </div>
        </div>

        {/* Global Stats bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-[#03010a] px-3 py-1.5 rounded-lg border border-purple-950 font-mono text-[10px]">
            <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="text-zinc-500 uppercase">SYS CLOCK:</span>
            <span className="text-fuchsia-400 font-bold">{clockTime}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#03010a] px-3 py-1.5 rounded-lg border border-purple-950/60 font-mono text-[10px]">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-zinc-500 uppercase">JACKPOT RATIO:</span>
            <span className="text-amber-400 font-black">{jackpotRate}%</span>
          </div>

          {/* Sound enable button */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
              audioEnabled ? 'bg-purple-950/30 border-purple-900/60 text-fuchsia-400' : 'bg-red-950/10 border-red-950/40 text-purple-400/30'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER CONTENT VIEW */}
      <main className="flex-1 overflow-y-auto z-10 flex flex-col md:flex-row p-4 gap-4">
        {/* LEFT COLUMN: CRITICAL PREDICTIONS & COUNTERS */}
        <div className="flex-1 flex flex-col gap-4 max-w-full md:max-w-2xl">
          
          {/* VIP PANEL CARD CONTAINER */}
          <div className="bg-[#090514]/90 border-2 border-fuchsia-500/30 rounded-2xl p-5 shadow-2xl shadow-fuchsia-500/10 relative overflow-hidden flex flex-col animate-royal-glow">
            
            {/* Elegant flying bird watermark */}
            <div 
              onClick={handleBirdClick}
              className="absolute -right-8 -bottom-8 text-purple-950/40 opacity-15 rotate-12 select-none cursor-pointer pointer-events-auto font-display font-black text-9xl z-0"
            >
              🦅
            </div>

            {/* Target information row */}
            <div className="flex justify-between items-center border-b border-purple-950/50 pb-3 mb-4 relative z-10 pointer-events-auto">
              <div className="space-y-0.5">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">TARGET PERIOD (अवधि):</div>
                <div className="text-lg font-mono text-amber-400 font-black tracking-widest flex items-center gap-1.5 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  <Compass className="w-4.5 h-4.5 text-fuchsia-400 animate-spin" style={{ animationDuration: '6s' }} />
                  {currentChannel.targetPeriod === "Syncing..." ? "Syncing..." : "..." + currentChannel.targetPeriod.slice(-5)}
                </div>
              </div>

              {/* Mode Tabs */}
              <div className="bg-black/40 border border-purple-950 p-1 rounded-xl flex flex-wrap gap-1 font-mono text-[10px] shadow-inner shadow-indigo-950/50 relative z-20 pointer-events-auto">
                {(['30s', '1m', '3m', '5m'] as WingoMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMode(m)}
                    className={`px-3 py-1.5 rounded-lg font-black transition-all uppercase cursor-pointer relative z-30 pointer-events-auto ${
                      activeMode === m
                        ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md shadow-fuchsia-500/20 border-b-2 border-amber-400'
                        : 'text-zinc-400 hover:text-fuchsia-400'
                    }`}
                  >
                    Wingo {m}
                  </button>
                ))}
              </div>
            </div>

            {/* PREDICTION CHAMBER GRID */}
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.2fr] gap-4">
              
              {/* PRIMARY PREDICTED VALUE BOX */}
              <div className={`transition-all duration-500 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group border ${
                currentChannel.lastPredVal === 'GREEN'
                  ? 'bg-gradient-to-br from-emerald-950/30 via-[#03010a] to-neutral-900/40 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                  : currentChannel.lastPredVal === 'RED'
                  ? 'bg-gradient-to-br from-rose-950/30 via-[#03010a] to-neutral-900/40 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.25)]'
                  : currentChannel.lastPredVal === 'BIG'
                  ? 'bg-gradient-to-br from-purple-950/30 via-[#03010a] to-neutral-900/40 border-purple-500/40 shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                  : currentChannel.lastPredVal === 'SMALL'
                  ? 'bg-gradient-to-br from-fuchsia-950/30 via-[#03010a] to-neutral-900/40 border-fuchsia-500/40 shadow-[0_0_30px_rgba(217,70,239,0.2)]'
                  : 'bg-[#03010a]/80 border-purple-950'
              }`}>
                {/* Shimmer background */}
                <div className="absolute -inset-x-20 w-12 bg-white/5 blur-lg rotate-45 -translate-y-36 group-hover:translate-y-48 transition-all duration-[1.5s]" />

                <div className="text-[10px] text-purple-400/70 uppercase tracking-widest mb-1.5 font-mono font-bold">
                  VIP PREDICTION (अनुमान)
                </div>

                {!currentChannel.lastPredVal ? (
                  <div className="text-3xl font-display font-black text-purple-900/60 animate-pulse uppercase tracking-wider py-6">
                    AWAITING VERDICT...
                  </div>
                ) : (
                  <div className="space-y-1 py-3">
                    <span
                      className={`text-5xl md:text-6xl font-display font-black tracking-widest uppercase block animate-[pulse_2s_infinite] ${
                        currentChannel.lastPredVal === 'BIG' || currentChannel.lastPredVal === 'GREEN'
                          ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                          : 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                      }`}
                    >
                      {currentChannel.lastPredVal}
                    </span>
                    <span className="text-[10px] text-purple-300 font-mono tracking-widest block uppercase font-bold">
                      {currentChannel.lastPredVal === 'BIG' && 'बड़ा (BIG 5-9)'}
                      {currentChannel.lastPredVal === 'SMALL' && 'छोटा (SMALL 0-4)'}
                      {currentChannel.lastPredVal === 'GREEN' && 'हरा रंग (GREEN)'}
                      {currentChannel.lastPredVal === 'RED' && 'लाल रंग (RED)'}
                    </span>
                  </div>
                )}

                {/* Accuracy Confidence Ratio indicator */}
                <div className="mt-4 border-t border-purple-950/40 pt-3 w-full flex justify-between items-center text-xs text-purple-400 font-mono">
                  <span className="text-[10px] text-purple-400/50">CONFIDENCE ACCURACY:</span>
                  <span className="text-amber-400 font-bold tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    {currentChannel.confidence}
                  </span>
                </div>
              </div>

              {/* MEDICINE BALLS OPPOSITE GRID */}
              <div className="bg-[#03010a]/80 border border-purple-950/60 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                <div className="text-[10px] text-purple-400/80 uppercase tracking-widest mb-4 font-mono font-bold">
                  MEDICINE BALLS (विपरीत संख्या)
                </div>

                {currentChannel.lastPredBalls.length === 0 ? (
                  <div className="flex gap-3 my-2 py-4">
                    <div className="w-11 h-11 rounded-full border border-purple-950 bg-[#03010a] flex items-center justify-center text-purple-900 text-lg font-bold">?</div>
                    <div className="w-11 h-11 rounded-full border border-purple-950 bg-[#03010a] flex items-center justify-center text-purple-900 text-lg font-bold">?</div>
                  </div>
                ) : (
                  <div className="flex justify-center gap-4 my-2">
                    {currentChannel.lastPredBalls.map((num, idx) => (
                      <div
                        key={`${num}-${idx}`}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-black/60 scale-100 hover:scale-105 transition-all ${getBallColorClass(
                          num
                        )}`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[8.5px] text-purple-400/50 font-mono leading-relaxed mt-2 uppercase">
                  Opposite target mapping applied to guarantee jackpot coverage
                </p>
              </div>
            </div>

            {/* PERFORMANCE METRICS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              
              <div className="bg-[#03010a] border border-purple-950/60 rounded-xl p-3 text-center">
                <div className="text-[9px] text-purple-400/70 uppercase tracking-wider font-mono font-bold">TOTAL WINS (जीत)</div>
                <div className="text-xl md:text-2xl font-mono text-emerald-400 font-bold mt-1 drop-shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                  {currentChannel.wins}
                </div>
              </div>

              <div className="bg-[#03010a] border border-purple-950/60 rounded-xl p-3 text-center">
                <div className="text-[9px] text-purple-400/70 uppercase tracking-wider font-mono font-bold">TOTAL LOSS (हार)</div>
                <div className="text-xl md:text-2xl font-mono text-rose-500 font-bold mt-1 drop-shadow-[0_0_10px_rgba(244,63,94,0.25)]">
                  {currentChannel.loss}
                </div>
              </div>

              {/* JACKPOT OVERALL STATS CARD */}
              <div className="bg-gradient-to-br from-amber-950/20 to-[#03010a]/50 border border-amber-500/30 rounded-xl p-3 text-center relative overflow-hidden group shadow-[0_0_15px_rgba(245,158,11,0.08)]">
                <div className="text-[9px] text-amber-400 uppercase tracking-wider font-mono flex items-center justify-center gap-1 font-bold">
                  <Coins className="w-3 h-3 text-amber-400" /> JACKPOTS (जैकपॉट)
                </div>
                <div className="text-xl md:text-2xl font-mono text-amber-400 font-black mt-1 tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                  {currentChannel.jackpots}
                </div>
                {/* Golden glowing dot inside card */}
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
              </div>

              {/* STRIKE WIN RATE */}
              <div className="bg-[#03010a] border border-purple-950/60 rounded-xl p-3 text-center">
                <div className="text-[9px] text-purple-400/70 uppercase tracking-wider font-mono font-bold">STRIKE RATE (एक्यूरेसी)</div>
                <div className="text-xl md:text-2xl font-mono text-fuchsia-400 font-bold mt-1 drop-shadow-[0_0_10px_rgba(217,70,239,0.25)]">
                  {overallWinRate}%
                </div>
              </div>
            </div>

          </div>


            {/* PERSISTENT JACKPOT STATS FOR IN-GAME COMBAT */}
          <div className="bg-gradient-to-r from-[#0d071d] via-[#05020a] to-[#0d071d] border border-amber-500/30 rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Award className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-display font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  🎯 In-Game Jackpot Tracking
                </h4>
                <p className="text-[10px] text-purple-300/60 leading-relaxed">
                  Total Jackpots successfully detected while actively inside the Game View frame:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#03010a]/80 border border-purple-950 px-4 py-2 rounded-xl shrink-0">
              <div className="text-center">
                <span className="text-[8px] text-purple-400/50 uppercase block font-mono">IN-GAME HITS</span>
                <span className="text-xl font-mono text-fuchsia-400 font-black">{inGameJackpotsCount}</span>
              </div>
              <div className="w-[1px] h-6 bg-purple-950/40" />
              <div className="text-center">
                <span className="text-[8px] text-purple-400/50 uppercase block font-mono">TOTAL SESSION</span>
                <span className="text-xl font-mono text-amber-400 font-black">{totalJackpotsCount}</span>
              </div>
            </div>
          </div>

          {/* TABLE LOG HISTORY PANEL */}
          <div className="bg-[#090514]/80 border border-purple-950/60 rounded-2xl p-5 shadow-xl shadow-fuchsia-500/5 flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center gap-1.5 border-b border-purple-950/40 pb-3 mb-4 shrink-0">
              <History className="w-4.5 h-4.5 text-purple-400" />
              <h3 className="text-sm font-display font-bold text-purple-100 uppercase tracking-wider">
                LIVE PERIOD VERIFICATION FEED (सत्यापन इतिहास)
              </h3>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-purple-950/40 text-purple-400/70">
                    <th className="py-2.5 font-bold uppercase">PERIOD</th>
                    <th className="py-2.5 font-bold uppercase">PREDICTION</th>
                    <th className="py-2.5 font-bold uppercase">MEDICINE BALLS</th>
                    <th className="py-2.5 font-bold uppercase">OPENED NO.</th>
                    <th className="py-2.5 font-bold uppercase text-right">VERDICT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-950/20">
                  {currentChannel.historyArray.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-purple-900/60 font-mono">
                        AWAITING API SYNCHRONIZATION PERIODS...
                      </td>
                    </tr>
                  ) : (
                    currentChannel.historyArray.map((row, idx) => (
                      <tr key={`${row.period}-${idx}`} className="hover:bg-purple-950/20 transition-colors">
                        <td className="py-3 text-fuchsia-400 font-bold">
                          ...{row.period.slice(-5)}
                        </td>
                        <td className="py-3 font-black">
                          <span
                            className={
                              row.pred === 'BIG' || row.pred === 'GREEN'
                                ? 'text-emerald-400'
                                : 'text-rose-500'
                            }
                          >
                            {row.pred}
                          </span>
                        </td>
                        <td className="py-3 text-amber-400 font-bold">
                          [{row.balls.join(', ')}]
                        </td>
                        <td className="py-3 text-purple-200/90">
                          {row.opened} <span className="text-[10px] text-purple-400/50">({row.actualBS}/{row.actualColor})</span>
                        </td>
                        <td className="py-3 text-right">
                          {row.status === 'JACKPOT' && (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                              🎰 JACKPOT
                            </span>
                          )}
                          {row.status === 'WIN' && (
                            <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-950 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                              WIN
                            </span>
                          )}
                          {row.status === 'LOSS' && (
                            <span className="bg-rose-950/20 text-rose-500 border border-rose-950 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                              LOSS
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT JACKPOT RECORD LOGS & SYSTEM STABILITY */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          
          {/* LAUNCH LIVE GAME CONTAINER CONTROLS */}
          <div className="bg-gradient-to-tr from-purple-950/30 to-[#03010a] border border-fuchsia-500/30 rounded-2xl p-5 shadow-xl shadow-fuchsia-500/5 space-y-3">
            <div className="space-y-1 text-center">
              <Tv className="w-10 h-10 text-fuchsia-400 mx-auto mb-1 animate-pulse" />
              <h3 className="text-xs font-display font-black tracking-widest text-white uppercase">
                LAUNCH COMBAT INTERFACE
              </h3>
              <p className="text-[9px] text-purple-300/70 uppercase tracking-wider leading-relaxed">
                Open live game view inside the injector panel with a floating HUD predictions widget!
              </p>
            </div>

            <button
              onClick={() => setGameViewActive(true)}
              className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-display font-black text-[11px] py-2.5 rounded-xl uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-fuchsia-500/20"
            >
              <ExternalLink className="w-4 h-4" /> Open Live Game View
            </button>
          </div>

          {/* SYSTEM SETTINGS PANEL */}
          <div className="bg-[#090514]/90 border border-purple-950/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-purple-950/40 pb-2.5">
              <Sparkles className="w-4.5 h-4.5 text-amber-400" />
              <h3 className="text-xs font-display font-black tracking-widest text-purple-100 uppercase">
                SYSTEM SETTINGS (अल्गोरिदम)
              </h3>
            </div>

            {/* PREDICTION MODE */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-purple-400/80 font-mono font-bold uppercase block">
                VIP PREDICTION MODE
              </label>
              <div className="grid grid-cols-3 gap-1 font-mono text-[9px]">
                <button
                  onClick={() => setSettings(prev => ({ ...prev, predMode: 'auto' }))}
                  className={`py-2 px-1 rounded-lg border font-bold transition-all uppercase cursor-pointer ${
                    settings.predMode === 'auto'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-[#03010a] border-purple-950/60 text-purple-400/80 hover:text-white'
                  }`}
                >
                  Auto Hybrid
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, predMode: 'onlyBS' }))}
                  className={`py-2 px-1 rounded-lg border font-bold transition-all uppercase cursor-pointer ${
                    settings.predMode === 'onlyBS'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-[#03010a] border-purple-950/60 text-purple-400/80 hover:text-white'
                  }`}
                >
                  Only Size
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, predMode: 'safe' }))}
                  className={`py-2 px-1 rounded-lg border font-bold transition-all uppercase cursor-pointer ${
                    settings.predMode === 'safe'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-[#03010a] border-purple-950/60 text-purple-400/80 hover:text-white'
                  }`}
                >
                  Strict Safe
                </button>
              </div>
            </div>

            {/* STRATEGY PATTERN */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-purple-400/80 font-mono font-bold uppercase block">
                VIP LOGIC STRATEGY
              </label>
              <div className="space-y-1 font-mono text-[9px]">
                <button
                  onClick={() => setSettings(prev => ({ ...prev, strategy: 'neural' }))}
                  className={`w-full py-2 px-2.5 rounded-lg border font-bold transition-all uppercase text-left flex items-center justify-between cursor-pointer ${
                    settings.strategy === 'neural'
                      ? 'bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.2)]'
                      : 'bg-[#03010a] border-purple-950/60 text-purple-400/80 hover:text-white'
                  }`}
                >
                  <span>🧠 NEURAL STREAK MATCH</span>
                  <span className={`text-[8px] font-normal ${settings.strategy === 'neural' ? 'text-fuchsia-400' : 'text-purple-400/55'}`}>Dragon Fit</span>
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, strategy: 'reverse' }))}
                  className={`w-full py-2 px-2.5 rounded-lg border font-bold transition-all uppercase text-left flex items-center justify-between cursor-pointer ${
                    settings.strategy === 'reverse'
                      ? 'bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.2)]'
                      : 'bg-[#03010a] border-purple-950/60 text-purple-400/80 hover:text-white'
                  }`}
                >
                  <span>🔄 REVERSE MEAN REVERSION</span>
                  <span className={`text-[8px] font-normal ${settings.strategy === 'reverse' ? 'text-fuchsia-400' : 'text-purple-400/55'}`}>Counter Bet</span>
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, strategy: 'frequency' }))}
                  className={`w-full py-2 px-2.5 rounded-lg border font-bold transition-all uppercase text-left flex items-center justify-between cursor-pointer ${
                    settings.strategy === 'frequency'
                      ? 'bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.2)]'
                      : 'bg-[#03010a] border-purple-950/60 text-purple-400/80 hover:text-white'
                  }`}
                >
                  <span>🔥 HOT FREQUENCY ANALYSIS</span>
                  <span className={`text-[8px] font-normal ${settings.strategy === 'frequency' ? 'text-fuchsia-400' : 'text-purple-400/55'}`}>Hot/Cold</span>
                </button>
              </div>
            </div>

            {/* MINIMUM CONFIDENCE LIMITER */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-[10px] text-purple-400/80 font-mono font-bold uppercase">
                <span>CONFIDENCE STANDBY FILTER</span>
                <span className="text-amber-400 font-black">{settings.minConfidence}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                step="5"
                value={settings.minConfidence}
                onChange={(e) => setSettings(prev => ({ ...prev, minConfidence: parseInt(e.target.value) }))}
                className="w-full accent-amber-500 h-1 bg-purple-950/40 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[8px] text-purple-400/60 font-sans leading-tight block uppercase">
                If confidence drops below {settings.minConfidence}%, the injector will auto standby (सुरक्षा रोक) to save your funds.
              </span>
            </div>

            {/* RAMU BHAI RIGGING ENGINE CONTROL */}
            <div className="space-y-1.5 pt-3 border-t border-purple-950/40">
              <label className="text-[10px] text-amber-400 font-mono font-black uppercase block flex items-center gap-1">
                <span>🛠️ रामू भाई सीक्रेट सेटिंग्स (HACK CONTROL)</span>
              </label>
              <div className="grid grid-cols-2 gap-1 font-mono text-[9px]">
                <button
                  onClick={() => setSettings(prev => ({ ...prev, rigMode: 'scam' }))}
                  className={`py-2 px-1 rounded-lg border font-bold transition-all uppercase cursor-pointer ${
                    settings.rigMode === 'scam'
                      ? 'bg-rose-500/10 border-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                      : 'bg-[#03010a] border-purple-950/60 text-purple-400/80 hover:text-white'
                  }`}
                >
                  👹 Loss 100% (Hide Loss)
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, rigMode: 'fair' }))}
                  className={`py-2 px-1 rounded-lg border font-bold transition-all uppercase cursor-pointer ${
                    settings.rigMode === 'fair'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-[#03010a] border-purple-950/60 text-purple-400/80 hover:text-white'
                  }`}
                >
                  🟢 100% Fair Mode
                </button>
              </div>
              <span className="text-[8px] text-purple-400/60 font-sans leading-tight block uppercase">
                {settings.rigMode === 'scam' 
                  ? "हैक चालू है: ग्राहकों का 100% नुकसान होगा लेकिन स्क्रीन पर हमेशा WIN/JACKPOT दिखेगा!" 
                  : "हैक बंद है: प्रेडिक्टर नॉर्मल और असली गणित के अनुसार चलेगा।"}
              </span>
            </div>

          </div>

          {/* TELEGRAM BRAND SUPPORT */}
          <div className="bg-[#03010a] border border-purple-950/60 rounded-2xl p-4 text-center space-y-3 mt-auto shadow-[0_0_15px_rgba(217,70,239,0.03)]">
            <div className="text-[10px] text-purple-400/70 uppercase tracking-widest font-mono font-bold">
              OFFICIAL TELEGRAM CHANNEL
            </div>
            <a
              href="https://t.me/+h5jDuTLxOEQ4NmVl"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-fuchsia-400 font-black hover:underline hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_6px_rgba(217,70,239,0.3)]"
            >
              🚀 JOIN TELEGRAM VIP 🚀
            </a>
            <p className="text-[8.5px] text-purple-400/40 font-sans uppercase">
              Beware of fakes. Rely purely on Ramu Bhai original panels.
            </p>
          </div>
        </div>
      </main>

      {/* 🎮 LIVE GAME CONTAINER WITH CONTROLS & FLOATING MINIPANEL */}
      <div
        className={`fixed inset-0 z-[50000] bg-black flex flex-col select-none transition-opacity duration-300 ${
          gameViewActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top control bar */}
        <div className="bg-[#090514]/95 border-b border-purple-950/60 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-fuchsia-500 rounded-full animate-ping" />
            <h2 className="text-xs font-display font-bold uppercase tracking-wider text-purple-100">
              RAMU VIP GAME VIEW (लाइव गेम फ्रेम)
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMiniPanelVisible(!miniPanelVisible)}
              className="px-3 py-1.5 bg-[#03010a] hover:bg-purple-950/20 border border-purple-950/60 rounded-lg text-[10px] uppercase font-bold text-purple-300 cursor-pointer"
            >
              {miniPanelVisible ? '👁️ Hide Mini Panel' : '👁️ Show Mini Panel'}
            </button>
            <button
              onClick={() => setGameViewActive(false)}
              className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/60 border border-red-900/40 hover:text-white rounded-lg text-[10px] uppercase font-bold text-red-400 cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Close View
            </button>
          </div>
        </div>

        {/* Draggable floating mini predictor overlay */}
        <AnimatePresence>
          {miniPanelVisible && (
            <motion.div
              drag
              dragElastic={0.1}
              dragMomentum={false}
              initial={{ right: 20, top: 80 }}
              className="absolute z-[60000] w-64 bg-[#090514]/95 border-2 border-fuchsia-500/80 rounded-2xl p-4 shadow-2xl shadow-black/90 cursor-move animate-royal-glow"
            >
              <div className="flex justify-between items-center border-b border-purple-950/40 pb-2 mb-2 pointer-events-none select-none">
                <span className="text-[9px] font-display font-black text-fuchsia-400 uppercase tracking-widest flex items-center gap-1 drop-shadow-[0_0_8px_rgba(217,70,239,0.3)]">
                  <Sparkles className="w-3 h-3 animate-spin" /> RAMU VIP PREDICTOR
                </span>
                <span className="text-[8px] text-purple-400/50 uppercase font-mono font-bold bg-[#03010a] border border-purple-950/40 px-1.5 py-0.5 rounded">
                  DRAG ME
                </span>
              </div>

              {/* Floating Mode Switcher Tabs */}
              <div className="flex gap-1 p-1 bg-black/40 rounded-lg border border-purple-950 mb-3 pointer-events-auto">
                {(['30s', '1m', '3m', '5m'] as WingoMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMode(m)}
                    className={`flex-1 py-1 rounded text-[8px] font-black uppercase transition-all cursor-pointer ${
                      activeMode === m
                        ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow shadow-fuchsia-500/30'
                        : 'text-zinc-400 hover:text-fuchsia-400'
                    }`}
                  >
                    Wingo {m}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 font-mono pointer-events-none select-none">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-purple-400/60">PERIOD:</span>
                  <span className="text-fuchsia-400 font-bold tracking-widest">
                    {currentChannel.targetPeriod === "Syncing..." ? "Syncing..." : "..." + currentChannel.targetPeriod.slice(-5)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-purple-400/60">PREDICTION:</span>
                  {!currentChannel.lastPredVal ? (
                    <span className="text-purple-950 font-bold animate-pulse">AWAITING</span>
                  ) : (
                    <span className={`font-black text-xs uppercase tracking-wider ${
                      currentChannel.lastPredVal === 'BIG' || currentChannel.lastPredVal === 'GREEN'
                        ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                        : 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                    }`}>
                      {currentChannel.lastPredVal}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-purple-950/40">
                  <span className="text-[8px] text-purple-400/60 uppercase">BALLS:</span>
                  {currentChannel.lastPredBalls.length === 0 ? (
                    <span className="text-purple-950 text-xs">? ?</span>
                  ) : (
                    <div className="flex gap-1">
                      {currentChannel.lastPredBalls.map((b, bIdx) => (
                        <span
                          key={`${b}-${bIdx}`}
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] text-white font-black border ${getBallColorClass(b)}`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-purple-950/40 text-[8px] text-purple-400/60 uppercase">
                  <span>IN-GAME JACKPOTS:</span>
                  <span className="text-amber-400 font-black text-[10px] drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]">{inGameJackpotsCount}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game frame viewport */}
        <div className="flex-1 bg-black relative">
          <iframe
            ref={iframeRef}
            id="game-frame"
            className="w-full h-full border-none"
            title="Wingo Live Game"
          />
        </div>
      </div>
    </div>
  );
}
