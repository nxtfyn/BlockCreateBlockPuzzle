import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/theme';

// ─── ComboText ────────────────────────────────────────────────────────────────
// Slides up and fades out when a combo or clear happens.

interface Props {
  text: string;
  visible: boolean;
  onDone?: () => void;
}

export default function ComboText({ text, visible, onDone }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 150 }),
        withDelay(800, withTiming(0, { duration: 350 }))
      );
      translateY.value = withSequence(
        withTiming(0, { duration: 150 }),
        withDelay(800, withTiming(-30, { duration: 350 }))
      );
    } else {
      opacity.value = 0;
      translateY.value = 20;
    }
  }, [visible, text]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animStyle]} pointerEvents="none">
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: 'rgba(139,92,246,0.85)',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
  },
  text: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
