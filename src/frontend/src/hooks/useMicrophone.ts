import { useState, useRef, useCallback, useEffect } from 'react';

export interface MicrophoneConfig {
  // Audio quality settings
  sampleRate?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
}

export interface MicrophoneError {
  type: 'permission' | 'not-supported' | 'not-found' | 'unknown' | 'timeout';
  message: string;
}

export interface UseMicrophoneReturn {
  // Whether microphone is currently active and capturing
  isActive: boolean;
  // Whether microphone is supported in current browser (null while checking)
  isSupported: boolean | null;
  // Current error state, if any
  error: MicrophoneError | null;
  // Whether microphone is initializing, starting, or stopping
  isLoading: boolean;
  
  // Returns true on success
  startMicrophone: () => Promise<boolean>;
  stopMicrophone: () => Promise<void>;
  // Returns true on success
  retry: () => Promise<boolean>;
  
  // Current audio stream (null if not active)
  audioStream: MediaStream | null;
  // Current audio track (null if not active)
  audioTrack: MediaStreamTrack | null;
}

export function useMicrophone(config?: MicrophoneConfig): UseMicrophoneReturn {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<MicrophoneError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  // Check if microphone is supported
  useEffect(() => {
    const checkSupport = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSupported(false);
        setError({
          type: 'not-supported',
          message: 'Your browser does not support microphone access.',
        });
        return;
      }
      setIsSupported(true);
    };
    checkSupport();
  }, []);

  const stopMicrophone = useCallback(async () => {
    if (trackRef.current) {
      trackRef.current.stop();
      trackRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setError(null);
  }, []);

  const startMicrophone = useCallback(async (): Promise<boolean> => {
    if (isSupported === false) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Stop any existing stream first
      await stopMicrophone();

      const constraints: MediaStreamConstraints = {
        audio: {
          sampleRate: config?.sampleRate,
          echoCancellation: config?.echoCancellation ?? true,
          noiseSuppression: config?.noiseSuppression ?? true,
          autoGainControl: config?.autoGainControl ?? true,
        },
        video: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioTrack = stream.getAudioTracks()[0];

      if (!audioTrack) {
        throw new Error('No audio track found in stream');
      }

      streamRef.current = stream;
      trackRef.current = audioTrack;
      setIsActive(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Microphone error:', err);
      
      let micError: MicrophoneError;
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          micError = {
            type: 'permission',
            message: 'Microphone access was denied. Please allow microphone access in your browser settings.',
          };
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          micError = {
            type: 'not-found',
            message: 'No microphone found. Please connect a microphone and try again.',
          };
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          micError = {
            type: 'unknown',
            message: 'Microphone is already in use by another application.',
          };
        } else if (err.name === 'OverconstrainedError') {
          micError = {
            type: 'not-supported',
            message: 'Your microphone does not support the requested settings.',
          };
        } else if (err.name === 'TypeError') {
          micError = {
            type: 'not-supported',
            message: 'Microphone access is not supported in this browser.',
          };
        } else if (err.name === 'AbortError') {
          micError = {
            type: 'timeout',
            message: 'Microphone access request timed out.',
          };
        } else {
          micError = {
            type: 'unknown',
            message: err.message || 'Failed to access microphone.',
          };
        }
      } else {
        micError = {
          type: 'unknown',
          message: 'An unknown error occurred while accessing the microphone.',
        };
      }
      
      setError(micError);
      setIsActive(false);
      setIsLoading(false);
      return false;
    }
  }, [isSupported, config, stopMicrophone]);

  const retry = useCallback(async (): Promise<boolean> => {
    return startMicrophone();
  }, [startMicrophone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackRef.current) {
        trackRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    isActive,
    isSupported,
    error,
    isLoading,
    startMicrophone,
    stopMicrophone,
    retry,
    audioStream: streamRef.current,
    audioTrack: trackRef.current,
  };
}
