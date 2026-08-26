import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import PremiumButton from '../components/ui/PremiumButton';

const { width, height } = Dimensions.get('window');

// ─── PauseScreen ──────────────────────────────────────────────────────────────

interface Props {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export default function PauseScreen({ onResume, onRestart, onHome }: Props) {
  const { state, dispatch } = useGameStore();

  function handleRestart() {
    dispatch({ type: 'RESTART' });
    onRestart();
  }

  const overlayOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.85);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 250 });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 200 });
    cardOpacity.value = withTiming(1, { duration: 250 });
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  function toggleSound() {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { sound: !state.settings.sound } });
  }

  function toggleMusic() {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { music: !state.settings.music } });
  }

  function toggleVibration() {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { vibration: !state.settings.vibration } });
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <StatusBar style="light" />

      {/* Dimmed backdrop */}
      <Animated.View style={[styles.overlay, overlayStyle]} />

      {/* Card */}
      <View style={styles.centeredContainer}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Title */}
          <View style={styles.titleRow}>
            <Text style={styles.pauseIcon}>⏸</Text>
            <Text style={styles.title}>PAUSED</Text>
          </View>

          {/* Score display */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>CURRENT SCORE</Text>
            <Text style={styles.scoreValue}>{state.score.toLocaleString()}</Text>
          </View>

          {/* Toggle buttons */}
          <View style={styles.togglesRow}>
            <ToggleButton
              icon={state.settings.sound ? '🔊' : '🔇'}
              label="Sound"
              active={state.settings.sound}
              onPress={toggleSound}
            />
            <ToggleButton
              icon={state.settings.music ? '🎵' : '🎵'}
              label="Music"
              active={state.settings.music}
              onPress={toggleMusic}
            />
            <ToggleButton
              icon={state.settings.vibration ? '📳' : '📴'}
              label="Vibrate"
              active={state.settings.vibration}
              onPress={toggleVibration}
            />
          </View>

          {/* Action buttons */}
          <PremiumButton
            label="Resume"
            onPress={onResume}
            variant="primary"
            style={styles.btn}
          />
          <PremiumButton
            label="Restart"
            onPress={handleRestart}
            variant="secondary"
            style={styles.btn}
          />
          <PremiumButton
            label="Home"
            onPress={onHome}
            variant="ghost"
            style={styles.btn}
          />

          {/* Ad-free upsell */}
          <TouchableOpacity style={styles.adFreeBtn} activeOpacity={0.7}>
            <Text style={styles.adFreeText}>✨ Remove Ads · $2.99</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

interface ToggleBtnProps {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}

function ToggleButton({ icon, label, active, onPress }: ToggleBtnProps) {
  return (
    <TouchableOpacity
      style={[styles.toggleBtn, active && styles.toggleBtnActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.toggleIcon}>{icon}</Text>
      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>
        {label}
      </Text>
      <View
        style={[
          styles.toggleDot,
          { backgroundColor: active ? COLORS.primary : 'rgba(255,255,255,0.15)' },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.78)',
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
    borderColor: 'rgba(255,255,255,0.1)',
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  pauseIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
    letterSpacing: 4,
  },
  scoreCard: {
    backgroundColor: 'rgba(74,158,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(74,158,255,0.2)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    width: '100%',
  },
  scoreLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.primary,
  },
  togglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    gap: 2,
  },
  toggleBtnActive: {
    borderColor: 'rgba(74,158,255,0.3)',
    backgroundColor: 'rgba(74,158,255,0.07)',
  },
  toggleIcon: {
    fontSize: 20,
  },
  toggleLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.medium,
  },
  toggleLabelActive: {
    color: COLORS.primary,
  },
  toggleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  btn: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  adFreeBtn: {
    marginTop: SPACING.xs,
    paddingVertical: SPACING.sm,
  },
  adFreeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.goldenrod,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.5,
  },
});
