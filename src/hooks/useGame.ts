import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { canPlaceShape } from '../utils/gridUtils';
import { ShapeDefinition } from '../types';

// ─── Main Game Hook ───────────────────────────────────────────────────────────
// Convenience wrapper over the game store with typed action dispatchers.

export function useGame() {
  const { state, dispatch } = useGameStore();

  const placeShape = useCallback(
    (trayIndex: number, row: number, col: number) => {
      dispatch({ type: 'PLACE_SHAPE', trayIndex, row, col });
    },
    [dispatch]
  );

  const pause = useCallback(() => {
    dispatch({ type: 'SET_PAUSE', paused: true });
  }, [dispatch]);

  const resume = useCallback(() => {
    dispatch({ type: 'SET_PAUSE', paused: false });
  }, [dispatch]);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, [dispatch]);

  const updateSettings = useCallback(
    (settings: Partial<typeof state.settings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', settings });
    },
    [dispatch]
  );

  const claimDailyReward = useCallback(() => {
    dispatch({ type: 'CLAIM_DAILY_REWARD' });
  }, [dispatch]);

  const canPlace = useCallback(
    (shape: ShapeDefinition, row: number, col: number) =>
      canPlaceShape(state.grid, shape, row, col),
    [state.grid]
  );

  return {
    state,
    placeShape,
    pause,
    resume,
    restart,
    updateSettings,
    claimDailyReward,
    canPlace,
  };
}
