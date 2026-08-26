import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
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

// ─── SettingsScreen ────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

interface ToggleRowProps {
  icon: string;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

function ToggleRow({ icon, label, description, value, onToggle }: ToggleRowProps) {
  const trackBg = value ? COLORS.primary : 'rgba(255,255,255,0.12)';
  const thumbX = useSharedValue(value ? 22 : 2);

  useEffect(() => {
    thumbX.value = withSpring(value ? 22 : 2, { damping: 14, stiffness: 200 });
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle} activeOpacity={0.7}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowTextBlock}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>
      {/* Custom toggle switch */}
      <TouchableOpacity
        style={[styles.track, { backgroundColor: trackBg }]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function ActionRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ onClose }: Props) {
  const { state, dispatch } = useGameStore();

  const overlayOpacity = useSharedValue(0);
  const cardY = useSharedValue(60);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 250 });
    cardY.value = withSpring(0, { damping: 16, stiffness: 180 });
    cardOpacity.value = withTiming(1, { duration: 250 });
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));

  function toggle(key: 'sound' | 'music' | 'vibration') {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: !state.settings[key] } });
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <StatusBar style="light" />
      <Animated.View style={[styles.overlay, overlayStyle]} />

      <View style={styles.container}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Audio section */}
            <Text style={styles.sectionLabel}>AUDIO</Text>
            <View style={styles.section}>
              <ToggleRow
                icon="🔊"
                label="Sound Effects"
                description="Block placement, clears, game over"
                value={state.settings.sound}
                onToggle={() => toggle('sound')}
              />
              <View style={styles.divider} />
              <ToggleRow
                icon="🎵"
                label="Music"
                description="Background music during gameplay"
                value={state.settings.music}
                onToggle={() => toggle('music')}
              />
              <View style={styles.divider} />
              <ToggleRow
                icon="📳"
                label="Vibration"
                description="Haptic feedback on placements"
                value={state.settings.vibration}
                onToggle={() => toggle('vibration')}
              />
            </View>

            {/* Support section */}
            <Text style={styles.sectionLabel}>SUPPORT</Text>
            <View style={styles.section}>
              <ActionRow
                icon="🔄"
                label="Restore Purchases"
                onPress={() => { /* IAP restore logic */ }}
              />
              <View style={styles.divider} />
              <ActionRow
                icon="🔒"
                label="Privacy Policy"
                onPress={() => Linking.openURL('https://nextfyn.com/privacy')}
              />
              <View style={styles.divider} />
              <ActionRow
                icon="📧"
                label="Contact & Support"
                onPress={() => Linking.openURL('mailto:support@nextfyn.com')}
              />
            </View>

            {/* App info */}
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Developer</Text>
                <Text style={styles.infoValue}>NextFyn</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Package</Text>
                <Text style={styles.infoValue}>com.nextfyn.blockcrate</Text>
              </View>
            </View>

            <View style={{ height: SPACING.xl }} />
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: COLORS.bgModal,
    borderTopLeftRadius: RADIUS.xl + 4,
    borderTopRightRadius: RADIUS.xl + 4,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    maxHeight: '90%',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.bold,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.sm,
  },
  section: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: SPACING.xl + SPACING.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  rowIcon: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  rowTextBlock: {
    flex: 1,
  },
  rowLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  actionLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  chevron: {
    fontSize: 22,
    color: COLORS.textMuted,
    lineHeight: 26,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.medium,
  },
});
