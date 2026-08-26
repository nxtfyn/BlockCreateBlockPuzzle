import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { GameState, GameAction, Settings } from '../types';
import {
  createEmptyGrid,
  createEmptyColorGrid,
  canPlaceShape,
  placeShape,
  placeShapeColor,
  findFullRows,
  findFullCols,
  clearLines,
  clearLinesColor,
  checkGameOver,
  countCells,
} from '../utils/gridUtils';
import { generateTray } from '../utils/shapeUtils';
import { calculateScore, coinsFromScore, todayString } from '../utils/scoreUtils';
import {
  loadBestScore,
  saveBestScore,
  loadCoins,
  saveCoins,
  loadSettings,
  saveSettings,
  loadDailyReward,
  saveDailyReward,
} from '../utils/storage';

// ─── Initial State ────────────────────────────────────────────────────────────

function buildInitialState(): GameState {
  return {
    grid: createEmptyGrid(),
    colorGrid: createEmptyColorGrid(),
    tray: generateTray(),
    score: 0,
    combo: 0,
    bestScore: 0,
    coins: 0,
    phase: 'playing',
    clearedThisTurn: { rows: [], cols: [] },
    settings: { sound: true, music: true, vibration: true },
    dailyReward: { lastClaim: null, streak: 0 },
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_SHAPE': {
      const { trayIndex, row, col } = action;
      const shape = state.tray[trayIndex];
      if (!shape) return state;
      if (!canPlaceShape(state.grid, shape, row, col)) return state;

      const newGrid = placeShape(state.grid, shape, row, col);
      const newColorGrid = placeShapeColor(state.colorGrid, shape, row, col);
      const newTray = state.tray.map((s, i) =>
        i === trayIndex ? null : s
      ) as typeof state.tray;

      // Find and clear full lines
      const fullRows = findFullRows(newGrid);
      const fullCols = findFullCols(newGrid);
      const lineCount = fullRows.length + fullCols.length;

      const clearedGrid = lineCount > 0
        ? clearLines(newGrid, fullRows, fullCols)
        : newGrid;
      const clearedColorGrid = lineCount > 0
        ? clearLinesColor(newColorGrid, fullRows, fullCols)
        : newColorGrid;

      // Scoring
      const cells = countCells(shape);
      const newCombo = lineCount > 0 ? state.combo + 1 : 0;
      const earned = calculateScore(cells, lineCount, lineCount > 0 ? state.combo : 0);
      const newScore = state.score + earned;
      const newBest = Math.max(state.bestScore, newScore);

      // Coins
      const newCoins = state.coins + coinsFromScore(earned);

      // Check if all tray pieces used → refill
      const allUsed = newTray.every(s => s === null);
      const finalTray = allUsed ? generateTray() : newTray;

      // Game over check — only if no refill needed
      const isGameOver = !allUsed && checkGameOver(clearedGrid, finalTray.filter(Boolean) as typeof state.tray);

      return {
        ...state,
        grid: clearedGrid,
        colorGrid: clearedColorGrid,
        tray: finalTray,
        score: newScore,
        bestScore: newBest,
        combo: newCombo,
        coins: newCoins,
        phase: isGameOver ? 'gameover' : 'playing',
        clearedThisTurn: { rows: fullRows, cols: fullCols },
      };
    }

    case 'NEW_TRAY': {
      const newTray = generateTray();
      const isGameOver = checkGameOver(state.grid, newTray);
      return {
        ...state,
        tray: newTray,
        phase: isGameOver ? 'gameover' : 'playing',
      };
    }

    case 'CLEAR_LINES': {
      const { rows, cols } = action;
      const clearedGrid = clearLines(state.grid, rows, cols);
      const clearedColorGrid = clearLinesColor(state.colorGrid, rows, cols);
      return {
        ...state,
        grid: clearedGrid,
        colorGrid: clearedColorGrid,
        clearedThisTurn: { rows, cols },
      };
    }

    case 'SET_PAUSE': {
      return {
        ...state,
        phase: action.paused ? 'paused' : 'playing',
      };
    }

    case 'GAME_OVER': {
      return { ...state, phase: 'gameover' };
    }

    case 'RESTART': {
      return {
        ...buildInitialState(),
        bestScore: state.bestScore,
        coins: state.coins,
        settings: state.settings,
        dailyReward: state.dailyReward,
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
    }

    case 'CLAIM_DAILY_REWARD': {
      const today = todayString();
      const newStreak = state.dailyReward.lastClaim
        ? state.dailyReward.streak + 1
        : 1;
      return {
        ...state,
        dailyReward: { lastClaim: today, streak: newStreak },
      };
    }

    case 'RESTORE_DAILY_REWARD': {
      return {
        ...state,
        dailyReward: action.dailyReward,
      };
    }

    case 'UPDATE_BEST_SCORE': {
      return {
        ...state,
        bestScore: Math.max(state.bestScore, action.score),
      };
    }

    case 'ADD_COINS': {
      return {
        ...state,
        coins: state.coins + action.amount,
      };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, buildInitialState);

  // Load persisted data on mount
  useEffect(() => {
    async function loadPersisted() {
      const [bestScore, coins, settings, dailyReward] = await Promise.all([
        loadBestScore(),
        loadCoins(),
        loadSettings(),
        loadDailyReward(),
      ]);
      if (bestScore > 0) {
        dispatch({ type: 'UPDATE_BEST_SCORE', score: bestScore });
      }
      if (coins > 0) {
        dispatch({ type: 'ADD_COINS', amount: coins });
      }
      dispatch({ type: 'UPDATE_SETTINGS', settings });
      // Restore daily reward state without claiming
      if (dailyReward.lastClaim || dailyReward.streak > 0) {
        dispatch({ type: 'RESTORE_DAILY_REWARD', dailyReward });
      }
    }
    loadPersisted();
  }, []);

  // Persist best score whenever it changes
  useEffect(() => {
    saveBestScore(state.bestScore);
  }, [state.bestScore]);

  // Persist coins whenever they change
  useEffect(() => {
    saveCoins(state.coins);
  }, [state.coins]);

  // Persist settings whenever they change
  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  // Persist daily reward whenever it changes
  useEffect(() => {
    saveDailyReward(state.dailyReward);
  }, [state.dailyReward]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameStore(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGameStore must be used inside GameProvider');
  }
  return ctx;
}
