import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// ─── Animated Block ───────────────────────────────────────────────────────────

interface AnimBlockProps {
  color: string;
  delay: number;
  x: number;
}

function AnimBlock({ color, delay, x }: AnimBlockProps) {
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 14, stiffness: 180 })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 160 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.logoBlock,
        { backgroundColor: color, left: x },
        style,
      ]}
    >
      <View style={styles.blockShine} />
    </Animated.View>
  );
}

// ─── SplashScreen ─────────────────────────────────────────────────────────────

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  const BLOCK_COLORS_LOGO = [
    COLORS.cyan,
    COLORS.purple,
    COLORS.coral,
    COLORS.mint,
    COLORS.goldenrod,
    COLORS.pink,
    COLORS.blue,
    COLORS.orange,
  ];

  useEffect(() => {
    // Title appears after blocks land
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    titleY.value = withDelay(600, withTiming(0, { duration: 400 }));

    subtitleOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));

    // Progress bar fills over 2s
    progressWidth.value = withDelay(
      700,
      withTiming(width - SPACING.xl * 2, {
        duration: 1800,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Fade out and call onFinish
    const timer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 350 });
      setTimeout(onFinish, 380);
    }, 2900);

    return () => clearTimeout(timer);
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <StatusBar style="light" />

      {/* Radial glow background */}
      <View style={styles.glowBg} />
      <View style={styles.glowBg2} />

      {/* Animated blocks forming logo */}
      <View style={styles.blocksRow}>
        {BLOCK_COLORS_LOGO.map((color, i) => (
          <AnimBlock
            key={i}
            color={color}
            delay={i * 80}
            x={i * 38}
          />
        ))}
      </View>

      {/* Title */}
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.titleMain}>BlockCrate</Text>
        <Text style={styles.titleSub}>BLOCK PUZZLE</Text>
      </Animated.View>

      {/* Subtitle tagline */}
      <Animated.Text style={[styles.tagline, subtitleStyle]}>
        Place. Clear. Score.
      </Animated.Text>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>

      {/* Loading text */}
      <Animated.Text style={[styles.loadingText, subtitleStyle]}>
        Loading...
      </Animated.Text>
    </Animated.View>
  );
}

const BLOCK_SIZE = 34;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBg: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(74,158,255,0.06)',
    top: height * 0.25,
    alignSelf: 'center',
  },
  glowBg2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(139,92,246,0.05)',
    top: height * 0.3,
    alignSelf: 'center',
  },
  blocksRow: {
    height: BLOCK_SIZE + 8,
    width: 8 * 38,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
  },
  logoBlock: {
    position: 'absolute',
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
    borderRadius: RADIUS.xs + 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  blockShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderTopLeftRadius: RADIUS.xs + 1,
    borderTopRightRadius: RADIUS.xs + 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleMain: {
    fontSize: 48,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
    letterSpacing: 2,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  titleSub: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    letterSpacing: 8,
    marginTop: 2,
  },
  tagline: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: SPACING.xxl + SPACING.lg,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 60,
    left: SPACING.xl,
    right: SPACING.xl,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  loadingText: {
    position: 'absolute',
    bottom: 36,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
});
