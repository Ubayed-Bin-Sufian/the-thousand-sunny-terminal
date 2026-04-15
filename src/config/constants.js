// Sole Responsibility: Centralised storage of static, immutable game-wide constants and configuration values.
export const GAME_CONSTANTS = {
    VERSION: '0.1.0',
    DEFAULT_SCORE: 10000,
    TIME_PENALTY_MULTIPLIER: 2,
    COMMAND_PENALTY_MULTIPLIER: 10,
    MAX_HEALTH: 100,
    CRITICAL_HEALTH_THRESHOLD: 20,
};
export const SYSTEM_NAMES = [
    'engine_room',
    'navigation',
    'weapon_bay',
    'medical_bay',
    'library',
    'kitchen',
];
export const VALID_COMMANDS = [
    'mv',
    'chmod',
    'grep',
    'sed',
    'ls',
    'find',
    'sort',
    'cat',
    'diff',
    'export',
    'env',
    'git',
    './synthesize_fuel.sh'
];
