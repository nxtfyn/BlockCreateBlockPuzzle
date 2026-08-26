import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { canClaimDailyReward } from '../utils/scoreUtils';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import PremiumButton from '../components/ui/PremiumButton';

const { width, height } = Dimensions.get('window');

// ─── Decorative Block ─────────────────────────────────────────────────────────
interface DecorBlockProps {
  color: string;
  size: number;
  x: number;
  y: number;
  delay: number;
}

function DecorBlock({ color, size, x, y, delay }: DecorBlockProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.15, { duration: 600 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.decorBlock,
        { width: size, height: size, backgroundColor: color, left: x, top: y },
        style,
      ]}
    />
  );
}

// ─── Icon Button ──────────────────────────────────────────────────────────────
interface IconBtnProps {
  emoji: string;
  label: string;
  onPress: () => void;
  badge?: boolean;
  color?: string;
}

function IconBtn({ emoji, label, onPress, badge = false, color = COLORS.primary }: IconBtnProps) {
  const badgePulse = useSharedValue(1);

  useEffect(() => {
    if (badge) {
      badgePulse.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    }
  }, [badge]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePulse.value }],
  }));

  return (
    <TouchableOpacity style={styles.iconBtn} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBtnInner, { borderColor: color }]}>
        <Text style={styles.iconBtnEmoji}>{emoji}</Text>
        {badge && (
          <Animated.View style={[styles.badgeDot, { backgroundColor: COLORS.tertiary }, badgeStyle]} />
        )}
      </View>
      <Text style={styles.iconBtnLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
interface Props {
  onPlay: () => void;
  onSettings: () => void;
  onShop: () => void;
  onDailyReward: () => void;
}

export default function HomeScreen({ onPlay, onSettings, onShop, onDailyReward }: Props) {
  const { state } = useGameStore();
  const hasReward = canClaimDailyReward(state.dailyReward.lastClaim);

  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(30);
  const playBtnScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    logoOpacity.value = withTiming(1, { duration: 500 });
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    contentY.value = withDelay(300, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));

    // Subtle play button pulse
    playBtnScale.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1.03, { duration: 1200 }),
          withTiming(1, { duration: 1200 })
        ),
        -1,
        true
      )
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const playBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playBtnScale.value }],
  }));

  const DECOR = [
    { color: COLORS.cyan, size: 60, x: -20, y: height * 0.08, delay: 200 },
    { color: COLORS.purple, size: 40, x: width - 50, y: height * 0.12, delay: 350 },
    { color: COLORS.coral, size: 50, x: width - 30, y: height * 0.45, delay: 500 },
    { color: COLORS.mint, size: 35, x: -10, y: height * 0.55, delay: 400 },
    { color: COLORS.goldenrod, size: 45, x: width * 0.8, y: height * 0.7, delay: 600 },
    { color: COLORS.blue, size: 30, x: 20, y: height * 0.75, delay: 700 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Decorative background blocks */}
      {DECOR.map((d, i) => (
        <DecorBlock key={i} {...d} />
      ))}

      {/* Top glow */}
      <View style={styles.topGlow} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Logo / Title */}
        <Animated.View style={[styles.logoSection, logoStyle]}>
          <View style={styles.logoBlockRow}>
            {[COLORS.cyan, COLORS.purple, COLORS.coral, COLORS.mint].map((c, i) => (
              <View key={i} style={[styles.logoSmallBlock, { backgroundColor: c }]}>
                <View style={styles.blockShine} />
              </View>
            ))}
          </View>
          <Text style={styles.gameTitle}>BlockCrate</Text>
          <Text style={styles.gameSubtitle}>BLOCK PUZZLE</Text>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          {/* Score card */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>BEST SCORE</Text>
              <View style={styles.scoreValueRow}>
                <Text style={styles.scoreStar}>⭐</Text>
                <AnimatedNumber value={state.bestScore} style={styles.scoreValue} />
              </View>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>COINS</Text>
              <View style={styles.scoreValueRow}>
                <Text style={styles.scoreStar}>🪙</Text>
                <AnimatedNumber value={state.coins} style={styles.scoreValue} />
              </View>
            </View>
          </View>

          {/* Play button */}
          <Animated.View style={[styles.playBtnWrapper, playBtnStyle]}>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={onPlay}
              activeOpacity={0.85}
            >
              <View style={styles.playBtnInner}>
                <Text style={styles.playBtnIcon}>▶</Text>
                <Text style={styles.playBtnText}>PLAY</Text>
              </View>
              <View style={styles.playBtnGlow} />
            </TouchableOpacity>
          </Animated.View>

          {/* Icon buttons row */}
          <View style={styles.iconRow}>
            <IconBtn emoji="⚙️" label="Settings" onPress={onSettings} />
            <IconBtn emoji="🛍️" label="Shop" onPress={onShop} color={COLORS.goldenrod} />
            <IconBtn
              emoji="🎁"
              label="Daily"
              onPress={onDailyReward}
              badge={hasReward}
              color={COLORS.tertiary}
            />
          </View>

          {/* Streak info */}
          {state.dailyReward.streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>
                🔥 {state.dailyReward.streak} day streak!
              </Text>
            </View>
          )}

          <Text style={styles.versionText}>BlockCrate v1.0 · com.nextfyn.blockcrate</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  topGlow: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(74,158,255,0.07)',
  },
  decorBlock: {
    position: 'absolute',
    borderRadius: RADIUS.sm,
    transform: [{ rotate: '15deg' }],
  },
  scroll: {
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBlockRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: 6,
  },
  logoSmallBlock: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
  },
  blockShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderTopLeftRadius: RADIUS.xs,
    borderTopRightRadius: RADIUS.xs,
  },
  gameTitle: {
    fontSize: 46,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
    letterSpacing: 2,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  gameSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    letterSpacing: 7,
    marginTop: 2,
  },
  content: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreStar: {
    fontSize: 16,
  },
  scoreValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  playBtnWrapper: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  playBtn: {
    backgroundColor: 'rgba(74,158,255,0.15)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg + 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  playBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    zIndex: 2,
  },
  playBtnIcon: {
    fontSize: 22,
    color: COLORS.primary,
  },
  playBtnText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.primary,
    letterSpacing: 6,
  },
  playBtnGlow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(74,158,255,0.06)',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: SPACING.lg,
  },
  iconBtn: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconBtnInner: {
    width: 62,
    height: 62,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBtnEmoji: {
    fontSize: 28,
  },
  iconBtnLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.5,
  },
  badgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  streakBadge: {
    backgroundColor: 'rgba(249,115,22,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.4)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  streakText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.orange,
    fontWeight: FONT_WEIGHT.semibold,
  },
  versionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    opacity: 0.5,
    marginTop: SPACING.md,
  },
});
