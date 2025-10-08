// Session persistence utilities for storing game session info
interface GameSession {
  roomCode: string;
  playerName: string;
  gameId: string;
  playerId: string;
}

const SESSION_KEY = 'feedthekraken_session';

export const saveSession = (session: GameSession): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

export const loadSession = (): GameSession | null => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      return JSON.parse(stored) as GameSession;
    }
  } catch (error) {
    console.error('Failed to load session:', error);
  }
  return null;
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};
