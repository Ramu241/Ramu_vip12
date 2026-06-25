/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WingoMode = '30s' | '1m';

export type PredictionType = 'BS' | 'COLOR';

export type PredictionValue = 'BIG' | 'SMALL' | 'GREEN' | 'RED';

export interface HistoryRecord {
  period: string;
  pred: string;
  balls: number[];
  opened: number;
  actualBS: 'BIG' | 'SMALL';
  actualColor: 'GREEN' | 'RED';
  status: 'WIN' | 'LOSS' | 'JACKPOT';
  timestamp: string;
}

export interface JackpotRecord {
  period: string;
  predictedBalls: number[];
  actualBall: number;
  timestamp: string;
  mode: WingoMode;
}

export interface ChannelState {
  targetPeriod: string;
  lastVerifiedIssue: string;
  lastPredType: PredictionType;
  lastPredVal: PredictionValue | null;
  lastPredPeriod: string;
  lastPredBalls: number[];
  serverHistory: number[];
  historyArray: HistoryRecord[];
  wins: number;
  loss: number;
  lossStreak: number;
  confidence: string;
  jackpots: number;
}
