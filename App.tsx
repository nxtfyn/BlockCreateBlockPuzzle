import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/store/gameStore';
import { Screen } from './src/types';
import { COLORS } from './src/constants/colors';

// ─── Screens ──────────────────────────────────────────────────────────────────
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import PauseScreen from './src/screens/PauseScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ShopScreen from './src/screens/ShopScreen';
import DailyRewardScreen from './src/screens/DailyRewardScreen';

// ─── Root App with GameProvider ────────────────────────────────────────────────

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <GameProvider>
        <AppNavigator />
      </GameProvider>
    </GestureHandlerRootView>
  );
}

// ─── App Navigator ────────────────────────────────────────────────────────────
// Simple state-machine navigator — no react-navigation needed for this game.

function AppNavigator() {
  const [screen, setScreen] = useState<Screen>('splash');
  // Modal/overlay screens layered on top of the active base screen
  const [modalScreen, setModalScreen] = useState<Screen | null>(null);

  const navigate = useCallback((s: Screen) => {
    // These are full-screen overlays rendered on top of game
    if (s === 'pause' || s === 'gameover' || s === 'settings' || s === 'shop' || s === 'daily_reward') {
      setModalScreen(s);
    } else {
      setModalScreen(null);
      setScreen(s);
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalScreen(null);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Base Screens ── */}

      {screen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('home')} />
      )}

      {screen === 'home' && (
        <HomeScreen
          onPlay={() => {
            setScreen('game');
            setModalScreen(null);
          }}
          onSettings={() => setModalScreen('settings')}
          onShop={() => setModalScreen('shop')}
          onDailyReward={() => setModalScreen('daily_reward')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          onPause={() => setModalScreen('pause')}
          onGameOver={() => setModalScreen('gameover')}
        />
      )}

      {/* ── Modal Overlays (rendered on top of whatever base screen is active) ── */}

      {modalScreen === 'pause' && (
        <PauseScreen
          onResume={closeModal}
          onRestart={() => {
            closeModal();
            setScreen('game');
          }}
          onHome={() => {
            closeModal();
            setScreen('home');
          }}
        />
      )}

      {modalScreen === 'gameover' && (
        <GameOverScreen
          onRestart={() => {
            closeModal();
            setScreen('game');
          }}
          onHome={() => {
            closeModal();
            setScreen('home');
          }}
        />
      )}

      {modalScreen === 'settings' && (
        <SettingsScreen onClose={closeModal} />
      )}

      {modalScreen === 'shop' && (
        <ShopScreen onClose={closeModal} />
      )}

      {modalScreen === 'daily_reward' && (
        <DailyRewardScreen onClose={closeModal} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
