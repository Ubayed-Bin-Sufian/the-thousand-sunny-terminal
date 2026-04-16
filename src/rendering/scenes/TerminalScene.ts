// Sole Responsibility: Main gameplay scene that orchestrates the terminal UI, puzzles, dialogue, and audio without defining puzzle logic itself.

import * as Phaser from 'phaser';
import { TerminalUI } from '../ui/TerminalUI';
import { CrewPortrait } from '../ui/CrewPortrait';
import { TerminalController } from '../../core/TerminalController';
import { EngineRoomPuzzle } from '../../core/PuzzleEngine';
import { getDialogue } from '../../content/DialogueManager';
import { audioManager } from '../../audio/SoundManager';
import { applyRepair, getInitialShipState } from '../../core/MachineSystem';
import type { SystemName, ShipState } from '../../types';
import type { Puzzle } from '../../core/PuzzleEngine';

export class TerminalScene extends Phaser.Scene {
  private activeSystem!: SystemName;
  private ui!: TerminalUI;
  private portrait!: CrewPortrait;
  private controller!: TerminalController;
  private puzzle!: Puzzle;
  private shipState!: Readonly<ShipState>;

  constructor() {
    super({ key: 'TerminalScene' });
  }

  init(data: { systemRoute: SystemName }): void {
      this.activeSystem = data.systemRoute || 'engine_room';
  }

  create(): void {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      // Note: Phase 3 state mock -> In Phase 4 this mounts a global Registry state
      this.shipState = getInitialShipState();
      const currentSysStatus = this.shipState.systems[this.activeSystem];
      
      const crewName = currentSysStatus?.assignedCrew ?? 'luffy';

      // Instantiate Visuals
      this.portrait = new CrewPortrait(this, width - 200, height / 2 - 100, crewName);
      this.ui = new TerminalUI(this, 20, 20);

      // Instantiate Logic from Registry as per Phase 3 requirements
      this.controller = this.registry.get('TerminalController');
      
      if (this.activeSystem === 'engine_room') {
          this.puzzle = new EngineRoomPuzzle();
      } else {
          // Fallback missing puzzle instantiation for phase completion stub
          this.puzzle = new EngineRoomPuzzle(); // Mock
          this.ui.appendOutput(`WARN: Core puzzle logic for ${this.activeSystem} pending in Phase 4.`, 'dim');
      }

      // Initial Dialogue
      const initialLine = getDialogue(crewName, 0); // Idle line
      if (initialLine) {
          this.portrait.showDialogue(initialLine);
      }

      // Connect Key Input mapping local phaser events to isolated logic controller
      this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
          this.controller.handleKeyInput(event.key);
          audioManager.playSFX('keypress');
          this.ui.setInput(this.controller.getBuffer()); // Ensure visual line matches decoupled buffer
      });

      // Bind Subscription: Controller -> Puzzle Engine -> Presentation Orchestration
      this.controller.subscribe((event) => {
          const actionText = `> ${event.action.rawInput}`;
          this.ui.appendOutput(actionText, 'normal'); // Echo command

          const result = this.puzzle.evaluate(event.action);

          if (result.success) {
              this.ui.appendOutput(result.feedback, 'success');
              audioManager.playSFX('repair_success');
              
              // Apply immutable repair state swap
              this.shipState = applyRepair(this.shipState, this.activeSystem);

              // Dialogue success logic
              const successLine = getDialogue(crewName, 5); // Assumed success bounds
              if (successLine) this.portrait.showDialogue(successLine);

              // Completion Transition
              this.ui.appendOutput('SYSTEM REPAIRED', 'success');
              
              this.time.delayedCall(2000, () => {
                 this.checkGlobalWinCondition();
              });
              
          } else {
              this.ui.appendOutput(result.feedback, 'error');
              audioManager.playSFX('repair_fail');
              
              const failLine = getDialogue(crewName, 3); // Assumed fail bounds
              if (failLine) this.portrait.showDialogue(failLine);
          }
          
          this.ui.clearInput();
      });
  }

  private checkGlobalWinCondition(): void {
      // Are all systems repaired? (Checking locally in phase 3)
      let allGood = true;
      for (const sys in this.shipState.systems) {
         if (!this.shipState.systems[sys as SystemName]?.isRepaired) {
            allGood = false;
         }
      }

      if (allGood) {
          this.scene.start('VictoryScene');
      } else {
          this.scene.start('SystemMapScene');
      }
  }

  update(): void { /* Idle loop */ }
}
