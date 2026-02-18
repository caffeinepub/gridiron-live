import { useState, useRef, useCallback } from 'react';

interface UseVideoRecorderProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  overlayRef?: React.RefObject<HTMLDivElement | null>;
}

interface UseVideoRecorderReturn {
  isRecording: boolean;
  error: string | null;
  recordingDuration: number;
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<void>;
}

export function useVideoRecorder({ videoRef, overlayRef }: UseVideoRecorderProps): UseVideoRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const selectedMimeTypeRef = useRef<string>('');

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      if (!videoRef.current || !videoRef.current.srcObject) {
        setError('Camera not available');
        return false;
      }

      const videoStream = videoRef.current.srcObject as MediaStream;
      
      // Check for supported mime types - prioritize MP4 with H.264 for iOS compatibility
      const mimeTypes = [
        'video/mp4;codecs=h264,aac',
        'video/mp4;codecs=avc1,mp4a',
        'video/mp4',
        'video/webm;codecs=h264',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log('Selected MIME type:', mimeType);
          break;
        }
      }
      
      if (!selectedMimeType) {
        setError('No supported video format found in your browser');
        return false;
      }

      selectedMimeTypeRef.current = selectedMimeType;

      // Create MediaRecorder with the video stream
      const mediaRecorder = new MediaRecorder(videoStream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMimeTypeRef.current });
        const url = URL.createObjectURL(blob);
        
        // Determine file extension based on MIME type
        const fileExtension = selectedMimeTypeRef.current.startsWith('video/mp4') ? 'mp4' : 'webm';
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        a.download = `football-broadcast-${timestamp}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        URL.revokeObjectURL(url);
        chunksRef.current = [];
        
        // Stop duration tracking
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
        setRecordingDuration(0);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error occurred');
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      // Start duration tracking
      startTimeRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingDuration(elapsed);
      }, 1000);

      return true;
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      return false;
    }
  }, [videoRef]);

  const stopRecording = useCallback(async (): Promise<void> => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    error,
    recordingDuration,
    startRecording,
    stopRecording,
  };
}
