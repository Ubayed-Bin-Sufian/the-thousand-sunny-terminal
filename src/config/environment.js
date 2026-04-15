// Sole Responsibility: Validates and exports environment variables on startup, throwing errors if required variables are missing.
export class MissingEnvVarError extends Error {
    constructor(varName) {
        super(`⚓ [Nami] CRITICAL: Missing env var "${varName}". Check your .env file.`);
        this.name = 'MissingEnvVarError';
    }
}
const requireEnv = (key) => {
    const value = import.meta.env[key];
    if (!value || typeof value !== 'string') {
        throw new MissingEnvVarError(key);
    }
    return value;
};
export const ENV = {
    GITHUB_PAT: requireEnv('VITE_GITHUB_PAT'),
    LEADERBOARD_REPO: requireEnv('VITE_LEADERBOARD_REPO'),
    GAME_ENV: import.meta.env['VITE_GAME_ENV'] ?? 'development',
};
