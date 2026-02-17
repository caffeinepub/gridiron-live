import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Video, VideoOff } from 'lucide-react';
import { useBroadcasterSession } from '../hooks/useBroadcasterSession';
import { useCamera } from '../camera/useCamera';
import { useMicrophone } from '../hooks/useMicrophone';
import SessionCodeCard from '../components/broadcast/SessionCodeCard';
import FootballControlPanel from '../components/broadcast/FootballControlPanel';
import ScoreboardControls from '../components/broadcast/ScoreboardControls';
import PermissionsHelp from '../components/broadcast/PermissionsHelp';
import MicrophonePermissionsHelp from '../components/broadcast/MicrophonePermissionsHelp';
import BroadcasterMicToggle from '../components/broadcast/BroadcasterMicToggle';
import UnsupportedState from '../components/system/UnsupportedState';
import EventFeed from '../components/events/EventFeed';
import OnCameraScoreboardOverlay from '../components/scoreboard/OnCameraScoreboardOverlay';
import FlagAnnouncementOverlay from '../components/events/FlagAnnouncementOverlay';
import { useGetEvents, useGetScoreboard, useGetFlagEvents } from '../hooks/useQueries';
import { useTimedFlagOverlay } from '../hooks/useTimedFlagOverlay';
import { TEAM_ICONS } from '../lib/teamIcons';
import { TeamIcon } from '../backend';

