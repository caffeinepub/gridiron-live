import { Event } from '../../backend';
import { Flag, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LatestEventOverlayProps {
  event: Event;
}

export default function LatestEventOverlay({ event }: LatestEventOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [event]);

  if (!visible) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 max-w-md w-full mx-4">
      <div className="bg-accent/95 backdrop-blur-md border-2 border-accent rounded-lg p-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-white/20 flex-shrink-0">
            {event.eventType === 'flag' ? (
              <Flag className="h-6 w-6 text-white" />
            ) : (
              <Trophy className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-white scoreboard-text">{event.description}</p>
            <p className="text-xs text-white/80">Latest Event</p>
          </div>
        </div>
      </div>
    </div>
  );
}
