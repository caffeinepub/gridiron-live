import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useViewerLiveStream } from '../../hooks/useViewerLiveStream';

interface ViewerVideoPlayerProps {
  sessionCode: string;
  lifecycleState: 'waiting' | 'live' | 'ended' | 'unknown';
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

  const showStreamUnavailable = lifecycleState === 'live' && (error || isConnecting);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Stream</span>
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
          className="relative w-full bg-black rounded-lg overflow-hidden"
          style={{ aspectRatio: '16/9', minHeight: '300px' }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {children}

          {lifecycleState === 'waiting' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white p-6">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium mb-2">Waiting for broadcast to start</p>
                <p className="text-sm text-gray-400">
                  {broadcaster ? `${broadcaster} will start soon` : 'The broadcaster will start soon'}
                </p>
              </div>
            </div>
          )}

          {lifecycleState === 'ended' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white p-6">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Broadcast has ended</p>
                <p className="text-sm text-gray-400">
                  {broadcaster ? `${broadcaster}'s broadcast has finished` : 'This broadcast has finished'}
                </p>
              </div>
            </div>
          )}

          {showStreamUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
              <div className="text-center text-white p-6 max-w-md">
                {isConnecting ? (
                  <>
                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                    <p className="text-lg font-medium mb-2">Connecting to stream...</p>
                    <p className="text-sm text-gray-400">
                      Establishing connection to the broadcaster
                    </p>
                  </>
                ) : error ? (
                  <>
                    <div className="mb-4 p-4 rounded-full bg-destructive/20 inline-block">
                      <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <p className="text-lg font-medium mb-2">Stream Unavailable</p>
                    <p className="text-sm text-gray-400 mb-6">
                      {error.message}
                    </p>
                    <Button
                      onClick={retry}
                      variant="default"
                      size="lg"
                      className="bg-[oklch(0.65_0.15_45)] hover:bg-[oklch(0.60_0.15_45)]"
                    >
                      Retry Connection
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
