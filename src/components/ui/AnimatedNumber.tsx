import React, { useEffect, useRef, useState } from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// ─── AnimatedNumber ───────────────────────────────────────────────────────────
// Counts up to a target value with a spring animation on the visual scale.

interface Props {
  value: number;
  style?: TextStyle;
  duration?: number;
}

export default function AnimatedNumber({ value, style, duration = 600 }: Props) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (value === prevRef.current) return;
    const start = prevRef.current;
    const end = value;
    prevRef.current = value;

    // Animate scale pop
    scale.value = withSequence(
      withTiming(1.25, { duration: 120 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );

    // Count up displayed value
    const steps = 20;
    const stepTime = duration / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(Math.round(start + (end - start) * eased));
      if (step >= steps) {
        clearInterval(interval);
        setDisplayed(end);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [value]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text style={[styles.base, style, animStyle]}>
      {displayed.toLocaleString()}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
