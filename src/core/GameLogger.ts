// Sole Responsibility: Emits structured JSON logs tagged by CrewMember for standardized game audibility.

import { CrewMember } from '../types';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  crew: CrewMember;
  msg: string;
  ts: number;
}

const emit = (level: LogLevel, crew: CrewMember, msg: string): void => {
  const entry: LogEntry = { level, crew, msg, ts: Date.now() };
  console[level](JSON.stringify(entry));
};

export const GameLogger = {
  info:  (crew: CrewMember, msg: string): void => emit('info',  crew, msg),
  warn:  (crew: CrewMember, msg: string): void => emit('warn',  crew, msg),
  error: (crew: CrewMember, msg: string): void => emit('error', crew, msg),
};
