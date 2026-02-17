import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { CameraError } from '../../camera/useCamera';

interface PermissionsHelpProps {
  error: CameraError;
  onRetry: () => Promise<boolean>;
}

export default function PermissionsHelp({ error, onRetry }: PermissionsHelpProps) {
  return (
    <div className="text-center p-6 max-w-md">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
      <p className="text-muted-foreground mb-4">
        {error.type === 'permission'
          ? 'Please allow camera access to start broadcasting. Check your browser settings and grant permission.'
          : error.type === 'not-found'
          ? 'No camera found. Please connect a camera and try again.'
          : error.message}
      </p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  );
}
