import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
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
import AnimatedNumber from '../components/ui/AnimatedNumber';

const { width } = Dimensions.get('window');

// ─── ShopScreen ────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

interface CoinPackProps {
  coins: number;
  price: string;
  tag?: string;
  tagColor?: string;
}

function CoinPack({ coins, price, tag, tagColor = COLORS.primary }: CoinPackProps) {
  return (
    <TouchableOpacity style={styles.coinPack} activeOpacity={0.7}>
      {tag && (
        <View style={[styles.packTag, { backgroundColor: tagColor }]}>
          <Text style={styles.packTagText}>{tag}</Text>
        </View>
      )}
      <Text style={styles.packCoinIcon}>🪙</Text>
      <Text style={styles.packCoinAmount}>{coins.toLocaleString()}</Text>
      <Text style={styles.packCoinsLabel}>COINS</Text>
      <View style={styles.packPriceBtn}>
        <Text style={styles.packPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}

interface PowerUpProps {
  icon: string;
  name: string;
  description: string;
  cost: number;
  coins: number;
}

function PowerUpItem({ icon, name, description, cost, coins }: PowerUpProps) {
  const canAfford = coins >= cost;
  return (
    <View style={styles.powerUpRow}>
      <View style={styles.powerUpIconContainer}>
        <Text style={styles.powerUpIcon}>{icon}</Text>
      </View>
      <View style={styles.powerUpInfo}>
        <Text style={styles.powerUpName}>{name}</Text>
        <Text style={styles.powerUpDesc}>{description}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.powerUpBuyBtn,
          !canAfford && styles.powerUpBuyBtnDisabled,
        ]}
        disabled={!canAfford}
        activeOpacity={0.7}
      >
        <Text style={styles.coinMiniIcon}>🪙</Text>
        <Text style={[styles.powerUpCost, !canAfford && styles.powerUpCostDisabled]}>
          {cost}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface ThemeItemProps {
  name: string;
  colors: string[];
  isFree?: boolean;
  isLocked?: boolean;
  cost?: number;
}

function ThemeItem({ name, colors, isFree, isLocked, cost = 0 }: ThemeItemProps) {
  return (
    <TouchableOpacity style={styles.themeItem} activeOpacity={0.7}>
      <View style={styles.themePreview}>
        {colors.map((c, i) => (
          <View key={i} style={[styles.themeCell, { backgroundColor: c }]} />
        ))}
      </View>
      <Text style={styles.themeName}>{name}</Text>
      {isFree ? (
        <View style={styles.freeTag}>
          <Text style={styles.freeTagText}>FREE</Text>
        </View>
      ) : isLocked ? (
        <View style={styles.lockedTag}>
          <Text style={styles.lockedTagText}>🔒 {cost}</Text>
        </View>
      ) : (
        <View style={styles.ownedTag}>
          <Text style={styles.ownedTagText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ShopScreen({ onClose }: Props) {
  const { state } = useGameStore();

  const overlayOpacity = useSharedValue(0);
  const cardY = useSharedValue(80);
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

  return (
    <View style={StyleSheet.absoluteFill}>
      <StatusBar style="light" />
      <Animated.View style={[styles.overlay, overlayStyle]} />

      <View style={styles.container}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Shop</Text>
              <View style={styles.coinBalanceRow}>
                <Text style={styles.balanceCoin}>🪙</Text>
                <AnimatedNumber value={state.coins} style={styles.balanceAmount} />
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Remove Ads banner */}
            <TouchableOpacity style={styles.removeAdsBanner} activeOpacity={0.8}>
              <View style={styles.removeAdsLeft}>
                <Text style={styles.removeAdsEmoji}>✨</Text>
                <View>
                  <Text style={styles.removeAdsTitle}>Remove All Ads</Text>
                  <Text style={styles.removeAdsSub}>One-time purchase, forever ad-free</Text>
                </View>
              </View>
              <View style={styles.removeAdsPriceBtn}>
                <Text style={styles.removeAdsPrice}>$2.99</Text>
              </View>
            </TouchableOpacity>

            {/* Coin packs */}
            <Text style={styles.sectionLabel}>COIN PACKS</Text>
            <View style={styles.coinPacksRow}>
              <CoinPack coins={100} price="$0.99" />
              <CoinPack coins={500} price="$3.99" tag="POPULAR" tagColor={COLORS.primary} />
              <CoinPack coins={1200} price="$7.99" tag="BEST VALUE" tagColor={COLORS.mint} />
            </View>

            {/* Power-ups */}
            <Text style={styles.sectionLabel}>POWER-UPS</Text>
            <View style={styles.section}>
              <PowerUpItem
                icon="💣"
                name="Bomb Block"
                description="Clears a 3×3 area instantly"
                cost={50}
                coins={state.coins}
              />
              <View style={styles.divider} />
              <PowerUpItem
                icon="🧹"
                name="Eraser"
                description="Remove any single placed block"
                cost={30}
                coins={state.coins}
              />
              <View style={styles.divider} />
              <PowerUpItem
                icon="🔀"
                name="Shuffle Tray"
                description="Get 3 new random pieces"
                cost={20}
                coins={state.coins}
              />
              <View style={styles.divider} />
              <PowerUpItem
                icon="↩️"
                name="Undo"
                description="Undo your last placement"
                cost={40}
                coins={state.coins}
              />
            </View>

            {/* Board themes */}
            <Text style={styles.sectionLabel}>BOARD THEMES</Text>
            <View style={styles.themesGrid}>
              <ThemeItem
                name="Classic Dark"
                colors={[COLORS.cyan, COLORS.purple, COLORS.coral, COLORS.mint]}
                isFree
              />
              <ThemeItem
                name="Ocean"
                colors={['#0066CC', '#0099FF', '#00CCFF', '#66FFFF']}
                isLocked
                cost={200}
              />
              <ThemeItem
                name="Neon"
                colors={['#FF00FF', '#00FF00', '#FFFF00', '#FF8800']}
                isLocked
                cost={300}
              />
            </View>

            <View style={{ height: SPACING.xl + SPACING.md }} />
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
    borderColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    maxHeight: '92%',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginBottom: 4,
  },
  coinBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceCoin: { fontSize: 14 },
  balanceAmount: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.gold,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  closeIcon: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.bold,
  },
  removeAdsBanner: {
    backgroundColor: 'rgba(255,215,0,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  removeAdsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  removeAdsEmoji: { fontSize: 28 },
  removeAdsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.gold,
    marginBottom: 2,
  },
  removeAdsSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  removeAdsPriceBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  removeAdsPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.black,
    color: '#000',
  },
  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.xs,
  },
  coinPacksRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  coinPack: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    alignItems: 'center',
    padding: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  packTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomLeftRadius: RADIUS.sm,
  },
  packTagText: {
    fontSize: 8,
    fontWeight: FONT_WEIGHT.black,
    color: '#000',
    letterSpacing: 0.5,
  },
  packCoinIcon: { fontSize: 28, marginBottom: 4 },
  packCoinAmount: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.gold,
  },
  packCoinsLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  packPriceBtn: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  packPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.gold,
  },
  section: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: SPACING.xl + SPACING.md,
  },
  powerUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  powerUpIconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerUpIcon: { fontSize: 24 },
  powerUpInfo: { flex: 1 },
  powerUpName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  powerUpDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  powerUpBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    gap: 2,
  },
  powerUpBuyBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  coinMiniIcon: { fontSize: 12 },
  powerUpCost: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.gold,
  },
  powerUpCostDisabled: {
    color: COLORS.textMuted,
  },
  themesGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
  },
  themeItem: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 2) / 3,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  themePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 48,
    height: 48,
    gap: 3,
  },
  themeCell: {
    width: 21,
    height: 21,
    borderRadius: 3,
  },
  themeName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: FONT_WEIGHT.medium,
  },
  freeTag: {
    backgroundColor: COLORS.mint,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeTagText: {
    fontSize: 9,
    fontWeight: FONT_WEIGHT.black,
    color: '#000',
    letterSpacing: 0.5,
  },
  lockedTag: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  lockedTagText: {
    fontSize: 9,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
  },
  ownedTag: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ownedTagText: {
    fontSize: 12,
    color: COLORS.mint,
    fontWeight: FONT_WEIGHT.black,
  },
});
