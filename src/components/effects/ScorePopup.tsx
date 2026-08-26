import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/theme';

// ─── ScorePopup ───────────────────────────────────────────────────────────────

interface Props {
  score: number;
  x: number;
  y: number;
  visible: boolean;
}

export default function ScorePopup({ score, x, y, visible }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible && score > 0) {
      opacity.value = withSequence(
        withTiming(1, { duration: 120 }),
        withDelay(500, withTiming(0, { duration: 300 }))
      );
      translateY.value = withSequence(
        withTiming(-40, { duration: 600 }),
        withDelay(200, withTiming(-70, { duration: 300 }))
      );
    } else {
      opacity.value = 0;
      translateY.value = 0;
    }
  }, [visible, score]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, { left: x, top: y }, animStyle]}
      pointerEvents="none"
    >
      <Text style={styles.text}>+{score}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 200,
  },
  text: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.black,
    textShadowColor: 'rgba(255,215,0,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
