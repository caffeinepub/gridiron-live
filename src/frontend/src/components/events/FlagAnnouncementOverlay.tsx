import { FlagEvent } from '../../backend';
import { Flag } from 'lucide-react';

interface FlagAnnouncementOverlayProps {
  flagEvent: FlagEvent;
}

export default function FlagAnnouncementOverlay({ flagEvent }: FlagAnnouncementOverlayProps) {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 max-w-md w-full mx-4">
      <div className="bg-destructive/95 backdrop-blur-md border-2 border-destructive rounded-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-white/20 flex-shrink-0">
            <Flag className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white mb-2 scoreboard-text">
              FLAG - {flagEvent.team}
            </p>
            <p className="text-lg text-white/90">
              {flagEvent.reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
