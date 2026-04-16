// Sole Responsibility: Purely visual component managing the terminal output rendering, history buffer drawing, cursor blinking, and CRT effects.

import * as Phaser from 'phaser';

export type OutputStyle = 'normal' | 'error' | 'success' | 'dim';

interface HistoryLine {
  text: string;
  style: OutputStyle;
}

export class TerminalUI extends Phaser.GameObjects.Container {
  private outputHistory: HistoryLine[] = [];
  private historyTextObjects: Phaser.GameObjects.Text[] = [];
  private inputLineText!: Phaser.GameObjects.Text;
  private cursor!: Phaser.GameObjects.Rectangle;
  private currentInput: string = '';
  private baseFontCmd: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "'Share Tech Mono', Courier New, monospace",
    fontSize: '16px'
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.setupDisplay();
    this.applyFlickerEffect();
    this.createScanlines();
    
    scene.add.existing(this);
  }

  private setupDisplay(): void {
    // Scaffold 20 text objects for history to avoid constant re-instantiation
    for (let i = 0; i < 20; i++) {
        const t = this.scene.add.text(0, i * 25, '', this.baseFontCmd);
        this.historyTextObjects.push(t);
        this.add(t);
    }

    // Input line
    this.inputLineText = this.scene.add.text(0, 20 * 25, '> ', { ...this.baseFontCmd, color: '#00ff41' });
    this.add(this.inputLineText);

    // Cursor
    this.cursor = this.scene.add.rectangle(20, (20 * 25) + 12, 12, 20, 0x00ff41);
    this.add(this.cursor);

    this.scene.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => {
            this.cursor.visible = !this.cursor.visible;
        }
    });
  }

  private createScanlines(): void {
    // Generate a simple repeating line texture locally matching bounds
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x000000, 0.4); // 40% opaque black line
    graphics.fillRect(0, 0, this.scene.cameras.main.width, 2);
    graphics.generateTexture('scanline', this.scene.cameras.main.width, 4);
    graphics.destroy();

    const overlay = this.scene.add.tileSprite(
        this.scene.cameras.main.centerX, 
        this.scene.cameras.main.centerY, 
        this.scene.cameras.main.width, 
        this.scene.cameras.main.height, 
        'scanline'
    );
    overlay.setScrollFactor(0); // fixes overlay across cameras
    overlay.setDepth(1000); // ensure it is on top
  }

  private applyFlickerEffect(): void {
    // Short 300ms flicker mimicking CRT power on
    this.setAlpha(0.2);
    this.scene.tweens.add({
        targets: this,
        alpha: 1,
        duration: 300,
        ease: 'Stepped',
        easeParams: [5] // 5 harsh step increments
    });
  }

  private getColor(style: OutputStyle): string {
    switch (style) {
        case 'normal': return '#00ff41'; // matrix green
        case 'error': return '#ff3131'; // red
        case 'success': return '#00ffcc'; // cyan-green
        case 'dim': return '#007a1f'; // dark green
        default: return '#00ff41';
    }
  }

  private refreshOutput(): void {
    const startIdx = Math.max(0, this.outputHistory.length - 20);
    const visibleLines = this.outputHistory.slice(startIdx);

    this.historyTextObjects.forEach((textObj, i) => {
        if (i < visibleLines.length) {
            const line = visibleLines[i];
            if (line) {
                textObj.setText(line.text);
                textObj.setColor(this.getColor(line.style));
            }
        } else {
            textObj.setText('');
        }
    });

    // Reposition input line correctly right underneath latest
    const yOffset = Math.min(this.outputHistory.length, 20) * 25;
    this.inputLineText.setY(yOffset);
    
    // Update cursor position relative to text width
    this.cursor.setY(yOffset + 12);
    this.cursor.setX(this.inputLineText.width + 5);
  }

  public appendOutput(line: string, style: OutputStyle): void {
      this.outputHistory.push({ text: line, style });
      this.refreshOutput();
  }

  public clearInput(): void {
      this.currentInput = '';
      this.inputLineText.setText('> ');
      this.refreshOutput();
  }

  public setInput(value: string): void {
      this.currentInput = value;
      this.inputLineText.setText(`> ${this.currentInput}`);
      this.refreshOutput();
  }
}
