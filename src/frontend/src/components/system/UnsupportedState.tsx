import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function UnsupportedState() {
  return (
    <Card className="max-w-md mx-auto border-2 border-destructive">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <CardTitle className="text-2xl">Browser Not Supported</CardTitle>
        </div>
        <CardDescription>
          Your browser doesn't support the required features for live broadcasting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          To use Gridiron Live, please use a modern browser that supports:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Camera and microphone access (getUserMedia)</li>
          <li>WebRTC peer connections</li>
          <li>Modern JavaScript features</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          We recommend using the latest version of Chrome, Firefox, Safari, or Edge.
        </p>
      </CardContent>
    </Card>
  );
}
