import { useState, useEffect, useRef, useCallback } from 'react';

export type QuarterPhase = 'Q1' | 'Q2' | 'Halftime' | 'Q3' | 'Q4';

export interface QuarterTimerState {
  phase: QuarterPhase;
  timeRemaining: number; // in seconds
  isRunning: boolean;
}

export interface UseQuarterTimerReturn {
  phase: QuarterPhase;
  timeRemaining: number;
  isRunning: boolean;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  nextQuarter: () => void;
  toggleHalftime: () => void;
}

const QUARTER_DURATION = 6 * 60; // 6 minutes in seconds

export function useQuarterTimer(): UseQuarterTimerReturn {
  const [phase, setPhase] = useState<QuarterPhase>('Q1');
  const [timeRemaining, setTimeRemaining] = useState(QUARTER_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(QUARTER_DURATION);
  }, []);

  const nextQuarter = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(QUARTER_DURATION);
    
    if (phase === 'Q1') {
      setPhase('Q2');
    } else if (phase === 'Q2') {
      setPhase('Halftime');
    } else if (phase === 'Halftime') {
      setPhase('Q3');
    } else if (phase === 'Q3') {
      setPhase('Q4');
    } else if (phase === 'Q4') {
      // Stay at Q4, allow manual reset if needed
      setPhase('Q4');
    }
  }, [phase]);

  const toggleHalftime = useCallback(() => {
    if (phase === 'Halftime') {
      setPhase('Q3');
      setTimeRemaining(QUARTER_DURATION);
      setIsRunning(false);
    } else if (phase === 'Q2') {
      setPhase('Halftime');
      setTimeRemaining(QUARTER_DURATION);
      setIsRunning(false);
    }
  }, [phase]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && phase !== 'Halftime') {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, phase]);

  return {
    phase,
    timeRemaining,
    isRunning,
    formattedTime: formatTime(timeRemaining),
    start,
    pause,
    reset,
    nextQuarter,
    toggleHalftime,
  };
}
