import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Video, Square, AlertCircle, SwitchCamera, ZoomIn } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RecordingControlsProps {
  isRecording: boolean;
  recordingDuration: number;
  error: string | null;
  cameraActive: boolean;
  onStartRecording: () => Promise<boolean>;
  onStopRecording: () => Promise<void>;
  onSwitchCamera?: () => Promise<boolean>;
  currentFacingMode?: 'user' | 'environment';
  isSwitchingCamera?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export default function RecordingControls({
  isRecording,
  recordingDuration,
  error,
  cameraActive,
  onStartRecording,
  onStopRecording,
  onSwitchCamera,
  currentFacingMode,
  isSwitchingCamera = false,
  videoRef,
}: RecordingControlsProps) {
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Apply zoom to video element
  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.style.transform = `scale(${zoomLevel})`;
    }
  }, [zoomLevel, videoRef]);

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const handleSwitchCamera = async () => {
    if (onSwitchCamera) {
      const success = await onSwitchCamera();
      // Reapply zoom after camera switch
      if (success && videoRef?.current) {
        videoRef.current.style.transform = `scale(${zoomLevel})`;
      }
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="scoreboard-text flex items-center justify-between">
          <span>Recording</span>
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-mono text-destructive">{formatDuration(recordingDuration)}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Recording Error</p>
              <p className="text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        )}

        {!cameraActive && !isRecording && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Camera must be active to start recording
            </p>
          </div>
        )}

        {/* Zoom Control */}
        {cameraActive && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                Zoom
              </label>
              <span className="text-sm text-muted-foreground">{zoomLevel.toFixed(1)}x</span>
            </div>
            <Slider
              value={[zoomLevel]}
              onValueChange={handleZoomChange}
              min={1.0}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={onStartRecording}
            disabled={!cameraActive || isRecording}
          >
            <Video className="mr-2 h-5 w-5" />
            Start Recording
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="flex-1"
            onClick={onStopRecording}
            disabled={!isRecording}
          >
            <Square className="mr-2 h-5 w-5" />
            Stop & Download
          </Button>
          {onSwitchCamera && (
            <Button
              size="lg"
              variant="outline"
              onClick={handleSwitchCamera}
              disabled={!cameraActive || isSwitchingCamera}
              title={`Switch to ${currentFacingMode === 'environment' ? 'front' : 'back'} camera`}
            >
              <SwitchCamera className="h-5 w-5" />
            </Button>
          )}
        </div>

        {isRecording && (
          <p className="text-xs text-muted-foreground text-center">
            Recording includes all on-screen overlays and UI elements
          </p>
        )}
      </CardContent>
    </Card>
  );
}
