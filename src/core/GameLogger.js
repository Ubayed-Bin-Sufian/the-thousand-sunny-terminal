// Sole Responsibility: Emits structured JSON logs tagged by CrewMember for standardized game audibility.
const emit = (level, crew, msg) => {
    const entry = { level, crew, msg, ts: Date.now() };
    console[level](JSON.stringify(entry));
};
export const GameLogger = {
    info: (crew, msg) => emit('info', crew, msg),
    warn: (crew, msg) => emit('warn', crew, msg),
    error: (crew, msg) => emit('error', crew, msg),
};
