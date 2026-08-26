import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, BLOCK_GLOW, BLOCK_TINT } from '../../constants/colors';
import { CELL_SIZE, GRID_GAP, RADIUS } from '../../constants/theme';

// ─── GridCell ─────────────────────────────────────────────────────────────────

interface Props {
  filled: boolean;
  color: string | null;
  colorKey: string | null;
  isClearing: boolean;
  isGhost: boolean;
  isGhostValid: boolean;
}

export default function GridCell({
  filled,
  color,
  colorKey,
  isClearing,
  isGhost,
  isGhostValid,
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isClearing) {
      // Flash white, scale up slightly, then shrink away
      scale.value = withSequence(
        withTiming(1.15, { duration: 80 }),
        withTiming(0, { duration: 200 })
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 80 }),
        withTiming(0, { duration: 200 })
      );
    } else {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 120 });
    }
  }, [isClearing]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowColor = colorKey ? BLOCK_GLOW[colorKey] ?? 'transparent' : 'transparent';
  const tintColor = colorKey ? BLOCK_TINT[colorKey] ?? 'transparent' : 'transparent';

  let cellBg: string = COLORS.cellEmpty;
  let borderColor: string = COLORS.cellBorder;

  if (filled && color) {
    cellBg = color;
    borderColor = 'transparent';
  } else if (isGhost) {
    cellBg = isGhostValid ? COLORS.cellGhost : COLORS.cellInvalid;
    borderColor = isGhostValid ? COLORS.primary : COLORS.tertiary;
  }

  return (
    <Animated.View
      style={[
        styles.cell,
        animStyle,
        {
          backgroundColor: cellBg,
          borderColor,
          shadowColor: filled ? glowColor : 'transparent',
          shadowOpacity: filled ? 0.8 : 0,
        },
      ]}
    >
      {filled && color && (
        <>
          {/* Top shine effect */}
          <View
            style={[
              styles.shine,
              { backgroundColor: tintColor },
            ]}
          />
          {/* Inner glow overlay */}
          <View
            style={[
              styles.innerGlow,
              { borderColor: glowColor },
            ]}
          />
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    margin: GRID_GAP / 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 4,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderTopLeftRadius: RADIUS.xs,
    borderTopRightRadius: RADIUS.xs,
  },
  innerGlow: {
    position: 'absolute',
    inset: 1,
    borderRadius: RADIUS.xs - 1,
    borderWidth: 1,
    opacity: 0.5,
  },
});
