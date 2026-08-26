// ─── Sound Hook ───────────────────────────────────────────────────────────────
// Sound files are not yet added to assets/sounds/.
// All play calls are gracefully silenced until files are present.
// To add sounds: place .mp3 files in assets/sounds/ and uncomment the sources.
//
// expo-audio v57: useAudioPlayer(source?) — source is optional (undefined = no audio).
// AudioPlayer API: player.play(), player.pause(), player.seekTo(seconds)

import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

// Uncomment and replace with actual sound files when ready:
// const SOUNDS = {
//   place:    require('../../assets/sounds/place.mp3'),
//   clear:    require('../../assets/sounds/clear.mp3'),
//   combo:    require('../../assets/sounds/combo.mp3'),
//   gameover: require('../../assets/sounds/gameover.mp3'),
//   button:   require('../../assets/sounds/button.mp3'),
// };

export function useSounds() {
  const { state } = useGameStore();
  const soundEnabled = state.settings.sound;

  // No-op stubs until sound assets are added
  const playPlace = useCallback(() => {
    if (!soundEnabled) return;
    // player.seekTo(0); player.play();
  }, [soundEnabled]);

  const playClear = useCallback(() => {
    if (!soundEnabled) return;
  }, [soundEnabled]);

  const playCombo = useCallback(() => {
    if (!soundEnabled) return;
  }, [soundEnabled]);

  const playGameOver = useCallback(() => {
    if (!soundEnabled) return;
  }, [soundEnabled]);

  const playButton = useCallback(() => {
    if (!soundEnabled) return;
  }, [soundEnabled]);

  return { playPlace, playClear, playCombo, playGameOver, playButton };
}
