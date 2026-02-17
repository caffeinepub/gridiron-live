import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionLifecycleState } from '../../hooks/useSessionLifecycle';
import { Loader2, Radio, VideoOff, AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';
import { useViewerLiveStream } from '../../hooks/useViewerLiveStream';
import { Button } from '@/components/ui/button';

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
  const { videoRef, isConnecting, error, retry } = useViewerLiveStream(
    sessionCode,
    lifecycleState === 'live'
  );

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
          className="relative bg-black rounded-lg overflow-hidden"
          style={{ aspectRatio: '16/9', minHeight: '400px' }}
        >
          {lifecycleState === 'waiting' && (
            <div className="absolute inset-0 flex items-center justify-center text-center p-8">
              <div>
                <Loader2 className="h-16 w-16 text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-xl font-semibold text-foreground mb-2">Waiting for broadcast...</p>
                <p className="text-muted-foreground">
                  The broadcaster hasn't started streaming yet
                </p>
              </div>
            </div>
          )}

          {lifecycleState === 'live' && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={false}
                className="w-full h-full object-contain"
                style={{ aspectRatio: '16/9' }}
              />
              
              {isConnecting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-3" />
                    <p className="text-foreground font-medium">Connecting to stream...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
                  <div className="text-center max-w-md">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                    <p className="text-foreground font-semibold mb-2">Stream Unavailable</p>
                    <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
                    <Button onClick={retry} variant="outline" size="sm">
                      Retry Connection
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {lifecycleState === 'ended' && (
            <div className="absolute inset-0 flex items-center justify-center text-center p-8">
              <div>
                <VideoOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl font-semibold text-foreground mb-2">Broadcast Ended</p>
                <p className="text-muted-foreground">
                  The broadcaster has ended this session
                </p>
              </div>
            </div>
          )}

          {lifecycleState === 'unknown' && (
            <div className="absolute inset-0 flex items-center justify-center text-center p-8">
              <div>
                <Loader2 className="h-16 w-16 text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading session...</p>
              </div>
            </div>
          )}

          {children}
        </div>
      </CardContent>
    </Card>
  );
}
