import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS, GRID_WIDTH, GRID_GAP, CELL_SIZE } from '../constants/theme';
import { ShapeDefinition, GhostPosition } from '../types';
import { useGameStore } from '../store/gameStore';
import { useHaptics } from '../hooks/useHaptics';
import { getClearText } from '../utils/scoreUtils';
import GridBoard from '../components/grid/GridBoard';
import BlockTray from '../components/tray/BlockTray';
import ClearEffect from '../components/effects/ClearEffect';
import ComboText from '../components/effects/ComboText';
import ScorePopup from '../components/effects/ScorePopup';
import AnimatedNumber from '../components/ui/AnimatedNumber';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── GameScreen ────────────────────────────────────────────────────────────────

interface Props {
  onPause: () => void;
  onGameOver: () => void;
}

export default function GameScreen({ onPause, onGameOver }: Props) {
  const { state, dispatch } = useGameStore();
  const haptics = useHaptics();

  const [gridOriginX, setGridOriginX] = useState(0);
  const [gridOriginY, setGridOriginY] = useState(0);
  const [gridW, setGridW] = useState(GRID_WIDTH);
  const [gridH, setGridH] = useState(GRID_WIDTH);

  const [ghostShape, setGhostShape] = useState<ShapeDefinition | null>(null);
  const [ghostPosition, setGhostPosition] = useState<GhostPosition | null>(null);
  const [ghostValid, setGhostValid] = useState(false);

  const [comboVisible, setComboVisible] = useState(false);
  const [comboText, setComboText] = useState('');
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [scorePopVisible, setScorePopVisible] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  const prevScore = useRef(state.score);
  const prevPhase = useRef(state.phase);
  const prevCombo = useRef(state.combo);
  const prevCleared = useRef(state.clearedThisTurn);

  // Combo indicator entrance animation
  const comboScale = useSharedValue(1);
  const comboOpacity = useSharedValue(0);

  // Header bar fade in
  const headerOpacity = useSharedValue(0);
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
  }, []);

  // Detect game over
  useEffect(() => {
    if (state.phase === 'gameover' && prevPhase.current !== 'gameover') {
      haptics.warning();
      const timer = setTimeout(onGameOver, 600);
      return () => clearTimeout(timer);
    }
    prevPhase.current = state.phase;
  }, [state.phase]);

  // Detect score change → show popup
  useEffect(() => {
    if (state.score > prevScore.current) {
      const earned = state.score - prevScore.current;
      setLastScore(earned);
      setScorePopVisible(false);
      setTimeout(() => setScorePopVisible(true), 50);
      prevScore.current = state.score;
    }
  }, [state.score]);

  // Detect line clears → show combo text
  useEffect(() => {
    const cleared = state.clearedThisTurn;
    const lineCount = cleared.rows.length + cleared.cols.length;

    if (lineCount > 0) {
      const text = getClearText(lineCount, state.combo > 0 ? state.combo - 1 : 0);
      setComboText(text);
      setComboVisible(false);
      setTimeout(() => setComboVisible(true), 50);

      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => setComboVisible(false), 1500);

      if (lineCount >= 2 || state.combo > 1) {
        haptics.success();
      } else {
        haptics.tapHeavy();
      }
    }
    prevCleared.current = cleared;
  }, [state.clearedThisTurn]);

  const handleLayout = useCallback(
    (x: number, y: number, w: number, h: number) => {
      setGridOriginX(x);
      setGridOriginY(y);
      setGridW(w);
      setGridH(h);
    },
    []
  );

  const handleGhostUpdate = useCallback(
    (
      shape: ShapeDefinition | null,
      position: GhostPosition | null,
      valid: boolean
    ) => {
      setGhostShape(shape);
      setGhostPosition(position);
      setGhostValid(valid);
    },
    []
  );

  const handlePlace = useCallback(
    (trayIndex: number, row: number, col: number) => {
      dispatch({ type: 'PLACE_SHAPE', trayIndex, row, col });
      haptics.tapMedium();
      setGhostShape(null);
      setGhostPosition(null);
    },
    [dispatch, haptics]
  );

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const lineCount =
    state.clearedThisTurn.rows.length + state.clearedThisTurn.cols.length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Bg glow */}
      <View style={styles.bgGlow} />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <AnimatedNumber value={state.score} style={styles.scoreValue} />
        </View>

        {/* Combo indicator */}
        {state.combo > 1 && (
          <View style={styles.comboBadge}>
            <Text style={styles.comboText}>🔥 ×{state.combo}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.pauseBtn} onPress={onPause} activeOpacity={0.7}>
          <Text style={styles.pauseIcon}>⏸</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Grid area */}
      <View style={styles.gridWrapper}>
        <GridBoard
          grid={state.grid}
          colorGrid={state.colorGrid}
          clearingRows={state.clearedThisTurn.rows}
          clearingCols={state.clearedThisTurn.cols}
          ghostShape={ghostShape}
          ghostPosition={ghostPosition}
          ghostValid={ghostValid}
          onLayout={handleLayout}
        />

        {/* Clear flash overlay */}
        <ClearEffect
          clearingRows={state.clearedThisTurn.rows}
          clearingCols={state.clearedThisTurn.cols}
          gridWidth={gridW}
          gridHeight={gridH}
        />

        {/* Combo text popup */}
        <View style={styles.comboTextWrapper} pointerEvents="none">
          <ComboText text={comboText} visible={comboVisible} />
        </View>

        {/* Score popup */}
        {scorePopVisible && lastScore > 0 && (
          <ScorePopup
            score={lastScore}
            x={gridW / 2 - 20}
            y={-30}
            visible={scorePopVisible}
          />
        )}
      </View>

      {/* Best score bar */}
      <View style={styles.bestRow}>
        <Text style={styles.bestLabel}>BEST</Text>
        <AnimatedNumber value={state.bestScore} style={styles.bestValue} />
      </View>

      {/* Block tray */}
      <View style={styles.trayWrapper}>
        <BlockTray
          tray={state.tray}
          grid={state.grid}
          gridOriginX={gridOriginX}
          gridOriginY={gridOriginY}
          onPlace={handlePlace}
          onGhostUpdate={handleGhostUpdate}
        />
      </View>

      {/* Coins indicator */}
      <View style={styles.coinsRow}>
        <Text style={styles.coinIcon}>🪙</Text>
        <AnimatedNumber value={state.coins} style={styles.coinsValue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  bgGlow: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(74,158,255,0.04)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.sm,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scoreLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  comboBadge: {
    backgroundColor: 'rgba(249,115,22,0.2)',
    borderWidth: 1,
    borderColor: COLORS.orange,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  comboText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.orange,
  },
  pauseBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  gridWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  comboTextWrapper: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  bestLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2,
  },
  bestValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.goldenrod,
  },
  trayWrapper: {
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: SPACING.lg,
  },
  coinIcon: {
    fontSize: 14,
  },
  coinsValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.goldenrod,
  },
});
