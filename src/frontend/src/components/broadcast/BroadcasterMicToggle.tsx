import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface BroadcasterMicToggleProps {
  micEnabled: boolean;
  isLoading: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onRetry?: () => Promise<boolean>;
  hasError?: boolean;
}

export default function BroadcasterMicToggle({
  micEnabled,
  isLoading,
  disabled = false,
  onToggle,
  onRetry,
  hasError = false,
}: BroadcasterMicToggleProps) {
  if (hasError && onRetry) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isLoading || disabled}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
        Retry Mic
      </Button>
    );
  }

  return (
    <Button
      variant={micEnabled ? 'default' : 'outline'}
      size="sm"
      onClick={onToggle}
      disabled={isLoading || disabled}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : micEnabled ? (
        <Mic className="h-4 w-4" />
      ) : (
        <MicOff className="h-4 w-4" />
      )}
      {micEnabled ? 'Mic On' : 'Mic Off'}
    </Button>
  );
}
