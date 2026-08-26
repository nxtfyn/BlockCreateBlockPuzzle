import * as Haptics from 'expo-haptics';
import { useGameStore } from '../store/gameStore';

// ─── Haptics Hook ─────────────────────────────────────────────────────────────
// All haptic calls are guarded by the user's vibration setting.

export function useHaptics() {
  const { state } = useGameStore();

  const vibrationEnabled = state.settings.vibration;

  /** Light tap — used for dragging / UI interactions */
  function tapLight() {
    if (!vibrationEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }

  /** Medium tap — used for piece placement */
  function tapMedium() {
    if (!vibrationEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }

  /** Heavy tap — used for line clears */
  function tapHeavy() {
    if (!vibrationEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  }

  /** Success notification — used for combo / multi-line clear */
  function success() {
    if (!vibrationEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  /** Error notification — used for invalid placement */
  function error() {
    if (!vibrationEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }

  /** Warning — used for game over */
  function warning() {
    if (!vibrationEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  }

  return { tapLight, tapMedium, tapHeavy, success, error, warning };
}
