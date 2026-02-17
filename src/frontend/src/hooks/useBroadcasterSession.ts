import { useState, useCallback } from 'react';
import { useStartSession, useEndSession, useSetTeamIcons } from './useQueries';
import { TeamIcon } from '../backend';

export type BroadcastStatus = 'idle' | 'starting' | 'live' | 'ending' | 'ended';

export function useBroadcasterSession() {
  const [status, setStatus] = useState<BroadcastStatus>('idle');
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const startSessionMutation = useStartSession();
  const endSessionMutation = useEndSession();
  const setTeamIconsMutation = useSetTeamIcons();

  const generateSessionCode = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }, []);

  const startSession = useCallback(
    async (broadcasterName: string, team1Icon: TeamIcon, team2Icon: TeamIcon) => {
      setStatus('starting');
      const code = generateSessionCode();
      try {
        await startSessionMutation.mutateAsync({
          broadcaster: broadcasterName,
          sessionCode: code,
        });
        await setTeamIconsMutation.mutateAsync({
          sessionCode: code,
          team1Icon,
          team2Icon,
        });
        setSessionCode(code);
        setStatus('live');
        return code;
      } catch (error) {
        console.error('Failed to start session:', error);
        setStatus('idle');
        throw error;
      }
    },
    [startSessionMutation, setTeamIconsMutation, generateSessionCode]
  );

  const endSession = useCallback(async () => {
    if (!sessionCode) return;
    setStatus('ending');
    try {
      await endSessionMutation.mutateAsync(sessionCode);
      setStatus('ended');
    } catch (error) {
      console.error('Failed to end session:', error);
      setStatus('live');
      throw error;
    }
  }, [sessionCode, endSessionMutation]);

  return {
    status,
    sessionCode,
    startSession,
    endSession,
    isLive: status === 'live',
    isIdle: status === 'idle',
  };
}
