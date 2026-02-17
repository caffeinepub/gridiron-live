import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionLifecycleState } from '../../hooks/useSessionLifecycle';
import { Loader2, Radio, VideoOff } from 'lucide-react';
import { ReactNode } from 'react';

interface ViewerVideoPlayerProps {
  sessionCode: string;
  lifecycleState: SessionLifecycleState;
  broadcaster?: string;
  children?: ReactNode;
}

export default function ViewerVideoPlayer({
  sessionCode,
  lifecycleState,
  broadcaster,
  children,
}: ViewerVideoPlayerProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="scoreboard-text">
            {broadcaster ? `${broadcaster}'s Game` : 'Live Game'}
          </span>
          {lifecycleState === 'live' && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-normal text-destructive">LIVE</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: '16/9', minHeight: '400px' }}
        >
          {lifecycleState === 'waiting' && (
            <div className="text-center p-8">
              <Loader2 className="h-16 w-16 text-muted-foreground animate-spin mx-auto mb-4" />
              <p className="text-xl font-semibold text-foreground mb-2">Waiting for broadcast...</p>
              <p className="text-muted-foreground">
                The broadcaster hasn't started streaming yet
              </p>
            </div>
          )}

          {lifecycleState === 'live' && (
            <div className="text-center p-8">
              <Radio className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-xl font-semibold text-foreground mb-2">Stream is Live!</p>
              <p className="text-muted-foreground text-sm">
                Session: {sessionCode}
              </p>
            </div>
          )}

          {lifecycleState === 'ended' && (
            <div className="text-center p-8">
              <VideoOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-foreground mb-2">Broadcast Ended</p>
              <p className="text-muted-foreground">
                The broadcaster has ended this session
              </p>
            </div>
          )}

          {lifecycleState === 'unknown' && (
            <div className="text-center p-8">
              <Loader2 className="h-16 w-16 text-muted-foreground animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading session...</p>
            </div>
          )}

          {children}
        </div>
      </CardContent>
    </Card>
  );
}
