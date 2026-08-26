import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { CELL_SIZE, GRID_GAP, GRID_SIZE, RADIUS } from '../../constants/theme';

// ─── ClearEffect ──────────────────────────────────────────────────────────────
// Renders a flash overlay on cleared rows and columns.

interface Props {
  clearingRows: number[];
  clearingCols: number[];
  gridWidth: number;
  gridHeight: number;
}

function FlashRow({ rowIndex, width }: { rowIndex: number; width: number }) {
  const opacity = useSharedValue(0);
  const scaleX = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0.85, { duration: 60 }),
      withDelay(80, withTiming(0, { duration: 200 }))
    );
    scaleX.value = withSequence(
      withTiming(1, { duration: 60 }),
      withDelay(80, withTiming(0.5, { duration: 200 }))
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleX: scaleX.value }],
  }));

  const top =
    rowIndex * (CELL_SIZE + GRID_GAP) + GRID_GAP / 2;

  return (
    <Animated.View
      style={[
        styles.flashRow,
        { top, width, height: CELL_SIZE },
        style,
      ]}
      pointerEvents="none"
    />
  );
}

function FlashCol({ colIndex, height }: { colIndex: number; height: number }) {
  const opacity = useSharedValue(0);
  const scaleY = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0.85, { duration: 60 }),
      withDelay(80, withTiming(0, { duration: 200 }))
    );
    scaleY.value = withSequence(
      withTiming(1, { duration: 60 }),
      withDelay(80, withTiming(0.5, { duration: 200 }))
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleY: scaleY.value }],
  }));

  const left =
    colIndex * (CELL_SIZE + GRID_GAP) + GRID_GAP / 2;

  return (
    <Animated.View
      style={[
        styles.flashCol,
        { left, height, width: CELL_SIZE },
        style,
      ]}
      pointerEvents="none"
    />
  );
}

export default function ClearEffect({
  clearingRows,
  clearingCols,
  gridWidth,
  gridHeight,
}: Props) {
  if (clearingRows.length === 0 && clearingCols.length === 0) return null;

  return (
    <View
      style={[styles.overlay, { width: gridWidth, height: gridHeight }]}
      pointerEvents="none"
    >
      {clearingRows.map(r => (
        <FlashRow key={`row_${r}`} rowIndex={r} width={gridWidth} />
      ))}
      {clearingCols.map(c => (
        <FlashCol key={`col_${c}`} colIndex={c} height={gridHeight} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
  flashRow: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xs,
  },
  flashCol: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xs,
  },
});
