import { useState } from 'react';
import { TeamIcon } from '../backend';

export interface UseBroadcasterSessionReturn {
  status: 'idle' | 'starting' | 'live' | 'ending';
  sessionCode: string | null;
  startSession: (broadcasterName: string, team1Icon: TeamIcon, team2Icon: TeamIcon) => Promise<void>;
  endSession: () => Promise<void>;
  isLive: boolean;
  isIdle: boolean;
}

export function useBroadcasterSession(): UseBroadcasterSessionReturn {
  const [status, setStatus] = useState<'idle' | 'starting' | 'live' | 'ending'>('idle');
  const [sessionCode] = useState<string | null>(null);

  const startSession = async (
    broadcasterName: string,
    team1Icon: TeamIcon,
    team2Icon: TeamIcon
  ): Promise<void> => {
    setStatus('starting');
    // Simulate session start for local recording
    await new Promise(resolve => setTimeout(resolve, 500));
    setStatus('live');
  };

  const endSession = async (): Promise<void> => {
    setStatus('ending');
    await new Promise(resolve => setTimeout(resolve, 500));
    setStatus('idle');
  };

  return {
    status,
    sessionCode,
    startSession,
    endSession,
    isLive: status === 'live',
    isIdle: status === 'idle',
  };
}
