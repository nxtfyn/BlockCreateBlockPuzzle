import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import PremiumButton from '../components/ui/PremiumButton';
import { coinsFromScore } from '../utils/scoreUtils';

const { width } = Dimensions.get('window');

// ─── GameOverScreen ────────────────────────────────────────────────────────────

interface Props {
  onRestart: () => void;
  onHome: () => void;
}

export default function GameOverScreen({ onRestart, onHome }: Props) {
  const { state, dispatch } = useGameStore();
  const isNewRecord = state.score >= state.bestScore && state.score > 0;
  const coinsEarned = coinsFromScore(state.score);

  function handleRestart() {
    dispatch({ type: 'RESTART' });
    onRestart();
  }

  const overlayOpacity = useSharedValue(0);
  const cardY = useSharedValue(80);
  const cardOpacity = useSharedValue(0);
  const titleShake = useSharedValue(0);
  const recordScale = useSharedValue(0);
  const starRotate = useSharedValue(0);

  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 300 });
    cardY.value = withDelay(150, withSpring(0, { damping: 16, stiffness: 180 }));
    cardOpacity.value = withDelay(150, withTiming(1, { duration: 300 }));

    // Title shake
    titleShake.value = withDelay(
      400,
      withSequence(
        withTiming(-8, { duration: 70 }),
        withTiming(8, { duration: 70 }),
        withTiming(-6, { duration: 70 }),
        withTiming(6, { duration: 70 }),
        withTiming(0, { duration: 60 })
      )
    );

    if (isNewRecord) {
      recordScale.value = withDelay(800, withSpring(1, { damping: 10, stiffness: 160 }));
      starRotate.value = withDelay(
        800,
        withRepeat(
          withSequence(
            withTiming(15, { duration: 400 }),
            withTiming(-15, { duration: 400 })
          ),
          3,
          true
        )
      );
    }
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: titleShake.value }],
  }));

  const recordStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordScale.value }],
  }));

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${starRotate.value}deg` }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <StatusBar style="light" />

      <Animated.View style={[styles.overlay, overlayStyle]} />

      <View style={styles.centeredContainer}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Game Over Title */}
          <Animated.View style={titleStyle}>
            <Text style={styles.gameOverTitle}>GAME OVER</Text>
          </Animated.View>

          {/* New Record Badge */}
          {isNewRecord && (
            <Animated.View style={[styles.recordBadge, recordStyle]}>
              <Animated.Text style={[styles.recordStar, starStyle]}>⭐</Animated.Text>
              <Text style={styles.recordText}>NEW RECORD!</Text>
              <Animated.Text style={[styles.recordStar, starStyle]}>⭐</Animated.Text>
            </Animated.View>
          )}

          {/* Score section */}
          <View style={styles.scoresSection}>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreBlockLabel}>SCORE</Text>
              <AnimatedNumber
                value={state.score}
                style={styles.finalScore}
                duration={1200}
              />
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreBlockLabel}>BEST</Text>
              <AnimatedNumber
                value={state.bestScore}
                style={styles.bestScore}
              />
            </View>
          </View>

          {/* Coins earned */}
          <View style={styles.coinsEarned}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.coinsLabel}>
              +{coinsEarned} coins earned
            </Text>
          </View>

          {/* Revive CTA */}
          <TouchableOpacity style={styles.reviveBtn} activeOpacity={0.8}>
            <View style={styles.reviveBtnInner}>
              <Text style={styles.reviveIcon}>📺</Text>
              <View>
                <Text style={styles.reviveTitle}>Watch Ad to Revive</Text>
                <Text style={styles.reviveSub}>Continue from where you left off</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Action buttons */}
          <PremiumButton
            label="Play Again"
            onPress={handleRestart}
            variant="primary"
            style={styles.btn}
          />
          <PremiumButton
            label="Home"
            onPress={onHome}
            variant="ghost"
            style={styles.btn}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  centeredContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.bgModal,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  gameOverTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.tertiary,
    letterSpacing: 4,
    textShadowColor: COLORS.tertiary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: SPACING.md,
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  recordStar: {
    fontSize: 18,
  },
  recordText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  scoresSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    width: '100%',
    marginBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  scoreBlock: {
    alignItems: 'center',
    flex: 1,
  },
  scoreBlockLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  finalScore: {
    fontSize: 42,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
  },
  bestScore: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.goldenrod,
  },
  scoreDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  coinsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    backgroundColor: 'rgba(255,215,0,0.08)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  coinIcon: {
    fontSize: 16,
  },
  coinsLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.semibold,
  },
  reviveBtn: {
    width: '100%',
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth: 1.5,
    borderColor: COLORS.mint,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  reviveBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  reviveIcon: {
    fontSize: 30,
  },
  reviveTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.mint,
  },
  reviveSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  btn: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
});
