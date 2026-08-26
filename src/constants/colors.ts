// ─── Design Tokens ────────────────────────────────────────────────────────────

export const COLORS = {
  // Backgrounds
  bg: '#0A0A1A',
  bgCard: '#12122A',
  bgModal: '#1A1A35',
  bgOverlay: 'rgba(0,0,0,0.75)',

  // Accents
  primary: '#4A9EFF',
  secondary: '#8B5CF6',
  tertiary: '#FF6B6B',
  gold: '#FFD700',

  // Grid
  cellEmpty: 'rgba(255,255,255,0.04)',
  cellBorder: 'rgba(255,255,255,0.08)',
  cellGhost: 'rgba(74,158,255,0.3)',
  cellInvalid: 'rgba(255,50,50,0.35)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.4)',

  // Block colors (8 distinct)
  cyan: '#00D4FF',
  purple: '#A855F7',
  coral: '#FF6B6B',
  mint: '#10B981',
  goldenrod: '#F59E0B',
  pink: '#EC4899',
  blue: '#3B82F6',
  orange: '#F97316',
} as const;

// Block color palette (used to assign colors to shapes)
export const BLOCK_COLORS: string[] = [
  COLORS.cyan,
  COLORS.purple,
  COLORS.coral,
  COLORS.mint,
  COLORS.goldenrod,
  COLORS.pink,
  COLORS.blue,
  COLORS.orange,
];

// Block color keys
export const BLOCK_COLOR_KEYS: string[] = [
  'cyan',
  'purple',
  'coral',
  'mint',
  'goldenrod',
  'pink',
  'blue',
  'orange',
];

// Glow shadow colors (lighter/more opaque versions for shadow)
export const BLOCK_GLOW: Record<string, string> = {
  cyan: 'rgba(0,212,255,0.6)',
  purple: 'rgba(168,85,247,0.6)',
  coral: 'rgba(255,107,107,0.6)',
  mint: 'rgba(16,185,129,0.6)',
  goldenrod: 'rgba(245,158,11,0.6)',
  pink: 'rgba(236,72,153,0.6)',
  blue: 'rgba(59,130,246,0.6)',
  orange: 'rgba(249,115,22,0.6)',
};

// Lighter tint for block top-shine
export const BLOCK_TINT: Record<string, string> = {
  cyan: 'rgba(255,255,255,0.25)',
  purple: 'rgba(255,255,255,0.2)',
  coral: 'rgba(255,255,255,0.2)',
  mint: 'rgba(255,255,255,0.2)',
  goldenrod: 'rgba(255,255,255,0.22)',
  pink: 'rgba(255,255,255,0.2)',
  blue: 'rgba(255,255,255,0.22)',
  orange: 'rgba(255,255,255,0.2)',
};
