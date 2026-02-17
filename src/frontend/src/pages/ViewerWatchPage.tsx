import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetSessionMetadata, useGetEvents, useGetScoreboard, useGetActiveFlagOverlays } from '../hooks/useQueries';
import { useSessionLifecycle } from '../hooks/useSessionLifecycle';
import ViewerVideoPlayer from '../components/viewer/ViewerVideoPlayer';
import EventFeed from '../components/events/EventFeed';
import LatestEventOverlay from '../components/events/LatestEventOverlay';
import OnCameraScoreboardOverlay from '../components/scoreboard/OnCameraScoreboardOverlay';
import FlagAnnouncementOverlay from '../components/events/FlagAnnouncementOverlay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSessionCode } from '../hooks/useSessionCode';

export default function ViewerWatchPage() {
  const { sessionCode } = useParams({ from: '/watch/$sessionCode' });
  const navigate = useNavigate();
  const { clearSessionCode } = useSessionCode();

  const { data: metadata, isLoading: metadataLoading } = useGetSessionMetadata(sessionCode);
  const { data: events = [] } = useGetEvents(sessionCode);
  const { data: scoreboard } = useGetScoreboard(sessionCode);
  const { data: flagOverlays = [] } = useGetActiveFlagOverlays(sessionCode);
  const lifecycleState = useSessionLifecycle(metadata, metadataLoading);

  const handleLeave = () => {
    clearSessionCode();
    navigate({ to: '/' });
  };

  const latestEvent = events.length > 0 ? events[events.length - 1] : null;
  const activeFlagOverlay = flagOverlays.length > 0 ? flagOverlays[flagOverlays.length - 1] : null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <Button variant="ghost" onClick={handleLeave}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Leave Session
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ViewerVideoPlayer
            sessionCode={sessionCode}
            lifecycleState={lifecycleState}
            broadcaster={metadata?.broadcaster}
          >
            {latestEvent && <LatestEventOverlay event={latestEvent} />}
            {activeFlagOverlay && <FlagAnnouncementOverlay flagEvent={activeFlagOverlay} />}
            {scoreboard && <OnCameraScoreboardOverlay scoreboard={scoreboard} />}
          </ViewerVideoPlayer>
        </div>

        <div className="lg:col-span-1">
          <EventFeed events={events} sessionCode={sessionCode} />
        </div>
      </div>
    </div>
  );
}
