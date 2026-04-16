import { describe, it, expect } from 'vitest';
import { parseCommand, sanitize } from './CommandParser';
describe('CommandParser', () => {
    describe('sanitize', () => {
        it('should strip HTML tags', () => {
            expect(sanitize('mv <script>alert(1)</script> cola.txt')).toBe('mv scriptalert(1)/script cola.txt');
            expect(sanitize('<b>ls</b>')).toBe('bls/b');
        });
        it('should strip zero-width characters', () => {
            expect(sanitize('ls\u200B')).toBe('ls');
        });
    });
    describe('parseCommand', () => {
        it('should parse valid commands with absolute paths', () => {
            const result = parseCommand('mv cola_barrel_1 /engine/slot_1');
            expect(result.command).toBe('mv');
            expect(result.args).toEqual(['cola_barrel_1', '/engine/slot_1']);
            expect(result.rawInput).toBe('mv cola_barrel_1 /engine/slot_1');
        });
        it('should handle single strings', () => {
            const result = parseCommand('ls');
            expect(result.command).toBe('ls');
            expect(result.args).toEqual([]);
        });
        it('should handle empty input', () => {
            const result = parseCommand('   ');
            expect(result.command).toBe('');
            expect(result.args).toEqual([]);
        });
        it('should handle missing args gracefully', () => {
            const result = parseCommand('chmod');
            expect(result.command).toBe('chmod');
            expect(result.args).toEqual([]);
        });
        it('should preserve strings enclosed in quotes', () => {
            const result = parseCommand('git commit -m "fixed engine"');
            expect(result.command).toBe('git');
            expect(result.args).toEqual(['commit', '-m', 'fixed engine']);
        });
        it('should handle trailing spaces', () => {
            const result = parseCommand('grep "storm"    ');
            expect(result.command).toBe('grep');
            expect(result.args).toEqual(['storm']);
        });
        it('should handle malicious injection input safely', () => {
            const result = parseCommand('sed -i <img src=x onerror=crash()>');
            expect(result.command).toBe('sed');
            expect(result.args).toEqual(['-i', 'img', 'src=x', 'onerror=crash()']);
        });
    });
});
