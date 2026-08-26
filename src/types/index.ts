// ─── Core Types ──────────────────────────────────────────────────────────────

export interface ShapeDefinition {
  id: string;
  cells: boolean[][];
  color: string;
  colorKey: string;
}

export type ColorGrid = (string | null)[][];
export type BoolGrid = boolean[][];

export interface GhostPosition {
  row: number;
  col: number;
}

// ─── Game State ───────────────────────────────────────────────────────────────

export type GamePhase = 'playing' | 'paused' | 'gameover';

export interface Settings {
  sound: boolean;
  music: boolean;
  vibration: boolean;
}

export interface DailyReward {
  lastClaim: string | null;
  streak: number;
}

export interface ClearedThisTurn {
  rows: number[];
  cols: number[];
}

export interface GameState {
  grid: BoolGrid;
  colorGrid: ColorGrid;
  tray: ShapeDefinition[];
  score: number;
  combo: number;
  bestScore: number;
  coins: number;
  phase: GamePhase;
  clearedThisTurn: ClearedThisTurn;
  settings: Settings;
  dailyReward: DailyReward;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type GameAction =
  | { type: 'PLACE_SHAPE'; trayIndex: number; row: number; col: number }
  | { type: 'NEW_TRAY' }
  | { type: 'CLEAR_LINES'; rows: number[]; cols: number[] }
  | { type: 'SET_PAUSE'; paused: boolean }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
  | { type: 'CLAIM_DAILY_REWARD' }
  | { type: 'RESTORE_DAILY_REWARD'; dailyReward: DailyReward }
  | { type: 'UPDATE_BEST_SCORE'; score: number }
  | { type: 'ADD_COINS'; amount: number };

// ─── Navigation ───────────────────────────────────────────────────────────────

export type Screen =
  | 'splash'
  | 'home'
  | 'game'
  | 'pause'
  | 'gameover'
  | 'settings'
  | 'shop'
  | 'daily_reward';

export interface NavigationProps {
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

// ─── Score Pop ───────────────────────────────────────────────────────────────

export type ClearText = 'Good!' | 'Great!' | 'Amazing!' | 'Incredible!';

export interface ScorePopupData {
  id: string;
  text: string;
  x: number;
  y: number;
}
