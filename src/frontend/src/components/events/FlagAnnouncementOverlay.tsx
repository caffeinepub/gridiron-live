import { FlagEvent } from '../../backend';
import { Flag } from 'lucide-react';

interface FlagAnnouncementOverlayProps {
  flagEvent: FlagEvent;
  side: 'left' | 'right';
}

export default function FlagAnnouncementOverlay({ flagEvent, side }: FlagAnnouncementOverlayProps) {
  const positionClasses = side === 'left' 
    ? 'left-4 sm:left-8' 
    : 'right-4 sm:right-8';

  return (
    <div className={`absolute top-1/2 transform -translate-y-1/2 z-20 max-w-xs sm:max-w-sm ${positionClasses}`}>
      <div className="bg-destructive/95 backdrop-blur-md border-2 border-destructive rounded-lg p-4 sm:p-5 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-white/20 flex-shrink-0">
            <Flag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 scoreboard-text">
              FLAG - {flagEvent.team}
            </p>
            <p className="text-base sm:text-lg text-white/90 break-words">
              {flagEvent.reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
