import React, { useEffect } from 'react';
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
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { DAILY_REWARDS, canClaimDailyReward } from '../utils/scoreUtils';
import PremiumButton from '../components/ui/PremiumButton';

const { width } = Dimensions.get('window');

// ─── DailyRewardScreen ────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

interface DayTileProps {
  day: number;
  coins: number;
  isClaimed: boolean;
  isToday: boolean;
  delay: number;
}

function DayTile({ day, coins, isClaimed, isToday, delay }: DayTileProps) {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 160 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dayTile,
        isClaimed && styles.dayTileClaimed,
        isToday && styles.dayTileToday,
        style,
      ]}
    >
      {isToday && !isClaimed && (
        <View style={styles.todayGlow} />
      )}
      <Text style={[styles.dayNumber, isClaimed && styles.dayNumberClaimed]}>
        {isClaimed ? '✓' : `DAY`}
      </Text>
      {!isClaimed && (
        <Text style={[styles.dayNum2, isToday && styles.dayNum2Today]}>
          {day}
        </Text>
      )}
      <Text style={styles.dayCoinIcon}>🪙</Text>
      <Text style={[styles.dayCoinAmt, isToday && styles.dayCoinAmtToday]}>
        {coins}
      </Text>
    </Animated.View>
  );
}

export default function DailyRewardScreen({ onClose }: Props) {
  const { state, dispatch } = useGameStore();
  const canClaim = canClaimDailyReward(state.dailyReward.lastClaim);
  const currentStreak = state.dailyReward.streak;
  const todayDay = (currentStreak % 7) + 1;

  const overlayOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);
  const claimBtnScale = useSharedValue(1);

  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 250 });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 180 });
    cardOpacity.value = withTiming(1, { duration: 300 });

    if (canClaim) {
      claimBtnScale.value = withDelay(
        800,
        withSequence(
          withSpring(1.05, { damping: 8 }),
          withSpring(1, { damping: 12 })
        )
      );
    }
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));
  const claimBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: claimBtnScale.value }],
  }));

  function handleClaim() {
    if (!canClaim) return;
    dispatch({ type: 'CLAIM_DAILY_REWARD' });
    const reward = DAILY_REWARDS[(todayDay - 1) % DAILY_REWARDS.length];
    dispatch({ type: 'ADD_COINS', amount: reward });
    // Animate out
    claimBtnScale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(0.8, { damping: 10 }),
      withTiming(1, { duration: 200 })
    );
    setTimeout(onClose, 800);
  }

  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <View style={StyleSheet.absoluteFill}>
      <StatusBar style="light" />
      <Animated.View style={[styles.overlay, overlayStyle]} />

      <View style={styles.centeredContainer}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Header */}
          <Text style={styles.emoji}>🎁</Text>
          <Text style={styles.title}>Daily Reward</Text>
          <Text style={styles.subtitle}>
            {canClaim
              ? 'Claim your reward for today!'
              : "Come back tomorrow for your next reward!"}
          </Text>

          {/* Streak badge */}
          {currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {currentStreak} day streak!</Text>
            </View>
          )}

          {/* 7-day grid */}
          <View style={styles.daysGrid}>
            {days.map((day, i) => {
              const isClaimed = day < todayDay || (day === todayDay && !canClaim);
              const isToday = day === todayDay && canClaim;
              return (
                <DayTile
                  key={day}
                  day={day}
                  coins={DAILY_REWARDS[i]}
                  isClaimed={isClaimed}
                  isToday={isToday}
                  delay={i * 60 + 200}
                />
              );
            })}
          </View>

          {/* Today's reward highlight */}
          <View style={styles.todayRewardBox}>
            <Text style={styles.todayRewardLabel}>
              {canClaim ? "TODAY'S REWARD" : 'CLAIMED TODAY'}
            </Text>
            <View style={styles.todayRewardRow}>
              <Text style={styles.todayCoinIcon}>🪙</Text>
              <Text style={styles.todayCoinAmt}>
                +{DAILY_REWARDS[(todayDay - 1) % DAILY_REWARDS.length]}
              </Text>
              <Text style={styles.todayCoinsLabel}>COINS</Text>
            </View>
          </View>

          {/* Claim / Close button */}
          {canClaim ? (
            <Animated.View style={[{ width: '100%' }, claimBtnStyle]}>
              <PremiumButton
                label="🎉 Claim Reward"
                onPress={handleClaim}
                variant="gold"
                style={styles.claimBtn}
              />
            </Animated.View>
          ) : (
            <PremiumButton
              label="Close"
              onPress={onClose}
              variant="ghost"
              style={styles.claimBtn}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const TILE_SIZE = (width - SPACING.xl * 2 - SPACING.lg * 2 - SPACING.sm * 6) / 7;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.82)',
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
    borderColor: 'rgba(255,215,0,0.2)',
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xxl + 4,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  streakBadge: {
    backgroundColor: 'rgba(249,115,22,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.3)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  streakText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.orange,
    fontWeight: FONT_WEIGHT.bold,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    width: '100%',
  },
  dayTile: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: 2,
    overflow: 'hidden',
  },
  dayTileClaimed: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderColor: 'rgba(16,185,129,0.3)',
  },
  dayTileToday: {
    backgroundColor: 'rgba(255,215,0,0.08)',
    borderColor: COLORS.gold,
    borderWidth: 1.5,
  },
  todayGlow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,215,0,0.05)',
  },
  dayNumber: {
    fontSize: 7,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  dayNumberClaimed: {
    fontSize: 14,
    color: COLORS.mint,
  },
  dayNum2: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  dayNum2Today: {
    color: COLORS.gold,
  },
  dayCoinIcon: { fontSize: 10 },
  dayCoinAmt: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
  },
  dayCoinAmtToday: {
    color: COLORS.gold,
  },
  todayRewardBox: {
    width: '100%',
    backgroundColor: 'rgba(255,215,0,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  todayRewardLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  todayRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  todayCoinIcon: { fontSize: 28 },
  todayCoinAmt: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.gold,
    textShadowColor: COLORS.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  todayCoinsLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.goldenrod,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  claimBtn: {
    width: '100%',
  },
});
