// Sole Responsibility: Renders the final victory screen, tallies the score statically, and triggers the fake GitHub dispatch.

import * as Phaser from 'phaser';
import { audioManager } from '../../audio/SoundManager';
import { DIALOGUE_TREES } from '../../content/DialogueManager';
import { CrewMember } from '../../types';

export class VictoryScene extends Phaser.Scene {
  private dialogueIndex: number = 0;
  private textElement!: Phaser.GameObjects.Text;
  private submissionState: 'idle' | 'loading' | 'done' = 'idle';

  constructor() {
    super({ key: 'VictoryScene' });
  }

  create(): void {
      this.cameras.main.setBackgroundColor('#0a0a0a');
      const width = this.cameras.main.width;
      
      audioManager.playSFX('victory');

      this.add.text(width / 2, 100, "ALL SYSTEMS OPERATIONAL — SUPER!", {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '48px',
          color: '#00ffcc',
          fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(width / 2, 200, "FINAL SCORE: 9850", {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '32px',
          color: '#00ff41',
      }).setOrigin(0.5);

      this.textElement = this.add.text(width / 2, 400, "", {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '24px',
          color: '#007a1f',
          align: 'center',
          wordWrap: { width: 800 }
      }).setOrigin(0.5);

      // Trigger dialogue cascade
      this.triggerNextDialogue();

      const promptText = this.add.text(width / 2, 600, "Press ENTER to Submit Score", {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '24px',
          color: '#00ff41',
      }).setOrigin(0.5);

      this.time.addEvent({
          delay: 800,
          loop: true,
          callback: () => { promptText.visible = !promptText.visible; }
      });

      this.input.keyboard?.once('keydown-ENTER', () => {
          if (this.submissionState === 'idle') {
              this.submissionState = 'loading';
              promptText.setText("TRANSMITTING TO MARINE NETWORK...");
              promptText.setColor('#00ffcc');
              promptText.visible = true; // Lock visible
              
              // Fake network request mapping to GitHub Integration in Phase 5
              this.time.delayedCall(1500, () => {
                  promptText.setText("TRANSMITTING TO MARINE NETWORK... SUCCESS.");
                  this.submissionState = 'done';
              });
          }
      });
  }

  private triggerNextDialogue(): void {
      const crewKeys = Object.keys(DIALOGUE_TREES) as CrewMember[];
      if (this.dialogueIndex >= crewKeys.length) return;

      const crew = crewKeys[this.dialogueIndex] as CrewMember;
      
      if (crew) {
         this.textElement.setText(`${crew.toUpperCase()}: "Thank you! We're back in action!"`);
      }

      this.dialogueIndex++;
      this.time.delayedCall(1500, () => this.triggerNextDialogue());
  }

  update(): void { /* Idle loop */ }
}
