import { ShapeDefinition } from '../types';
import { ALL_SHAPES, SHAPE_WEIGHTS } from '../constants/shapes';
import { BLOCK_COLORS, BLOCK_COLOR_KEYS } from '../constants/colors';

// ─── Weighted Random Shape Selection ─────────────────────────────────────────

function weightedRandom(): number {
  const totalWeight = SHAPE_WEIGHTS.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < SHAPE_WEIGHTS.length; i++) {
    rand -= SHAPE_WEIGHTS[i];
    if (rand <= 0) return i;
  }
  return SHAPE_WEIGHTS.length - 1;
}

/** Returns a random shape with a random color assigned. */
export function getRandomShape(): ShapeDefinition {
  const idx = weightedRandom();
  const base = ALL_SHAPES[idx];
  // Assign a random color each time for variety
  const colorIdx = Math.floor(Math.random() * BLOCK_COLORS.length);
  return {
    ...base,
    color: BLOCK_COLORS[colorIdx],
    colorKey: BLOCK_COLOR_KEYS[colorIdx],
  };
}

/**
 * Returns an array of 3 random shapes for the tray.
 * Ensures no two shapes have the same id to maximize variety.
 */
export function generateTray(): ShapeDefinition[] {
  const tray: ShapeDefinition[] = [];
  const usedIds = new Set<string>();

  while (tray.length < 3) {
    const shape = getRandomShape();
    if (!usedIds.has(shape.id)) {
      usedIds.add(shape.id);
      tray.push(shape);
    }
  }

  return tray;
}
