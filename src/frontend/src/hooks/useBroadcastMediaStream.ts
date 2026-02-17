import { useEffect, useState, useRef } from 'react';

export interface UseBroadcastMediaStreamReturn {
  broadcastStream: MediaStream | null;
  setMicEnabled: (enabled: boolean) => void;
  isReady: boolean;
}

export function useBroadcastMediaStream(
  videoStream: MediaStream | null,
  audioTrack: MediaStreamTrack | null,
  micEnabled: boolean
): UseBroadcastMediaStreamReturn {
  const [broadcastStream, setBroadcastStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const audioTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    if (!videoStream) {
      setBroadcastStream(null);
      setIsReady(false);
      return;
    }

    // Create a new broadcast stream with video tracks
    const newBroadcastStream = new MediaStream();
    
    // Add all video tracks
    videoStream.getVideoTracks().forEach(track => {
      newBroadcastStream.addTrack(track);
    });

    // Add audio track if available and enabled
    if (audioTrack && micEnabled) {
      newBroadcastStream.addTrack(audioTrack);
      audioTrackRef.current = audioTrack;
    }

    setBroadcastStream(newBroadcastStream);
    setIsReady(true);

    return () => {
      // Cleanup
      audioTrackRef.current = null;
    };
  }, [videoStream, audioTrack, micEnabled]);

  // Handle mic enable/disable by toggling track.enabled
  useEffect(() => {
    if (!broadcastStream || !audioTrackRef.current) return;

    const audioTracks = broadcastStream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = micEnabled;
    });
  }, [micEnabled, broadcastStream]);

  const setMicEnabled = (enabled: boolean) => {
    if (!broadcastStream) return;

    const audioTracks = broadcastStream.getAudioTracks();
    
    if (enabled && audioTrack && audioTracks.length === 0) {
      // Add audio track if not present
      broadcastStream.addTrack(audioTrack);
      audioTrackRef.current = audioTrack;
    }
    
    // Toggle enabled state
    audioTracks.forEach(track => {
      track.enabled = enabled;
    });
  };

  return {
    broadcastStream,
    setMicEnabled,
    isReady,
  };
}
