import { useMemo } from 'react';

export type SessionLifecycleState = 'waiting' | 'live' | 'ended' | 'unknown';

export function useSessionLifecycle(
  metadata: { endTime: bigint | null } | undefined,
  isLoading: boolean
): SessionLifecycleState {
  return useMemo(() => {
    if (isLoading) return 'unknown';
    if (!metadata) return 'waiting';
    if (metadata.endTime !== null) return 'ended';
    return 'live';
  }, [metadata, isLoading]);
}
