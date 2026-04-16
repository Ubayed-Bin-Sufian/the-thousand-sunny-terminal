// Sole Responsibility: Preloads all static assets required by the game (sprites, audio, fonts) without enacting any business logic.
// import Phaser from 'phaser';
import * as Phaser from 'phaser';
import { GameLogger } from '../../core/GameLogger';
export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    preload() {
        GameLogger.info('franky', 'Boot sequence initiated. Loading assets into memory...');
        // TODO Phase 4: replace with real KingBell sprite
        // Do not attempt to load any sprite image files until real assets are placed in public/assets/sprites/
        /*
        this.load.image('luffy_sprite', 'assets/sprites/luffy.png');
        this.load.image('nami_sprite', 'assets/sprites/nami.png');
        this.load.image('usopp_sprite', 'assets/sprites/usopp.png');
        this.load.image('chopper_sprite', 'assets/sprites/chopper.png');
        this.load.image('robin_sprite', 'assets/sprites/robin.png');
        this.load.image('sanji_sprite', 'assets/sprites/sanji.png');
        */
        // Only load audio if asset files are confirmed present
        // TODO Phase 4: add real .mp3 files to public/assets/audio/ then uncomment
        /*
        this.load.audio('bgm_shanty', 'assets/audio/bgm_shanty.mp3');
        this.load.audio('sfx_keypress', 'assets/audio/keypress.wav');
        this.load.audio('sfx_success', 'assets/audio/success.wav');
        this.load.audio('sfx_error', 'assets/audio/error.wav');
        this.load.audio('sfx_select', 'assets/audio/select.wav');
        this.load.audio('sfx_victory', 'assets/audio/victory.wav');
        */
        // TODO Phase 4: replace with bitmap font once file is in public/assets/fonts/
        // For now, TerminalUI uses 'Share Tech Mono' via CSS font loading
    }
    create() {
        GameLogger.info('franky', 'All assets loaded. Boot sequence SUPER complete!');
        const crewColors = {
            luffy: 0xff0000, nami: 0xffa500, usopp: 0xffff00,
            chopper: 0xffadc9, robin: 0x800080, sanji: 0x0000ff
        };
        for (const [crew, color] of Object.entries(crewColors)) {
            const rt = this.add.renderTexture(0, 0, 100, 100);
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(color, 1);
            graphics.fillRect(0, 0, 100, 100);
            rt.draw(graphics);
            const text = this.make.text({
                x: 50, y: 50, text: crew.toUpperCase(),
                style: { color: '#00ff41', fontFamily: 'monospace', fontSize: '14px' }
            }, false).setOrigin(0.5, 0.5);
            rt.draw(text);
            rt.saveTexture(`${crew}_sprite`);
            text.destroy();
            graphics.destroy();
            rt.destroy();
        }
        this.scene.start('MenuScene');
    }
}
