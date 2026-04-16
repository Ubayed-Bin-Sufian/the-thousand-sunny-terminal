// Sole Responsibility: Renders idle sprite animations and dynamic pop-up speech bubbles for a given CrewMember.
import * as Phaser from 'phaser';
export class CrewPortrait extends Phaser.GameObjects.Container {
    constructor(scene, x, y, crew) {
        super(scene, x, y);
        this.setupSprite(crew);
        this.setupSpeechBubble();
        scene.add.existing(this);
    }
    setupSprite(crew) {
        // Create sprite. Assumes the texture key matches `${crew}_sprite`
        this.sprite = this.scene.add.image(0, 0, `${crew}_sprite`).setOrigin(0.5);
        this.add(this.sprite);
        // Simple pseudo idle breathe loop
        this.scene.tweens.add({
            targets: this.sprite,
            scaleY: 1.05,
            scaleX: 0.98,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    setupSpeechBubble() {
        this.bubbleGroup = this.scene.add.container(0, 150);
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x0a0a0a, 0.9);
        graphics.lineStyle(2, 0x00ff41, 1);
        // Draw rectangular border 
        graphics.strokeRect(-150, -50, 300, 100);
        graphics.fillRect(-150, -50, 300, 100);
        this.bubbleGroup.add(graphics);
        this.bubbleName = this.scene.add.text(-140, -45, "", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '18px',
            color: '#00ffcc',
            fontStyle: 'bold'
        });
        this.bubbleGroup.add(this.bubbleName);
        this.bubbleText = this.scene.add.text(-140, -20, "", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '14px',
            color: '#00ff41',
            wordWrap: { width: 280 }
        });
        this.bubbleGroup.add(this.bubbleText);
        this.bubbleGroup.setAlpha(0);
        this.add(this.bubbleGroup);
    }
    showDialogue(line) {
        // Set values
        this.bubbleName.setText(line.crew.toUpperCase());
        this.bubbleText.setText(line.text);
        // Reset transforms
        this.bubbleGroup.y = 170; // Starts slightly lower
        this.bubbleGroup.setAlpha(0);
        // Slide up and fade in
        this.scene.tweens.add({
            targets: this.bubbleGroup,
            y: 150,
            alpha: 1,
            duration: 200,
            ease: 'Power2'
        });
        // Auto dismiss after 4 seconds (as an extra polished feature, though can be overwritten early if called again)
        this.scene.time.delayedCall(4000, () => {
            this.hideDialogue();
        });
    }
    hideDialogue() {
        this.scene.tweens.add({
            targets: this.bubbleGroup,
            alpha: 0,
            duration: 150
        });
    }
}
