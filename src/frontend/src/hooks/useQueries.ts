import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { EventType, type Event, type Scoreboard, type TeamIcon, type FlagEvent } from '../backend';

export function useValidateSessionCode(sessionCode: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['session-valid', sessionCode],
    queryFn: async () => {
      if (!actor || !sessionCode) return false;
      return actor.isValidSessionCode(sessionCode);
    },
    enabled: !!actor && !isFetching && !!sessionCode,
    staleTime: 30000,
  });
}

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ broadcaster, sessionCode }: { broadcaster: string; sessionCode: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.startSession(broadcaster, sessionCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-valid'] });
    },
  });
}

export function useEndSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionCode: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.endSession(sessionCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-metadata'] });
    },
  });
}

export function useAddEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionCode,
      description,
      eventType,
    }: {
      sessionCode: string;
      description: string;
      eventType: EventType;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addEvent(sessionCode, description, eventType);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.sessionCode] });
    },
  });
}

export function useAddFlagEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionCode,
      team,
      reason,
    }: {
      sessionCode: string;
      team: string;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addFlagEvent(sessionCode, team, reason);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.sessionCode] });
      queryClient.invalidateQueries({ queryKey: ['flag-overlays', variables.sessionCode] });
    },
  });
}

export function useGetEvents(sessionCode: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events', sessionCode],
    queryFn: async () => {
      if (!actor || !sessionCode) return [];
      return actor.getEvents(sessionCode);
    },
    enabled: !!actor && !isFetching && !!sessionCode,
    refetchInterval: 3000,
  });
}

export function useGetSessionMetadata(sessionCode: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<{ broadcaster: string; startTime: bigint; endTime: bigint | null }>({
    queryKey: ['session-metadata', sessionCode],
    queryFn: async () => {
      if (!actor || !sessionCode) throw new Error('Session code required');
      const [broadcaster, startTime, endTime] = await actor.getSessionMetadata(sessionCode);
      return { broadcaster, startTime, endTime };
    },
    enabled: !!actor && !isFetching && !!sessionCode,
    refetchInterval: 5000,
  });
}

export function useGetScoreboard(sessionCode: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Scoreboard>({
    queryKey: ['scoreboard', sessionCode],
    queryFn: async () => {
      if (!actor || !sessionCode) throw new Error('Session code required');
      return actor.getScoreboard(sessionCode);
    },
    enabled: !!actor && !isFetching && !!sessionCode,
    refetchInterval: 3000,
  });
}

export function useUpdateScoreboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionCode,
      team1Score,
      team2Score,
      team1Icon,
      team2Icon,
    }: {
      sessionCode: string;
      team1Score: bigint;
      team2Score: bigint;
      team1Icon: TeamIcon;
      team2Icon: TeamIcon;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateScoreboard(sessionCode, team1Score, team2Score, team1Icon, team2Icon);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scoreboard', variables.sessionCode] });
    },
  });
}

export function useGetActiveFlagOverlays(sessionCode: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<FlagEvent[]>({
    queryKey: ['flag-overlays', sessionCode],
    queryFn: async () => {
      if (!actor || !sessionCode) return [];
      return actor.getActiveFlagOverlays(sessionCode);
    },
    enabled: !!actor && !isFetching && !!sessionCode,
    refetchInterval: 2000,
  });
}

export function useClearFlagOverlays() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionCode: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.clearFlagOverlays(sessionCode);
    },
    onSuccess: (_, sessionCode) => {
      queryClient.invalidateQueries({ queryKey: ['flag-overlays', sessionCode] });
    },
  });
}
