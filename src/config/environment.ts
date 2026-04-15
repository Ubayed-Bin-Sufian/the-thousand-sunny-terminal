class MissingEnvVarError extends Error {
  constructor(varName: string) {
    super(`⚓ [Nami] CRITICAL: Missing env var "${varName}". Check your .env file.`);
  }
}

const requireEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new MissingEnvVarError(key);
  return value;
};

export const ENV = {
  GITHUB_PAT:        requireEnv('VITE_GITHUB_PAT'),
  LEADERBOARD_REPO:  requireEnv('VITE_LEADERBOARD_REPO'),
  GAME_ENV:          import.meta.env['VITE_GAME_ENV'] ?? 'development',
} as const;