export default function BroadcasterPage() {
  const navigate = useNavigate();
  const [broadcasterName, setBroadcasterName] = useState('');
  const [selectedTeam1Icon, setSelectedTeam1Icon] = useState<TeamIcon | null>(null);
  const [selectedTeam2Icon, setSelectedTeam2Icon] = useState<TeamIcon | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const { status, sessionCode, startSession, endSession, isLive, isIdle } = useBroadcasterSession();
  const { data: events = [] } = useGetEvents(sessionCode || undefined);
  const { data: scoreboard } = useGetScoreboard(sessionCode || undefined);
  const flagEvents = useGetFlagEvents(sessionCode || undefined);

  const activeFlagOverlay = useTimedFlagOverlay({
    sessionCode: sessionCode || '',
    flagEvents,
    displayDuration: 3000,
  });

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

  const {
    isActive: micActive,
    isSupported: micSupported,
    error: micError,
    isLoading: micLoading,
    startMicrophone,
    stopMicrophone,
    retry: retryMicrophone,
    audioTrack,
  } = useMicrophone({
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  });

  // Reference to track if we've added audio to the video stream
  const audioAddedRef = useRef(false);

  // Start camera and microphone when going live
  useEffect(() => {
    if (isLive && !cameraActive && !cameraLoading) {
      startCamera();
    }
  }, [isLive, cameraActive, cameraLoading, startCamera]);

  useEffect(() => {
    if (isLive && micEnabled && !micActive && !micLoading && micSupported !== false) {
      startMicrophone();
    }
  }, [isLive, micEnabled, micActive, micLoading, micSupported, startMicrophone]);

  // Merge audio track into video stream when both are available
  useEffect(() => {
    if (cameraActive && micActive && audioTrack && videoRef.current && videoRef.current.srcObject) {
      const videoStream = videoRef.current.srcObject as MediaStream;
      
      // Check if audio track is already added
      const existingAudioTracks = videoStream.getAudioTracks();
      const audioAlreadyAdded = existingAudioTracks.some(track => track.id === audioTrack.id);
      
      if (!audioAlreadyAdded) {
        // Remove any existing audio tracks first
        existingAudioTracks.forEach(track => {
          videoStream.removeTrack(track);
          track.stop();
        });
        
        // Add the new audio track
        videoStream.addTrack(audioTrack);
        audioAddedRef.current = true;
      }
    }
  }, [cameraActive, micActive, audioTrack, videoRef]);

  // Remove audio track when mic is disabled
  useEffect(() => {
    if (!micEnabled && videoRef.current && videoRef.current.srcObject) {
      const videoStream = videoRef.current.srcObject as MediaStream;
      const audioTracks = videoStream.getAudioTracks();
      
      audioTracks.forEach(track => {
        videoStream.removeTrack(track);
        track.stop();
      });
      
      audioAddedRef.current = false;
      stopMicrophone();
    }
  }, [micEnabled, stopMicrophone, videoRef]);

  const handleStartBroadcast = async () => {
    if (!broadcasterName.trim() || !selectedTeam1Icon || !selectedTeam2Icon) return;
    try {
      await startSession(broadcasterName.trim(), selectedTeam1Icon, selectedTeam2Icon);
    } catch (error) {
      console.error('Failed to start broadcast:', error);
    }
  };

  const handleEndBroadcast = async () => {
    try {
      await endSession();
      await stopCamera();
      await stopMicrophone();
    } catch (error) {
      console.error('Failed to end broadcast:', error);
    }
  };

  const handleMicToggle = async () => {
    if (micEnabled) {
      // Turn mic off
      setMicEnabled(false);
    } else {
      // Turn mic on
      setMicEnabled(true);
      if (!micActive && micSupported !== false) {
        await startMicrophone();
      }
    }
  };

  const handleMicRetry = async (): Promise<boolean> => {
    const success = await retryMicrophone();
    if (success) {
      setMicEnabled(true);
    }
    return success;
  };

  const canStartBroadcast = 
    broadcasterName.trim() && 
    selectedTeam1Icon && 
    selectedTeam2Icon && 
    selectedTeam1Icon !== selectedTeam2Icon &&
    status !== 'starting';

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
        <Card className="max-w-2xl mx-auto border-2">
          <CardHeader>
            <CardTitle className="text-2xl scoreboard-text">Start Broadcasting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="broadcaster-name">Your Name</Label>
              <Input
                id="broadcaster-name"
                placeholder="Enter your name"
                value={broadcasterName}
                onChange={(e) => setBroadcasterName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Team A</Label>
              <div className="grid grid-cols-4 gap-3">
                {TEAM_ICONS.map((icon) => {
                  const isSelected = selectedTeam1Icon === icon.value;
                  const isDisabled = selectedTeam2Icon === icon.value;
                  return (
                    <button
                      key={icon.value}
                      onClick={() => setSelectedTeam1Icon(icon.value)}
                      disabled={isDisabled}
                      className={`
                        relative p-3 rounded-lg border-2 transition-all
                        ${isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border hover:border-primary/50'}
                        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <img
                        src={icon.imagePath}
                        alt={icon.alt}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap">
                        {icon.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Team B</Label>
              <div className="grid grid-cols-4 gap-3">
                {TEAM_ICONS.map((icon) => {
                  const isSelected = selectedTeam2Icon === icon.value;
                  const isDisabled = selectedTeam1Icon === icon.value;
                  return (
                    <button
                      key={icon.value}
                      onClick={() => setSelectedTeam2Icon(icon.value)}
                      disabled={isDisabled}
                      className={`
                        relative p-3 rounded-lg border-2 transition-all
                        ${isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border hover:border-primary/50'}
                        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <img
                        src={icon.imagePath}
                        alt={icon.alt}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap">
                        {icon.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedTeam1Icon && selectedTeam2Icon && selectedTeam1Icon === selectedTeam2Icon && (
              <p className="text-sm text-destructive text-center">
                Team A and Team B must have different icons
              </p>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleStartBroadcast}
              disabled={!canStartBroadcast}
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
                    <div className="flex items-center gap-3">
                      <BroadcasterMicToggle
                        micEnabled={micEnabled && micActive}
                        isLoading={micLoading}
                        disabled={!cameraActive}
                        onToggle={handleMicToggle}
                        onRetry={handleMicRetry}
                        hasError={!!micError}
                      />
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                        <span className="text-sm font-normal text-destructive">LIVE</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '300px' }}>
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
                    {micError && !cameraError && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                        <MicrophonePermissionsHelp error={micError} onRetry={handleMicRetry} />
                      </div>
                    )}
                    {activeFlagOverlay && (
                      <FlagAnnouncementOverlay 
                        flagEvent={activeFlagOverlay.flagEvent} 
                        side={activeFlagOverlay.side}
                      />
                    )}
                    {scoreboard && <OnCameraScoreboardOverlay scoreboard={scoreboard} />}
                  </div>
                </CardContent>
              </Card>

              <FootballControlPanel 
                sessionCode={sessionCode} 
                disabled={!cameraActive} 
                scoreboard={scoreboard}
              />

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
