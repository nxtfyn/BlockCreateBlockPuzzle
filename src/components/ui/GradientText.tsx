import React from 'react';
import { Text, TextStyle, StyleSheet, View } from 'react-native';

// ─── GradientText ─────────────────────────────────────────────────────────────
// Simulates gradient text by layering a tinted shadow and colored text.
// Since expo-linear-gradient is not installed, we use a visual trick with
// text shadow and opacity layers.

interface Props {
  text: string;
  primaryColor?: string;
  style?: TextStyle;
}

export default function GradientText({
  text,
  primaryColor = '#4A9EFF',
  style,
}: Props) {
  return (
    <View>
      {/* Shadow layer for depth */}
      <Text
        style={[
          styles.base,
          style,
          {
            color: primaryColor,
            opacity: 0.35,
            position: 'absolute',
            top: 3,
            left: 1,
          },
        ]}
        accessibilityElementsHidden
      >
        {text}
      </Text>
      {/* Main text */}
      <Text
        style={[
          styles.base,
          style,
          {
            color: primaryColor,
            textShadowColor: primaryColor,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 12,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '900',
    letterSpacing: 2,
  },
});
