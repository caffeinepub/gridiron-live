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
      audioTrack.enabled = true;
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
    if (!broadcastStream) return;

    const audioTracks = broadcastStream.getAudioTracks();
    
    if (micEnabled && audioTrack) {
      // Ensure audio track is present
      const hasAudioTrack = audioTracks.some(track => track.id === audioTrack.id);
      if (!hasAudioTrack) {
        broadcastStream.addTrack(audioTrack);
      }
      // Enable all audio tracks
      audioTracks.forEach(track => {
        track.enabled = true;
      });
      audioTrackRef.current = audioTrack;
    } else {
      // Disable all audio tracks when mic is off
      audioTracks.forEach(track => {
        track.enabled = false;
      });
    }
  }, [micEnabled, broadcastStream, audioTrack]);

  const setMicEnabled = (enabled: boolean) => {
    if (!broadcastStream) return;

    const audioTracks = broadcastStream.getAudioTracks();
    
    if (enabled && audioTrack) {
      // Add audio track if not present
      const hasAudioTrack = audioTracks.some(track => track.id === audioTrack.id);
      if (!hasAudioTrack) {
        broadcastStream.addTrack(audioTrack);
        audioTrackRef.current = audioTrack;
      }
      // Enable all audio tracks
      audioTracks.forEach(track => {
        track.enabled = true;
      });
    } else {
      // Disable all audio tracks
      audioTracks.forEach(track => {
        track.enabled = false;
      });
    }
  };

  return {
    broadcastStream,
    setMicEnabled,
    isReady,
  };
}
