import { useEffect, useState, useRef } from 'react';
import type { FlagEvent } from '../backend';

interface UseTimedFlagOverlayOptions {
  sessionCode: string;
  flagEvents: FlagEvent[];
  displayDuration?: number; // milliseconds
}

interface TimedFlagOverlay {
  flagEvent: FlagEvent;
  side: 'left' | 'right';
}

/**
 * Hook that manages timed display of flag overlays.
 * Shows the latest unseen flag for ~3 seconds, then dismisses it.
 * Tracks seen flags in memory and sessionStorage to prevent reappearance.
 */
export function useTimedFlagOverlay({
  sessionCode,
  flagEvents,
  displayDuration = 3000,
}: UseTimedFlagOverlayOptions): TimedFlagOverlay | null {
  const [currentOverlay, setCurrentOverlay] = useState<TimedFlagOverlay | null>(null);
  const seenFlagsRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load seen flags from sessionStorage on mount
  useEffect(() => {
    const storageKey = `seen-flags-${sessionCode}`;
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        seenFlagsRef.current = new Set(parsed);
      } catch {
        // Ignore parse errors
      }
    }
  }, [sessionCode]);

  // Process new flag events
  useEffect(() => {
    if (flagEvents.length === 0) return;

    // Find the latest unseen flag
    const latestUnseen = [...flagEvents]
      .reverse()
      .find((flag) => {
        const flagId = `${flag.timestamp}-${flag.team}-${flag.reason}`;
        return !seenFlagsRef.current.has(flagId);
      });

    if (!latestUnseen) return;

    // Determine side based on team
    const side = latestUnseen.team === 'Team A' ? 'left' : 'right';

    // Show the overlay
    setCurrentOverlay({ flagEvent: latestUnseen, side });

    // Mark as seen
    const flagId = `${latestUnseen.timestamp}-${latestUnseen.team}-${latestUnseen.reason}`;
    seenFlagsRef.current.add(flagId);

    // Persist to sessionStorage
    const storageKey = `seen-flags-${sessionCode}`;
    sessionStorage.setItem(storageKey, JSON.stringify([...seenFlagsRef.current]));

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Auto-dismiss after duration
    timeoutRef.current = setTimeout(() => {
      setCurrentOverlay(null);
      timeoutRef.current = null;
    }, displayDuration);
  }, [flagEvents, displayDuration, sessionCode]);

  // Cleanup timeout only on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return currentOverlay;
}
