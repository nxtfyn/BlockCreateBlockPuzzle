import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';

// ─── PremiumButton ────────────────────────────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_STYLES: Record<
  Variant,
  { bg: string; border: string; text: string; shadow: string }
> = {
  primary: {
    bg: '#1A3D6B',
    border: COLORS.primary,
    text: COLORS.primary,
    shadow: 'rgba(74,158,255,0.4)',
  },
  secondary: {
    bg: '#2A1A4A',
    border: COLORS.secondary,
    text: COLORS.secondary,
    shadow: 'rgba(139,92,246,0.4)',
  },
  danger: {
    bg: '#3D1A1A',
    border: COLORS.tertiary,
    text: COLORS.tertiary,
    shadow: 'rgba(255,107,107,0.4)',
  },
  ghost: {
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.2)',
    text: COLORS.textSecondary,
    shadow: 'transparent',
  },
  gold: {
    bg: '#3D2E00',
    border: COLORS.gold,
    text: COLORS.gold,
    shadow: 'rgba(255,215,0,0.4)',
  },
};

export default function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
  icon,
}: Props) {
  const vs = VARIANT_STYLES[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        {
          backgroundColor: vs.bg,
          borderColor: vs.border,
          shadowColor: vs.shadow,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, { color: vs.text }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  icon: {
    marginRight: SPACING.sm,
  },
});
