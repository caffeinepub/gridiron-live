import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward, Clock } from 'lucide-react';

interface QuarterControlsProps {
  phase: string;
  formattedTime: string;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNextQuarter: () => void;
  onToggleHalftime: () => void;
  disabled?: boolean;
}

export default function QuarterControls({
  phase,
  formattedTime,
  isRunning,
  onStart,
  onPause,
  onReset,
  onNextQuarter,
  onToggleHalftime,
  disabled = false,
}: QuarterControlsProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="scoreboard-text flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Quarter Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-sm font-semibold text-muted-foreground mb-1">{phase}</div>
          <div className="text-4xl font-mono font-bold">{formattedTime}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {!isRunning ? (
            <Button
              onClick={onStart}
              disabled={disabled || phase === 'Halftime'}
              className="w-full"
              variant="default"
            >
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          ) : (
            <Button
              onClick={onPause}
              disabled={disabled}
              className="w-full"
              variant="secondary"
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}

          <Button
            onClick={onReset}
            disabled={disabled}
            className="w-full"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={onNextQuarter}
            disabled={disabled}
            className="w-full"
            variant="outline"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Next Quarter
          </Button>

          {(phase === 'Q2' || phase === 'Halftime') && (
            <Button
              onClick={onToggleHalftime}
              disabled={disabled}
              className="w-full"
              variant={phase === 'Halftime' ? 'default' : 'outline'}
            >
              {phase === 'Halftime' ? 'End Halftime' : 'Start Halftime'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
