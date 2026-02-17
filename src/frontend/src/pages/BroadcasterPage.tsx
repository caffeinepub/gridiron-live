import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Video, VideoOff, AlertCircle } from 'lucide-react';
import { useBroadcasterSession } from '../hooks/useBroadcasterSession';
import { useCamera } from '../camera/useCamera';
import { useMicrophone } from '../hooks/useMicrophone';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { usePublishCaption } from '../hooks/useQueries';
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
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const { status, sessionCode, startSession, endSession, isLive, isIdle } = useBroadcasterSession();
  const { data: events = [] } = useGetEvents(sessionCode || undefined);
  const { data: scoreboard, isLoading: scoreboardLoading } = useGetScoreboard(sessionCode || undefined);
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
    retry: retryCamera,
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
    audioStream,
  } = useMicrophone({
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  });

  const {
    isSupported: speechSupported,
    isListening: speechListening,
    transcript,
    lastError: speechError,
    startListening: startSpeech,
    stopListening: stopSpeech,
  } = useSpeechRecognition();

  const publishCaptionMutation = usePublishCaption();
  const lastPublishedCaptionRef = useRef('');
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  // Start camera when going live
  useEffect(() => {
    if (isLive && !cameraActive && !cameraLoading) {
      startCamera();
    }
  }, [isLive, cameraActive, cameraLoading, startCamera]);

  // Start microphone when going live and mic is enabled
  useEffect(() => {
    if (isLive && micEnabled && !micActive && !micLoading && micSupported !== false) {
      startMicrophone();
    }
  }, [isLive, micEnabled, micActive, micLoading, micSupported, startMicrophone]);

  // Manage audio track in video stream
  useEffect(() => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const videoStream = videoRef.current.srcObject as MediaStream;
    const existingAudioTracks = videoStream.getAudioTracks();

    if (micEnabled && micActive && audioTrack) {
      // Add audio track if not already present
      const audioAlreadyAdded = existingAudioTracks.some(track => track.id === audioTrack.id);
      if (!audioAlreadyAdded) {
        // Remove old audio tracks
        existingAudioTracks.forEach(track => {
          videoStream.removeTrack(track);
        });
        // Add new audio track
        videoStream.addTrack(audioTrack);
      }
      // Ensure track is enabled
      audioTrack.enabled = true;
    } else {
      // Disable or remove audio tracks when mic is off
      existingAudioTracks.forEach(track => {
        if (micEnabled) {
          track.enabled = false;
        } else {
          videoStream.removeTrack(track);
        }
      });
    }
  }, [micEnabled, micActive, audioTrack, videoRef]);

  // WebRTC broadcasting setup (prepared for when backend signaling is available)
  useEffect(() => {
    if (!isLive || !videoRef.current || !videoRef.current.srcObject) {
      return;
    }

    const broadcastStream = videoRef.current.srcObject as MediaStream;

    // TODO: When backend adds WebRTC signaling endpoints:
    // 1. Create RTCPeerConnection for each viewer
    // 2. Add broadcast stream tracks to peer connections
    // 3. Create offers and send to backend
    // 4. Listen for answers and ICE candidates from backend
    // 5. Handle viewer connections/disconnections

    // Cleanup function
    return () => {
      peerConnectionsRef.current.forEach((pc) => {
        pc.close();
      });
      peerConnectionsRef.current.clear();
    };
  }, [isLive, videoRef]);

  // Start/stop broadcaster captions
  useEffect(() => {
    if (isLive && captionsEnabled && !speechListening && speechSupported) {
      startSpeech();
    } else if ((!captionsEnabled || !isLive) && speechListening) {
      stopSpeech();
    }
  }, [isLive, captionsEnabled, speechListening, speechSupported, startSpeech, stopSpeech]);

  // Publish captions to backend
  useEffect(() => {
    if (!sessionCode || !transcript || transcript === lastPublishedCaptionRef.current) {
      return;
    }

    lastPublishedCaptionRef.current = transcript;
    publishCaptionMutation.mutate({ sessionCode, text: transcript });
  }, [transcript, sessionCode, publishCaptionMutation]);

  const handleStartBroadcast = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!broadcasterName.trim() || !selectedTeam1Icon || !selectedTeam2Icon) return;
    
    // Clear any previous error
    setStartError(null);
    
    try {
      await startSession(broadcasterName.trim(), selectedTeam1Icon, selectedTeam2Icon);
      // Enable captions by default
      setCaptionsEnabled(true);
    } catch (error) {
      console.error('Failed to start broadcast:', error);
      setStartError('Could not start the broadcast. Please try again.');
    }
  };

  const handleEndBroadcast = async () => {
    try {
      if (speechListening) {
        stopSpeech();
      }
      await endSession();
      await stopCamera();
      await stopMicrophone();
    } catch (error) {
      console.error('Failed to end broadcast:', error);
    }
  };

  const handleMicToggle = async () => {
    setMicEnabled(!micEnabled);
  };

  const handleMicRetry = async (): Promise<boolean> => {
    const success = await retryMicrophone();
    if (success) {
      setMicEnabled(true);
    }
    return success;
  };

  const handleCameraRetry = async (): Promise<boolean> => {
    return await retryCamera();
  };

  // Clear error when user changes input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBroadcasterName(e.target.value);
    if (startError) setStartError(null);
  };

  const handleTeam1Change = (icon: TeamIcon) => {
    setSelectedTeam1Icon(icon);
    if (startError) setStartError(null);
  };

  const handleTeam2Change = (icon: TeamIcon) => {
    setSelectedTeam2Icon(icon);
    if (startError) setStartError(null);
  };

  const canStartBroadcast = 
    broadcasterName.trim() && 
    selectedTeam1Icon && 
    selectedTeam2Icon && 
    selectedTeam1Icon !== selectedTeam2Icon &&
    status !== 'starting';

  const isStarting = status === 'starting';

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
          <CardContent>
            <form onSubmit={handleStartBroadcast} className="space-y-6">
              {startError && (
                <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">{startError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="broadcaster-name">Your Name</Label>
                <Input
                  id="broadcaster-name"
                  placeholder="Enter your name"
                  value={broadcasterName}
                  onChange={handleNameChange}
                  disabled={isStarting}
                />
              </div>

              <div className="space-y-3">
                <Label>Team A</Label>
                <div className="grid grid-cols-4 gap-3">
                  {TEAM_ICONS.map((icon) => {
                    const isSelected = selectedTeam1Icon === icon.value;
                    const isDisabled = selectedTeam2Icon === icon.value || isStarting;
                    return (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => handleTeam1Change(icon.value)}
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
                    const isDisabled = selectedTeam1Icon === icon.value || isStarting;
                    return (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => handleTeam2Change(icon.value)}
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
                type="submit"
                size="lg"
                className="w-full"
                disabled={!canStartBroadcast}
              >
                {isStarting ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-5 w-5" />
                    Start Broadcast
                  </>
                )}
              </Button>
            </form>
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
                        micEnabled={micEnabled}
                        isLoading={micLoading}
                        disabled={!isLive}
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
                  {cameraError && <PermissionsHelp error={cameraError} onRetry={handleCameraRetry} />}
                  {micError && <MicrophonePermissionsHelp error={micError} onRetry={handleMicRetry} />}
                  
                  {speechError && !speechSupported && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-500">Broadcaster captions unavailable</p>
                        <p className="text-muted-foreground mt-1">
                          Speech recognition is not supported in your browser. Viewers will not see captions, but video and audio will continue normally.
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    className="relative w-full bg-black rounded-lg overflow-hidden"
                    style={{ aspectRatio: '16/9', minHeight: '300px' }}
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {/* Broadcaster transcript overlay - moved to top */}
                    {captionsEnabled && transcript && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 max-w-[90%] px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg z-20">
                        <p className="text-white text-center text-sm md:text-base leading-relaxed">
                          {transcript}
                        </p>
                      </div>
                    )}

                    {activeFlagOverlay && (
                      <FlagAnnouncementOverlay 
                        flagEvent={activeFlagOverlay.flagEvent} 
                        side={activeFlagOverlay.side}
                      />
                    )}

                    {scoreboard && <OnCameraScoreboardOverlay scoreboard={scoreboard} />}

                    {!cameraActive && !cameraLoading && !cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                          <VideoOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Camera not active</p>
                        </div>
                      </div>
                    )}

                    {cameraLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2" />
                          <p className="text-sm">Starting camera...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <FootballControlPanel 
                  sessionCode={sessionCode} 
                  scoreboard={scoreboard}
                  isLoading={scoreboardLoading}
                />
                {scoreboard && (
                  <ScoreboardControls sessionCode={sessionCode} currentScoreboard={scoreboard} />
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleEndBroadcast}
                  disabled={status === 'ending'}
                >
                  End Broadcast
                </Button>
              </div>
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
