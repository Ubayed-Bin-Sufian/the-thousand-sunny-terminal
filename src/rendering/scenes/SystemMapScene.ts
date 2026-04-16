// Sole Responsibility: Renders the ship overview map visually and transitions to TerminalScene natively based on valid user selection.

import * as Phaser from 'phaser';
import { getInitialShipState } from '../../core/MachineSystem';
import { SYSTEM_NAMES } from '../../config/constants';
import type { SystemName, ShipState } from '../../types';

export class SystemMapScene extends Phaser.Scene {
  private tempState!: Readonly<ShipState>; // Temporary local state purely for rendering visual conditions until global hookup
  private inputText: Phaser.GameObjects.Text | null = null;
  private inputBuffer: string = '';

  constructor() {
    super({ key: 'SystemMapScene' });
  }

  preload(): void {}

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Note: In Phase 4 this state will be fetched centrally. For Phase 3 isolated rendering, we pull the initial snapshot.
    this.tempState = getInitialShipState();

    this.add.text(width / 2, 80, "THOUSAND SUNNY - DIAGNOSTIC OVERVIEW", {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '32px',
      color: '#00ff41',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Render Nodes
    const startY = 180;
    const spacing = 60;

    SYSTEM_NAMES.forEach((sysName, index) => {
      const isRepaired = this.tempState.systems[sysName]?.isRepaired ?? false;
      const color = isRepaired ? '#00ffcc' : '#ff3131';
      const label = `[${index + 1}] ${sysName.toUpperCase()}`;

      // Node indicator
      const dot = this.add.circle(width / 2 - 200, startY + (index * spacing), 8, isRepaired ? 0x00ffcc : 0xff3131);
      
      this.add.text(width / 2 - 170, startY + (index * spacing) - 10, label, {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '24px',
        color: color
      });

      if (!isRepaired) {
        this.tweens.add({
          targets: dot,
          alpha: 0.2,
          duration: 600,
          yoyo: true,
          repeat: -1
        });
      }
    });

    // Interactive input UI specifically for scene jumping
    this.add.text(width / 2, height - 100, "Select system to repair (Type identifier):", {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '20px',
      color: '#007a1f'
    }).setOrigin(0.5);

    this.inputText = this.add.text(width / 2, height - 60, "> _", {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '24px',
      color: '#00ff41'
    }).setOrigin(0.5);

    this.setupKeyboardInput();
  }

  private setupKeyboardInput(): void {
    if (!this.input.keyboard) return;
    
    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        this.inputBuffer = this.inputBuffer.slice(0, -1);
      } else if (event.key === 'Enter') {
        this.processSelection();
      } else if (event.key.length === 1 && event.key.match(/[a-zA-Z0-9_]/)) {
        this.inputBuffer += event.key.toLowerCase();
      }
      
      if (this.inputText) {
        this.inputText.setText(`> ${this.inputBuffer}_`);
      }
    });
  }

  private processSelection(): void {
    const target = this.inputBuffer.trim();
    this.inputBuffer = '';
    
    // Check if input matches index or literal string
    let matchedSystem: SystemName | null = null;

    SYSTEM_NAMES.forEach((sys, index) => {
      if (target === String(index + 1) || target === sys) {
        matchedSystem = sys;
      }
    });

    if (matchedSystem) {
      this.scene.start('TerminalScene', { systemRoute: matchedSystem });
    } else {
      // Visual failure cue
      this.cameras.main.shake(200, 0.01);
    }
    
    if (this.inputText) {
      this.inputText.setText(`> _`);
    }
  }

  update(): void {}
}
