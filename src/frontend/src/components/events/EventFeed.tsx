import { Event } from '../../backend';
import ScoreboardShell from '../scoreboard/ScoreboardShell';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flag, Trophy } from 'lucide-react';

interface EventFeedProps {
  events: Event[];
  sessionCode?: string;
}

export default function EventFeed({ events }: EventFeedProps) {
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <ScoreboardShell title="Game Events" icon={<Trophy className="h-5 w-5" />}>
      <ScrollArea className="h-[500px] pr-4">
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No events yet</p>
            <p className="text-sm mt-2">Events will appear here as they happen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="mt-1">
                  {event.eventType === 'flag' ? (
                    <Flag className="h-5 w-5 text-destructive" />
                  ) : (
                    <Trophy className="h-5 w-5 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{event.description}</p>
                  <p className="text-sm text-muted-foreground scoreboard-text">
                    {formatTime(event.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </ScoreboardShell>
  );
}
