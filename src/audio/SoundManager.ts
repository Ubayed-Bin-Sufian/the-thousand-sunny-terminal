// Sole Responsibility: Central Singleton audio coordinator wrapping Phaser's sound system cleanly.

import Phaser from 'phaser';
import { GameLogger } from '../core/GameLogger';

export type SoundKey = 'keypress' | 'repair_success' | 'repair_fail' | 'system_select' | 'victory';

class SoundManager {
    private scene!: Phaser.Scene;
    private initialized: boolean = false;
    private bgmTrack: Phaser.Sound.BaseSound | null = null;

    public init(scene: Phaser.Scene): void {
        if (!this.initialized) {
            this.scene = scene;
            this.initialized = true;
        }
    }

    public unlockAudioContext(): void {
        if (!this.scene) return;
        const sm = this.scene.sound as Phaser.Sound.WebAudioSoundManager;
        if (sm.context && sm.context.state === 'suspended') {
            sm.context.resume();
        }
    }

    public playBGM(key: string): void {
        this.stopBGM(); // Ensure no overlap
        if (!this.scene) return;
        
        if (!this.scene.cache.audio.exists(key)) {
            GameLogger.warn('franky', `BGM Track ${key} missing - Audio blocked or absent.`);
            return;
        }

        GameLogger.info('franky', `Spinning up the BGM track: ${key}. SUPER acoustic resonance!`);
        this.bgmTrack = this.scene.sound.add(key, { loop: true, volume: 0.5 });
        this.bgmTrack.play();
    }

    public stopBGM(): void {
        if (this.bgmTrack && this.bgmTrack.isPlaying) {
            this.bgmTrack.stop();
        }
    }

    public playSFX(key: SoundKey): void {
        if (!this.scene) return;
        
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
