import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { MicrophoneError } from '../../hooks/useMicrophone';

interface MicrophonePermissionsHelpProps {
  error: MicrophoneError;
  onRetry: () => Promise<boolean>;
}

export default function MicrophonePermissionsHelp({ error, onRetry }: MicrophonePermissionsHelpProps) {
  return (
    <div className="text-center p-4 max-w-sm bg-background/95 backdrop-blur rounded-lg border-2 border-warning">
      <AlertCircle className="h-8 w-8 text-warning mx-auto mb-2" />
      <h4 className="text-sm font-semibold mb-1">Microphone Issue</h4>
      <p className="text-xs text-muted-foreground mb-3">
        {error.type === 'permission'
          ? 'Microphone access denied. Please allow microphone access in your browser settings to enable audio.'
          : error.type === 'not-found'
          ? 'No microphone found. Please connect a microphone to enable audio.'
          : error.type === 'not-supported'
          ? 'Your browser or device does not support microphone capture.'
          : error.message}
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Video streaming will continue without audio.
      </p>
      <Button onClick={onRetry} variant="outline" size="sm">
        Retry Microphone
      </Button>
    </div>
  );
}
