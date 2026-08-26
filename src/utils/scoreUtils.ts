import { ClearText } from '../types';

// ─── Score Calculation ────────────────────────────────────────────────────────

/**
 * Calculates score for placing a shape and clearing lines.
 *
 * @param cellsPlaced   number of cells in the placed shape
 * @param lineCount     total number of rows + cols cleared
 * @param combo         current combo streak (0-based: 0 means no prior clear streak)
 */
export function calculateScore(
  cellsPlaced: number,
  lineCount: number,
  combo: number
): number {
  // Base: 1 point per cell placed
  let score = cellsPlaced;

  // Line clear bonus: exponential (10 * n^2)
  if (lineCount > 0) {
    score += 10 * lineCount * lineCount;
  }

  // Combo multiplier: multiply everything by (1 + 0.5 * combo)
  const multiplier = 1 + 0.5 * combo;
  score = Math.round(score * multiplier);

  return score;
}

/**
 * Returns the text label for a clear event.
 */
export function getClearText(lineCount: number, combo: number): string {
  if (combo > 0) {
    return `Combo ×${combo + 1}`;
  }
  if (lineCount >= 4) return 'Incredible!';
  if (lineCount >= 3) return 'Amazing!';
  if (lineCount >= 2) return 'Great!';
  return 'Good!';
}

/**
 * Coins earned per game = floor(score / 100)
 */
export function coinsFromScore(score: number): number {
  return Math.floor(score / 100);
}

/**
 * Daily reward coin amounts per day (1-indexed, day 1 = index 0)
 */
export const DAILY_REWARDS: number[] = [10, 20, 30, 50, 75, 100, 200];

/**
 * Returns today's date string (YYYY-MM-DD) for daily reward comparison.
 */
export function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Returns true if the daily reward has NOT been claimed today.
 */
export function canClaimDailyReward(lastClaim: string | null): boolean {
  if (!lastClaim) return true;
  return lastClaim !== todayString();
}
