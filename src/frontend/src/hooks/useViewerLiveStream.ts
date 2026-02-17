import { useRef, useEffect, useState } from 'react';

export interface ViewerLiveStreamError {
  message: string;
  type: 'connection' | 'negotiation' | 'playback' | 'unknown';
}

export interface UseViewerLiveStreamReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isConnecting: boolean;
  error: ViewerLiveStreamError | null;
  retry: () => void;
}

export function useViewerLiveStream(
  sessionCode: string | undefined,
  isLive: boolean
): UseViewerLiveStreamReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<ViewerLiveStreamError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isLive || !sessionCode || !videoRef.current) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    // Simulate stream connection attempt
    // In a real implementation, this would establish WebRTC connection
    const attemptConnection = async () => {
      try {
        // For now, we'll show a connection error since actual streaming
        // infrastructure is not implemented
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setError({
          type: 'connection',
          message: 'Stream connection is not yet available. The broadcaster video feed cannot be displayed at this time.',
        });
        setIsConnecting(false);
      } catch (err) {
        setError({
          type: 'unknown',
          message: 'Failed to connect to the broadcast stream.',
        });
        setIsConnecting(false);
      }
    };

    attemptConnection();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isLive, sessionCode, retryCount]);

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    videoRef,
    isConnecting,
    error,
    retry,
  };
}
