// Sole Responsibility: A pure function that sanitizes and tokenizes raw terminal strings into typed GameAction objects.
/**
 * Sanitizes input by removing HTML delimiters and zero-width characters to prevent simple XSS/injections.
 * Only allows basic printable ASCII/Unicode characters typical in terminal commands.
 */
export const sanitize = (input) => {
    return input
        .replace(/[<>]/g, '') // Remove HTML tag delimiters
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
        .trim();
};
/**
 * Parses a raw command string into a GameAction.
 * Handles simple quote-enclosed strings for arguments (e.g., git commit -m "my message").
 */
export const parseCommand = (rawInput) => {
    const cleanInput = sanitize(rawInput);
    if (!cleanInput) {
        return { command: '', args: [], rawInput };
    }
    // Regex to split by spaces but preserve spaces inside single/double quotes
    const matches = cleanInput.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);
    if (!matches || matches.length === 0) {
        return { command: '', args: [], rawInput };
    }
    const command = matches[0];
    const args = matches.slice(1).map(arg => {
        // Strip surrounding quotes from arguments
        if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
            if (arg.length >= 2) {
                return arg.slice(1, -1);
            }
        }
        return arg;
    });
    return { command, args, rawInput };
};
