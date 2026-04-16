console.log("Welcome to The Thousand Sunny Terminal!");

// Sole Responsibility: Bootstraps the Phaser Game instance, configures the engine, and registers all scenes.

import * as Phaser from 'phaser';

import { BootScene } from './rendering/scenes/BootScene';
import { MenuScene } from './rendering/scenes/MenuScene';
import { SystemMapScene } from './rendering/scenes/SystemMapScene';
import { TerminalScene } from './rendering/scenes/TerminalScene';
import { VictoryScene } from './rendering/scenes/VictoryScene';
import { TerminalController } from './core/TerminalController';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#0a0a0a',
  parent: 'app',
  scene: [
    BootScene,
    MenuScene,
    SystemMapScene,
    TerminalScene,
    VictoryScene
  ],
  callbacks: {
    preBoot: (game: Phaser.Game) => {
      // Global terminal controller initialization and registration per Phase 3 requirements
      const globalController = new TerminalController();
      game.registry.set('TerminalController', globalController);
    }
  }
};

const game = new Phaser.Game(config);

export default game;
