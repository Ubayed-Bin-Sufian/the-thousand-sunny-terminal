// Sole Responsibility: Captures keyboard input, manages command history state, and emits typed CommandEvents.

import { GameAction, CommandEvent } from '../types';
import { parseCommand } from './CommandParser';

type CommandSubscriber = (event: CommandEvent) => void;

export class TerminalController {
  private inputBuffer: string = '';
  private history: string[] = [];
  private historyIndex: number = -1;
  private readonly subscribers: Set<CommandSubscriber> = new Set();
  
  /**
   * For the DOM-agnostic design, this accepts raw string characters or keys 
   * and manages the internal buffer state independently of how they are captured.
   * Special keys supported: 'Enter', 'Backspace', 'ArrowUp', 'ArrowDown'
   */
  public handleKeyInput(key: string): void {
    if (key === 'Enter') {
      this.submitCommand();
    } else if (key === 'Backspace') {
      this.inputBuffer = this.inputBuffer.slice(0, -1);
    } else if (key === 'ArrowUp') {
      this.navigateHistory('up');
    } else if (key === 'ArrowDown') {
      this.navigateHistory('down');
    } else if (key.length === 1) { // Printable characters
      this.inputBuffer += key;
    }
  }

  public getBuffer(): string {
    return this.inputBuffer;
  }

  public subscribe(callback: CommandSubscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private submitCommand(): void {
    const rawInput = this.inputBuffer.trim();
    if (rawInput !== '') {
      this.history.push(rawInput);
    }
    // reset history navigation index
    this.historyIndex = this.history.length;
    
    const action: GameAction = parseCommand(this.inputBuffer);
    const event: CommandEvent = { action, timestamp: Date.now() };
    
    this.subscribers.forEach(sub => sub(event));
    
    this.inputBuffer = '';
  }

  private navigateHistory(direction: 'up' | 'down'): void {
    if (this.history.length === 0) return;

    if (direction === 'up') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        const val = this.history[this.historyIndex];
        if (val !== undefined) {
           this.inputBuffer = val;
        }
      }
    } else { // 'down'
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        const val = this.history[this.historyIndex];
        if (val !== undefined) {
           this.inputBuffer = val;
        }
      } else {
        this.historyIndex = this.history.length;
        this.inputBuffer = '';
      }
    }
  }
}
