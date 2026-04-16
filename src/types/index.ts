// Sole Responsibility: Single source of truth for all shared TypeScript interfaces and type aliases across the game architecture.

export type SystemName =
  | 'engine_room'
  | 'navigation'
  | 'weapon_bay'
  | 'medical_bay'
  | 'library'
  | 'kitchen';

export type CrewMember = 'luffy' | 'nami' | 'usopp' | 'chopper' | 'robin' | 'sanji' | 'franky';

export interface ShipState {
  readonly systems: Record<SystemName, SystemStatus>;
  readonly activeSystem: SystemName | null;
  readonly crewDialogue: DialogueLine | null;
}

export interface SystemStatus {
  readonly health: number;        // 0–100
  readonly isRepaired: boolean;
  readonly assignedCrew: CrewMember;
}

export interface GameAction {
  readonly command: string;       // e.g. "mv", "chmod", "grep"
  readonly args: readonly string[];
  readonly rawInput: string;
}

export interface PuzzleResult {
  readonly success: boolean;
  readonly feedback: string;      // shown in terminal output
  readonly crewReaction?: string; // optional dialogue trigger key
}

export interface DialogueLine {
  readonly crew: CrewMember;
  readonly text: string;
  readonly emotion: 'neutral' | 'angry' | 'happy' | 'worried';
}

export interface LeaderboardEntry {
  readonly playerName: string;
  readonly score: number;
  readonly timeSeconds: number;
  readonly commandCount: number;
  readonly submittedAt: string;   // ISO 8601
}

export interface CommandEvent {
  readonly action: GameAction;
  readonly timestamp: number;
}
