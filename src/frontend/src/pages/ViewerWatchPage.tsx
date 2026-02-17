import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetSessionMetadata, useGetEvents, useGetScoreboard, useGetFlagEvents, useGetLatestCaption } from '../hooks/useQueries';
import { useSessionLifecycle } from '../hooks/useSessionLifecycle';
import { useTimedFlagOverlay } from '../hooks/useTimedFlagOverlay';
import ViewerVideoPlayer from '../components/viewer/ViewerVideoPlayer';
import EventFeed from '../components/events/EventFeed';
import LatestEventOverlay from '../components/events/LatestEventOverlay';
import OnCameraScoreboardOverlay from '../components/scoreboard/OnCameraScoreboardOverlay';
import FlagAnnouncementOverlay from '../components/events/FlagAnnouncementOverlay';
import ViewerSubtitlesOverlay from '../components/viewer/ViewerSubtitlesOverlay';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useSessionCode } from '../hooks/useSessionCode';

export default function ViewerWatchPage() {
  const { sessionCode } = useParams({ from: '/watch/$sessionCode' });
  const navigate = useNavigate();
  const { clearSessionCode } = useSessionCode();
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

  const { data: metadata, isLoading: metadataLoading } = useGetSessionMetadata(sessionCode);
  const { data: events = [] } = useGetEvents(sessionCode);
  const { data: scoreboard } = useGetScoreboard(sessionCode);
  const flagEvents = useGetFlagEvents(sessionCode);
  const lifecycleState = useSessionLifecycle(metadata, metadataLoading);

  // Poll for broadcaster captions when subtitles are enabled
  const { data: latestCaption } = useGetLatestCaption(sessionCode, subtitlesEnabled);

  const activeFlagOverlay = useTimedFlagOverlay({
    sessionCode,
    flagEvents,
    displayDuration: 3000,
  });

  const handleSubtitlesToggle = (enabled: boolean) => {
    setSubtitlesEnabled(enabled);
  };

  const handleLeave = () => {
    clearSessionCode();
    navigate({ to: '/' });
  };

  const latestEvent = events.length > 0 ? events[events.length - 1] : null;

  // Determine if captions are unavailable (could be extended with backend status)
  const captionsUnavailable = false; // TODO: Get from backend if broadcaster reports unavailable

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" onClick={handleLeave}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Leave Session
        </Button>
        <div className="flex items-center gap-2">
          <Switch
            id="subtitles-toggle"
            checked={subtitlesEnabled}
            onCheckedChange={handleSubtitlesToggle}
          />
          <Label htmlFor="subtitles-toggle" className="cursor-pointer">
            Subtitles
          </Label>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ViewerVideoPlayer
            sessionCode={sessionCode}
            lifecycleState={lifecycleState}
            broadcaster={metadata?.broadcaster}
          >
            {latestEvent && <LatestEventOverlay event={latestEvent} />}
            {activeFlagOverlay && (
              <FlagAnnouncementOverlay 
                flagEvent={activeFlagOverlay.flagEvent} 
                side={activeFlagOverlay.side}
              />
            )}
            {scoreboard && <OnCameraScoreboardOverlay scoreboard={scoreboard} />}
            <ViewerSubtitlesOverlay
              caption={latestCaption?.text || null}
              isEnabled={subtitlesEnabled}
              captionsUnavailable={captionsUnavailable}
            />
          </ViewerVideoPlayer>
        </div>

        <div className="lg:col-span-1">
          <EventFeed events={events} sessionCode={sessionCode} />
        </div>
      </div>
    </div>
  );
}
