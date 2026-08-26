import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Grid ─────────────────────────────────────────────────────────────────────

export const GRID_SIZE = 8;
export const GRID_PADDING = 16;
export const GRID_GAP = 2;

// Compute cell size so the grid fills screen width minus padding
const gridTotalPadding = GRID_PADDING * 2;
const gridTotalGap = GRID_GAP * (GRID_SIZE - 1);
export const CELL_SIZE = Math.floor(
  (SCREEN_WIDTH - gridTotalPadding - gridTotalGap) / GRID_SIZE
);
export const GRID_WIDTH = CELL_SIZE * GRID_SIZE + GRID_GAP * (GRID_SIZE - 1);

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

// ─── Font Sizes ───────────────────────────────────────────────────────────────

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
  giant: 56,
} as const;

// ─── Font Weights ─────────────────────────────────────────────────────────────

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

// ─── Screen Dimensions ────────────────────────────────────────────────────────

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} as const;

// ─── Tray ─────────────────────────────────────────────────────────────────────

export const TRAY_CELL_SIZE = Math.floor(CELL_SIZE * 0.55);
export const TRAY_HEIGHT = 130;
