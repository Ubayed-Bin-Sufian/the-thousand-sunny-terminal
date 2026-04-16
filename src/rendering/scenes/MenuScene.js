// Sole Responsibility: Renders the static title screen UI and transitions to the System Map. No gameplay logic.
import * as Phaser from 'phaser';
import { audioManager } from '../../audio/SoundManager';
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    preload() { }
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        // Background is #0a0a0a globally, but we enforce it here
        this.cameras.main.setBackgroundColor('#0a0a0a');
        // Title Text
        this.add.text(width / 2, height / 3, "The Thousand Sunny's Terminal", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '48px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        // Flavour Line
        this.add.text(width / 2, height / 2, '"Even a dream ship needs its engine greased! SUPER!" - Franky', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '24px',
            color: '#007a1f',
        }).setOrigin(0.5);
        // Prompt Text
        const promptText = this.add.text(width / 2, height * 0.75, "Press ENTER to begin", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '28px',
            color: '#00ff41',
        }).setOrigin(0.5);
        // 800ms Blink Event
        this.time.addEvent({
            delay: 800,
            loop: true,
            callback: () => {
                promptText.visible = !promptText.visible;
            }
        });
        // Keyboard Input
        if (this.input.keyboard) {
            this.input.keyboard.once('keydown-ENTER', () => {
                audioManager.unlockAudioContext();
                audioManager.playBGM('bgm_shanty');
                this.scene.start('SystemMapScene');
            });
        }
    }
    update() { }
}
