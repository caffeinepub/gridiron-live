import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Event, Scoreboard, TeamIcon, TeamRole, EventType, Caption } from '../backend';

export function useGetSessionMetadata(sessionCode: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<{ broadcaster: string; startTime: bigint; endTime: bigint | null }>({
    queryKey: ['sessionMetadata', sessionCode],
    queryFn: async () => {
      if (!actor || !sessionCode) throw new Error('Actor or session code not available');
      const [broadcaster, startTime, endTime] = await actor.getSessionMetadata(sessionCode);
      return { broadcaster, startTime, endTime };
    },
    enabled: !!actor && !isFetching && !!sessionCode,
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
    refetchInterval: 2000,
  });
}

export function useGetScoreboard(sessionCode: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Scoreboard>({
    queryKey: ['scoreboard', sessionCode],
    queryFn: async () => {
      if (!actor || !sessionCode) throw new Error('Actor or session code not available');
      return actor.getScoreboard(sessionCode);
    },
    enabled: !!actor && !isFetching && !!sessionCode,
    refetchInterval: 2000,
  });
}

export function useGetFlagEvents(sessionCode: string | undefined) {
  const { data: events = [] } = useGetEvents(sessionCode);
  return events
    .filter(event => event.eventType === EventType.flag && event.flagEvent)
    .map(event => event.flagEvent!);
}

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ broadcaster, sessionCode }: { broadcaster: string; sessionCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startSession(broadcaster, sessionCode);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessionMetadata', variables.sessionCode] });
    },
  });
}

export function useSetTeamIcons() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionCode, team1Icon, team2Icon }: { sessionCode: string; team1Icon: TeamIcon; team2Icon: TeamIcon }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setTeamIcons(sessionCode, team1Icon, team2Icon);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scoreboard', variables.sessionCode] });
    },
  });
}

export function useEndSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionCode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.endSession(sessionCode);
    },
    onSuccess: (_, sessionCode) => {
      queryClient.invalidateQueries({ queryKey: ['sessionMetadata', sessionCode] });
    },
  });
}

export function useAddEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionCode, description, eventType }: { sessionCode: string; description: string; eventType: EventType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEvent(sessionCode, description, eventType);
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
    mutationFn: async ({ sessionCode, team, reason }: { sessionCode: string; team: string; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFlagEvent(sessionCode, team, reason);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.sessionCode] });
    },
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
      team1Role, 
      team2Role 
    }: { 
      sessionCode: string; 
      team1Score: bigint; 
      team2Score: bigint; 
      team1Role: TeamRole; 
      team2Role: TeamRole;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateScoreboard(sessionCode, team1Score, team2Score, team1Role, team2Role);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scoreboard', variables.sessionCode] });
    },
  });
}

export function useIsValidSessionCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (sessionCode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.isValidSessionCode(sessionCode);
    },
  });
}

// Caption mutations and queries
export function usePublishCaption() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ sessionCode, text }: { sessionCode: string; text: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCaption(sessionCode, text);
    },
  });
}

export function useGetLatestCaption(sessionCode: string | undefined, enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<Caption | null>({
    queryKey: ['latestCaption', sessionCode],
    queryFn: async () => {
      if (!actor || !sessionCode) return null;
      try {
        return await actor.getLatestCaption(sessionCode);
      } catch (error) {
        // Return null if no captions exist yet
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!sessionCode && enabled,
    refetchInterval: enabled ? 1000 : false,
  });
}
