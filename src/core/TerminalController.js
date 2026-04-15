// Sole Responsibility: Captures keyboard input, manages command history state, and emits typed CommandEvents.
import { parseCommand } from './CommandParser';
export class TerminalController {
    constructor() {
        this.inputBuffer = '';
        this.history = [];
        this.historyIndex = -1;
        this.subscribers = new Set();
    }
    /**
     * For the DOM-agnostic design, this accepts raw string characters or keys
     * and manages the internal buffer state independently of how they are captured.
     * Special keys supported: 'Enter', 'Backspace', 'ArrowUp', 'ArrowDown'
     */
    handleKeyInput(key) {
        if (key === 'Enter') {
            this.submitCommand();
        }
        else if (key === 'Backspace') {
            this.inputBuffer = this.inputBuffer.slice(0, -1);
        }
        else if (key === 'ArrowUp') {
            this.navigateHistory('up');
        }
        else if (key === 'ArrowDown') {
            this.navigateHistory('down');
        }
        else if (key.length === 1) { // Printable characters
            this.inputBuffer += key;
        }
    }
    getBuffer() {
        return this.inputBuffer;
    }
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    submitCommand() {
        const rawInput = this.inputBuffer.trim();
        if (rawInput !== '') {
            this.history.push(rawInput);
        }
        // reset history navigation index
        this.historyIndex = this.history.length;
        const action = parseCommand(this.inputBuffer);
        const event = { action, timestamp: Date.now() };
        this.subscribers.forEach(sub => sub(event));
        this.inputBuffer = '';
    }
    navigateHistory(direction) {
        if (this.history.length === 0)
            return;
        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                const val = this.history[this.historyIndex];
                if (val !== undefined) {
                    this.inputBuffer = val;
                }
            }
        }
        else { // 'down'
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                const val = this.history[this.historyIndex];
                if (val !== undefined) {
                    this.inputBuffer = val;
                }
            }
            else {
                this.historyIndex = this.history.length;
                this.inputBuffer = '';
            }
        }
    }
}
