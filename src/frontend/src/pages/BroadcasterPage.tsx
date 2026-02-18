import { useState, useEffect } from 'react';
import { useCamera } from '../camera/useCamera';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { useQuarterTimer } from '../hooks/useQuarterTimer';
import { useCelebrationOverlay } from '../hooks/useCelebrationOverlay';
import FootballLayout from '../components/layout/FootballLayout';
import RecordingControls from '../components/broadcast/RecordingControls';
import FootballControlPanel from '../components/broadcast/FootballControlPanel';
import QuarterControls from '../components/broadcast/QuarterControls';
import ScoreboardControls from '../components/broadcast/ScoreboardControls';
import EventFeed from '../components/events/EventFeed';
import LatestEventOverlay from '../components/events/LatestEventOverlay';
import OnCameraScoreboardOverlay from '../components/scoreboard/OnCameraScoreboardOverlay';
import QuarterTimerOverlay from '../components/broadcast/QuarterTimerOverlay';
import CelebrationOverlay from '../components/broadcast/CelebrationOverlay';
import { TeamIcon, TeamRole, Scoreboard, Event, EventType } from '../backend';

export default function BroadcasterPage() {
  const {
    isActive: cameraActive,
    isSupported: cameraSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    switchCamera,
    currentFacingMode,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
  });

  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);

  // Local state for scoreboard and events
  const [scoreboard, setScoreboard] = useState<Scoreboard>({
    team1Score: BigInt(0),
    team2Score: BigInt(0),
    team1Icon: TeamIcon.dolphin,
    team2Icon: TeamIcon.bullfrog,
    team1Role: TeamRole.none,
    team2Role: TeamRole.none,
  });

  const [showThrowOff, setShowThrowOff] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const {
    isRecording,
    recordingDuration,
    error: recordingError,
    startRecording,
    stopRecording,
  } = useVideoRecorder({ videoRef });

  const {
    phase,
    timeRemaining,
    isRunning,
    formattedTime,
    start,
    pause,
    reset,
    nextQuarter,
    toggleHalftime,
  } = useQuarterTimer();

  const { activeTeamIcon, isVisible: isCelebrationVisible, triggerCelebration } =
    useCelebrationOverlay();

  const handleStartRecording = async (): Promise<boolean> => {
    if (!cameraActive || !videoRef.current) return false;
    return startRecording();
  };

  const handleStopRecording = async (): Promise<void> => {
    await stopRecording();
  };

  const handleSwitchCamera = async (): Promise<boolean> => {
    setIsSwitchingCamera(true);
    try {
      const success = await switchCamera();
      return success;
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  const handleScoreboardUpdate = (updatedScoreboard: Scoreboard) => {
    setScoreboard(updatedScoreboard);
  };

  const handleThrowOffToggle = (enabled: boolean) => {
    setShowThrowOff(enabled);
  };

  const handleCelebrationTrigger = (teamIcon: string) => {
    triggerCelebration(teamIcon as TeamIcon);
  };

  const handleAddFlagEvent = (team: string, reason: string) => {
    const newEvent: Event = {
      timestamp: BigInt(Date.now() * 1_000_000),
      description: `Flag for ${team}: ${reason}`,
      eventType: EventType.flag,
      flagEvent: {
        team,
        reason,
        timestamp: BigInt(Date.now() * 1_000_000),
      },
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  if (cameraSupported === false) {
    return (
      <FootballLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="p-6 bg-destructive/10 border border-destructive/50 rounded-lg">
              <h2 className="text-xl font-bold text-destructive mb-2">Camera Not Supported</h2>
              <p className="text-muted-foreground">
                Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or
                Safari.
              </p>
            </div>
          </div>
        </div>
      </FootballLayout>
    );
  }

  if (cameraError) {
    return (
      <FootballLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="p-6 bg-destructive/10 border border-destructive/50 rounded-lg">
              <h2 className="text-xl font-bold text-destructive mb-2">Camera Error</h2>
              <p className="text-muted-foreground mb-4">{cameraError.message}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </FootballLayout>
    );
  }

  // Get the latest event for the overlay
  const latestEvent = events.length > 0 ? events[events.length - 1] : null;

  return (
    <FootballLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Camera Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transformOrigin: 'center center' }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* On-Camera Overlays */}
              <OnCameraScoreboardOverlay scoreboard={scoreboard} showThrowOff={showThrowOff} />
              <QuarterTimerOverlay phase={phase} formattedTime={formattedTime} />
              {latestEvent && <LatestEventOverlay event={latestEvent} />}
              <CelebrationOverlay teamIcon={activeTeamIcon} isVisible={isCelebrationVisible} />

              {cameraLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-lg">Loading camera...</div>
                </div>
              )}
            </div>

            <RecordingControls
              isRecording={isRecording}
              recordingDuration={recordingDuration}
              error={recordingError}
              cameraActive={cameraActive}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onSwitchCamera={handleSwitchCamera}
              currentFacingMode={currentFacingMode}
              isSwitchingCamera={isSwitchingCamera}
              videoRef={videoRef as React.RefObject<HTMLVideoElement>}
            />

            <ScoreboardControls
              currentScoreboard={scoreboard}
              onUpdate={handleScoreboardUpdate}
              showThrowOff={showThrowOff}
              onThrowOffToggle={handleThrowOffToggle}
              onCelebrationTrigger={handleCelebrationTrigger}
            />

            <QuarterControls
              phase={phase}
              formattedTime={formattedTime}
              isRunning={isRunning}
              onStart={start}
              onPause={pause}
              onReset={reset}
              onNextQuarter={nextQuarter}
              onToggleHalftime={toggleHalftime}
            />

            <FootballControlPanel scoreboard={scoreboard} onAddFlagEvent={handleAddFlagEvent} />
          </div>

          {/* Right Column: Event Feed */}
          <div className="lg:col-span-1">
            <EventFeed events={events} />
          </div>
        </div>
      </div>
    </FootballLayout>
  );
}
