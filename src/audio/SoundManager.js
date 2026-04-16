// Sole Responsibility: Central Singleton audio coordinator wrapping Phaser's sound system cleanly.
import { GameLogger } from '../core/GameLogger';
class SoundManager {
    constructor() {
        this.initialized = false;
        this.bgmTrack = null;
    }
    init(scene) {
        if (!this.initialized) {
            this.scene = scene;
            this.initialized = true;
        }
    }
    unlockAudioContext() {
        if (!this.scene)
            return;
        const sm = this.scene.sound;
        if (sm.context && sm.context.state === 'suspended') {
            sm.context.resume();
        }
    }
    playBGM(key) {
        this.stopBGM(); // Ensure no overlap
        if (!this.scene)
            return;
        if (!this.scene.cache.audio.exists(key)) {
            GameLogger.warn('franky', `BGM Track ${key} missing - Audio blocked or absent.`);
            return;
        }
        GameLogger.info('franky', `Spinning up the BGM track: ${key}. SUPER acoustic resonance!`);
        this.bgmTrack = this.scene.sound.add(key, { loop: true, volume: 0.5 });
        this.bgmTrack.play();
    }
    stopBGM() {
        if (this.bgmTrack && this.bgmTrack.isPlaying) {
            this.bgmTrack.stop();
        }
    }
    playSFX(key) {
        if (!this.scene)
            return;
        const target = `sfx_${key}`;
        if (!this.scene.cache.audio.exists(target)) {
            GameLogger.warn('franky', `SFX Track ${target} missing - Audio blocked or absent.`);
            return;
        }
        // Maps logic layer keys directly to Phaser loaded assets
        this.scene.sound.play(target);
    }
}
// Export singleton instance
export const audioManager = new SoundManager();
