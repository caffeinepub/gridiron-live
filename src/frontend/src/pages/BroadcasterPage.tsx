import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Video, VideoOff } from 'lucide-react';
import { useBroadcasterSession } from '../hooks/useBroadcasterSession';
import { useCamera } from '../camera/useCamera';
import SessionCodeCard from '../components/broadcast/SessionCodeCard';
import FootballControlPanel from '../components/broadcast/FootballControlPanel';
import ScoreboardControls from '../components/broadcast/ScoreboardControls';
import PermissionsHelp from '../components/broadcast/PermissionsHelp';
import UnsupportedState from '../components/system/UnsupportedState';
import EventFeed from '../components/events/EventFeed';
import OnCameraScoreboardOverlay from '../components/scoreboard/OnCameraScoreboardOverlay';
import FlagAnnouncementOverlay from '../components/events/FlagAnnouncementOverlay';
import { useGetEvents, useGetScoreboard, useGetActiveFlagOverlays } from '../hooks/useQueries';

export default function BroadcasterPage() {
  const navigate = useNavigate();
  const [broadcasterName, setBroadcasterName] = useState('');
  const { status, sessionCode, startSession, endSession, isLive, isIdle } = useBroadcasterSession();
  const { data: events = [] } = useGetEvents(sessionCode || undefined);
  const { data: scoreboard } = useGetScoreboard(sessionCode || undefined);
  const { data: flagOverlays = [] } = useGetActiveFlagOverlays(sessionCode || undefined);

  const {
    isActive: cameraActive,
    isSupported: cameraSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1280,
    height: 720,
  });

  useEffect(() => {
    if (isLive && !cameraActive && !cameraLoading) {
      startCamera();
    }
  }, [isLive, cameraActive, cameraLoading, startCamera]);

  const handleStartBroadcast = async () => {
    if (!broadcasterName.trim()) return;
    try {
      await startSession(broadcasterName.trim());
    } catch (error) {
      console.error('Failed to start broadcast:', error);
    }
  };

  const handleEndBroadcast = async () => {
    try {
      await endSession();
      await stopCamera();
    } catch (error) {
      console.error('Failed to end broadcast:', error);
    }
  };

  const activeFlagOverlay = flagOverlays.length > 0 ? flagOverlays[flagOverlays.length - 1] : null;

  if (cameraSupported === false) {
    return (
      <div className="container mx-auto px-4 py-12">
        <UnsupportedState />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {isIdle && (
        <Card className="max-w-md mx-auto border-2">
          <CardHeader>
            <CardTitle className="text-2xl scoreboard-text">Start Broadcasting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="broadcaster-name">Your Name</Label>
              <Input
                id="broadcaster-name"
                placeholder="Enter your name"
                value={broadcasterName}
                onChange={(e) => setBroadcasterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && broadcasterName.trim()) {
                    handleStartBroadcast();
                  }
                }}
              />
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={handleStartBroadcast}
              disabled={!broadcasterName.trim() || status === 'starting'}
            >
              <Video className="mr-2 h-5 w-5" />
              Start Broadcast
            </Button>
          </CardContent>
        </Card>
      )}

      {(isLive || status === 'ending') && sessionCode && (
        <div className="space-y-6">
          <SessionCodeCard sessionCode={sessionCode} />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Camera Preview</span>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                      <span className="text-sm font-normal text-destructive">LIVE</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <PermissionsHelp error={cameraError} onRetry={startCamera} />
                      </div>
                    )}
                    {activeFlagOverlay && <FlagAnnouncementOverlay flagEvent={activeFlagOverlay} />}
                    {scoreboard && <OnCameraScoreboardOverlay scoreboard={scoreboard} />}
                  </div>
                </CardContent>
              </Card>

              <FootballControlPanel sessionCode={sessionCode} disabled={!cameraActive} />

              {scoreboard && (
                <ScoreboardControls
                  sessionCode={sessionCode}
                  currentScoreboard={scoreboard}
                  disabled={!cameraActive}
                />
              )}

              <Button
                size="lg"
                variant="destructive"
                className="w-full"
                onClick={handleEndBroadcast}
                disabled={status === 'ending'}
              >
                <VideoOff className="mr-2 h-5 w-5" />
                End Broadcast
              </Button>
            </div>

            <div className="lg:col-span-1">
              <EventFeed events={events} sessionCode={sessionCode} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
