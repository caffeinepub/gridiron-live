import { useState, useEffect } from 'react';

const SESSION_CODE_KEY = 'gridiron-session-code';

export function useSessionCode() {
  const [sessionCode, setSessionCodeState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SESSION_CODE_KEY);
    }
    return null;
  });

  const setSessionCode = (code: string | null) => {
    setSessionCodeState(code);
    if (code) {
      localStorage.setItem(SESSION_CODE_KEY, code);
    } else {
      localStorage.removeItem(SESSION_CODE_KEY);
    }
  };

  const clearSessionCode = () => {
    setSessionCode(null);
  };

  return { sessionCode, setSessionCode, clearSessionCode };
}
