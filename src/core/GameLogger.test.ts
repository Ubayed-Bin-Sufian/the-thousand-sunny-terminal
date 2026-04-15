import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameLogger } from './GameLogger';

describe('GameLogger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should log info payload properly formatted as JSON', () => {
    GameLogger.info('luffy', 'Engine room restored!');
    expect(console.info).toHaveBeenCalledOnce();
    const mockCall = vi.mocked(console.info).mock.calls[0];
    const loggedStr = mockCall?.[0];
    
    expect(loggedStr).toBeTypeOf('string');
    const parsed = JSON.parse(loggedStr as string);
    
    expect(parsed).toEqual({
      level: 'info',
      crew: 'luffy',
      msg: 'Engine room restored!',
      ts: 1776211200000
    });
  });

  it('should log warn payload correctly', () => {
    GameLogger.warn('nami', 'Weather logs corrupt!');
    expect(console.warn).toHaveBeenCalledOnce();
    const loggedStr = vi.mocked(console.warn).mock.calls[0]?.[0];
    const parsed = JSON.parse(loggedStr as string);
    expect(parsed.level).toBe('warn');
    expect(parsed.crew).toBe('nami');
  });

  it('should log error payload correctly', () => {
    GameLogger.error('chopper', 'Critical damage!');
    expect(console.error).toHaveBeenCalledOnce();
    const loggedStr = vi.mocked(console.error).mock.calls[0]?.[0];
    const parsed = JSON.parse(loggedStr as string);
    expect(parsed.level).toBe('error');
    expect(parsed.crew).toBe('chopper');
  });
});
