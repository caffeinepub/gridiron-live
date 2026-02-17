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
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!isLive || !sessionCode || !videoRef.current) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    const attemptConnection = async () => {
      try {
        // Create RTCPeerConnection with STUN servers
        const configuration: RTCConfiguration = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        };

        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        // Handle incoming remote stream
        peerConnection.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            setIsConnecting(false);
            setError(null);
          }
        };

        // Handle ICE connection state changes
        peerConnection.oniceconnectionstatechange = () => {
          const state = peerConnection.iceConnectionState;
          
          if (state === 'connected' || state === 'completed') {
            setIsConnecting(false);
            setError(null);
          } else if (state === 'failed' || state === 'disconnected') {
            setError({
              type: 'connection',
              message: 'Connection to broadcaster lost. Please retry.',
            });
            setIsConnecting(false);
          }
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            // TODO: Send ICE candidate to backend signaling service
            // This requires backend endpoints for WebRTC signaling
            console.log('ICE candidate generated:', event.candidate);
          }
        };

        // Create offer for receiving stream
        const offer = await peerConnection.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await peerConnection.setLocalDescription(offer);

        // TODO: Send offer to backend and wait for answer
        // Backend needs endpoints to store/retrieve WebRTC offers and answers
        // For now, show error indicating backend signaling is needed
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setError({
          type: 'connection',
          message: 'WebRTC signaling not yet implemented. Backend needs offer/answer/ICE candidate endpoints for real-time streaming.',
        });
        setIsConnecting(false);

      } catch (err) {
        console.error('WebRTC connection error:', err);
        setError({
          type: 'unknown',
          message: 'Failed to establish WebRTC connection.',
        });
        setIsConnecting(false);
      }
    };

    attemptConnection();

    return () => {
      // Cleanup peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      
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
