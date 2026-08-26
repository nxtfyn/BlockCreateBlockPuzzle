import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  BEST_SCORE: '@blockcrate_best_score',
  COINS: '@blockcrate_coins',
  SETTINGS: '@blockcrate_settings',
  DAILY_REWARD: '@blockcrate_daily_reward',
} as const;

// ─── Best Score ───────────────────────────────────────────────────────────────

export async function loadBestScore(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(KEYS.BEST_SCORE);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveBestScore(score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.BEST_SCORE, String(score));
  } catch {
    // ignore
  }
}

// ─── Coins ────────────────────────────────────────────────────────────────────

export async function loadCoins(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(KEYS.COINS);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveCoins(coins: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.COINS, String(coins));
  } catch {
    // ignore
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface StoredSettings {
  sound: boolean;
  music: boolean;
  vibration: boolean;
}

const DEFAULT_SETTINGS: StoredSettings = {
  sound: true,
  music: true,
  vibration: true,
};

export async function loadSettings(): Promise<StoredSettings> {
  try {
    const val = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (val) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(val) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: StoredSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

// ─── Daily Reward ─────────────────────────────────────────────────────────────

export interface StoredDailyReward {
  lastClaim: string | null;
  streak: number;
}

export async function loadDailyReward(): Promise<StoredDailyReward> {
  try {
    const val = await AsyncStorage.getItem(KEYS.DAILY_REWARD);
    if (val) return JSON.parse(val);
  } catch {
    // ignore
  }
  return { lastClaim: null, streak: 0 };
}

export async function saveDailyReward(data: StoredDailyReward): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.DAILY_REWARD, JSON.stringify(data));
  } catch {
    // ignore
  }
}
