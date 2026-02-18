import { useState, useEffect, useRef } from 'react';
import { TeamIcon } from '../backend';

interface UseCelebrationOverlayReturn {
  activeTeamIcon: TeamIcon | null;
  isVisible: boolean;
  triggerCelebration: (teamIcon: TeamIcon) => void;
  clearCelebration: () => void;
}

export function useCelebrationOverlay(): UseCelebrationOverlayReturn {
  const [activeTeamIcon, setActiveTeamIcon] = useState<TeamIcon | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearCelebration = () => {
    setIsVisible(false);
    setActiveTeamIcon(null);
  };

  const triggerCelebration = (teamIcon: TeamIcon) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new celebration
    setActiveTeamIcon(teamIcon);
    setIsVisible(true);

    // Auto-dismiss after 8 seconds
    timerRef.current = setTimeout(() => {
      clearCelebration();
    }, 8000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    activeTeamIcon,
    isVisible,
    triggerCelebration,
    clearCelebration,
  };
}
