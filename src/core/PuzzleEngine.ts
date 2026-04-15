// Sole Responsibility: Defines the Puzzle interface and evaluating individual puzzle logic, without rendering.

import { GameAction, PuzzleResult } from '../types';

export interface Puzzle {
  evaluate(action: GameAction): PuzzleResult;
}

export class EngineRoomPuzzle implements Puzzle {
  // State to track progress - must move 3 barrels to 3 slots
  private barrelsInSlots = {
    slot_1: false,
    slot_2: false,
    slot_3: false,
  };

  public evaluate(action: GameAction): PuzzleResult {
    // Only care about 'mv' command
    if (action.command !== 'mv') {
      return { 
        success: false, 
        feedback: 'bash: command not found or not helpful here.',
        crewReaction: 'luffy_fail_wrong_command'
      };
    }

    if (action.args.length !== 2) {
      return { 
        success: false, 
        feedback: 'mv: missing file operand. Try: mv <source> <destination>',
        crewReaction: 'luffy_fail_bad_args'
      };
    }

    const source = action.args[0] as string;
    const dest = action.args[1] as string;

    const sourceRegex = /^cola_barrel_([1-3])$/;
    const destRegex = /^\/engine\/slot_([1-3])$/;

    const srcMatch = source.match(sourceRegex);
    const destMatch = dest.match(destRegex);

    if (!srcMatch) {
      return { 
        success: false, 
        feedback: `mv: cannot stat '${source}': No such file or directory`,
        crewReaction: 'luffy_fail_bad_source'
      };
    }

    if (!destMatch) {
      return { 
        success: false, 
        feedback: `mv: cannot create regular file '${dest}': Not a valid engine slot directory`,
        crewReaction: 'luffy_fail_bad_dest'
      };
    }

    const srcId = srcMatch[1];
    const destId = destMatch[1];

    if (srcId !== destId) {
       return {
         success: false,
         feedback: `mv: barrel ${srcId} does not fit in slot ${destId}. Focus!`,
         crewReaction: 'luffy_fail_wrong_slot'
       };
    }

    // Success moving a single barrel
    this.barrelsInSlots[`slot_${srcId}` as keyof typeof this.barrelsInSlots] = true;

    // Check Win Condition
    const allRepaired = this.barrelsInSlots.slot_1 && this.barrelsInSlots.slot_2 && this.barrelsInSlots.slot_3;

    if (allRepaired) {
      return {
        success: true,
        feedback: 'All 3 barrels moved. Engine sequence nominal. COLA POWER RESTORED!',
        crewReaction: 'luffy_success'
      };
    } else {
      // Partial success
      return {
        success: false, // still not completed the whole room
        feedback: `Barrel ${srcId} locked into slot ${destId}. Keep going!`,
        crewReaction: 'luffy_hint'
      };
    }
  }
}
