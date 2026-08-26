import { ShapeDefinition } from '../types';
import { BLOCK_COLORS, BLOCK_COLOR_KEYS } from './colors';

// Helper to pick a color based on index
const c = (idx: number) => BLOCK_COLORS[idx % BLOCK_COLORS.length];
const ck = (idx: number) => BLOCK_COLOR_KEYS[idx % BLOCK_COLOR_KEYS.length];

// ─── All 20 Shape Definitions ─────────────────────────────────────────────────

export const ALL_SHAPES: ShapeDefinition[] = [
  // 0: Single 1×1
  {
    id: 'single',
    cells: [[true]],
    color: c(0),
    colorKey: ck(0),
  },

  // 1: Domino Horizontal 1×2
  {
    id: 'domino_h',
    cells: [[true, true]],
    color: c(1),
    colorKey: ck(1),
  },

  // 2: Domino Vertical 2×1
  {
    id: 'domino_v',
    cells: [[true], [true]],
    color: c(2),
    colorKey: ck(2),
  },

  // 3: Tromino L (3-cell L shape, corner bottom-left)
  {
    id: 'l3',
    cells: [
      [true, false],
      [true, true],
    ],
    color: c(3),
    colorKey: ck(3),
  },

  // 4: Tromino corner (corner top-right)
  {
    id: 'corner',
    cells: [
      [false, true],
      [true, true],
    ],
    color: c(4),
    colorKey: ck(4),
  },

  // 5: 2×2 Square
  {
    id: 'square',
    cells: [
      [true, true],
      [true, true],
    ],
    color: c(5),
    colorKey: ck(5),
  },

  // 6: 3×1 Line Horizontal
  {
    id: 'line3_h',
    cells: [[true, true, true]],
    color: c(6),
    colorKey: ck(6),
  },

  // 7: 3×1 Line Vertical
  {
    id: 'line3_v',
    cells: [[true], [true], [true]],
    color: c(7),
    colorKey: ck(7),
  },

  // 8: L-shape (4 cells) — L going right
  {
    id: 'l_right',
    cells: [
      [true, false],
      [true, false],
      [true, true],
    ],
    color: c(0),
    colorKey: ck(0),
  },

  // 9: L-shape — L going left (J)
  {
    id: 'j_left',
    cells: [
      [false, true],
      [false, true],
      [true, true],
    ],
    color: c(1),
    colorKey: ck(1),
  },

  // 10: L-shape rotated — L lying flat
  {
    id: 'l_flat',
    cells: [
      [true, true, true],
      [true, false, false],
    ],
    color: c(2),
    colorKey: ck(2),
  },

  // 11: J-shape rotated — J lying flat
  {
    id: 'j_flat',
    cells: [
      [true, true, true],
      [false, false, true],
    ],
    color: c(3),
    colorKey: ck(3),
  },

  // 12: T-shape pointing down
  {
    id: 't_down',
    cells: [
      [true, true, true],
      [false, true, false],
    ],
    color: c(4),
    colorKey: ck(4),
  },

  // 13: T-shape pointing up
  {
    id: 't_up',
    cells: [
      [false, true, false],
      [true, true, true],
    ],
    color: c(5),
    colorKey: ck(5),
  },

  // 14: T-shape pointing right
  {
    id: 't_right',
    cells: [
      [true, false],
      [true, true],
      [true, false],
    ],
    color: c(6),
    colorKey: ck(6),
  },

  // 15: S-shape
  {
    id: 's_shape',
    cells: [
      [false, true, true],
      [true, true, false],
    ],
    color: c(7),
    colorKey: ck(7),
  },

  // 16: Z-shape
  {
    id: 'z_shape',
    cells: [
      [true, true, false],
      [false, true, true],
    ],
    color: c(0),
    colorKey: ck(0),
  },

  // 17: Plus shape
  {
    id: 'plus',
    cells: [
      [false, true, false],
      [true, true, true],
      [false, true, false],
    ],
    color: c(1),
    colorKey: ck(1),
  },

  // 18: 4×1 Line Horizontal
  {
    id: 'line4_h',
    cells: [[true, true, true, true]],
    color: c(2),
    colorKey: ck(2),
  },

  // 19: 4×1 Line Vertical
  {
    id: 'line4_v',
    cells: [[true], [true], [true], [true]],
    color: c(3),
    colorKey: ck(3),
  },
];

// Weights — larger shapes are rarer
// Index corresponds to ALL_SHAPES index
export const SHAPE_WEIGHTS: number[] = [
  3,  // single
  4,  // domino_h
  4,  // domino_v
  5,  // l3
  5,  // corner
  5,  // square
  5,  // line3_h
  5,  // line3_v
  4,  // l_right
  4,  // j_left
  4,  // l_flat
  4,  // j_flat
  4,  // t_down
  4,  // t_up
  4,  // t_right
  3,  // s_shape
  3,  // z_shape
  2,  // plus
  2,  // line4_h
  2,  // line4_v
];
