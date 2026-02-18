import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Video } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 scoreboard-text">
            Gridiron Live
          </h1>
          <p className="text-xl text-muted-foreground">
            Record your game with real-time scoreboard overlays
          </p>
        </div>

        <Card className="border-2 hover:border-primary transition-colors cursor-pointer broadcast-glow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/20">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Start Recording</CardTitle>
            </div>
            <CardDescription className="text-base">
              Record your game with live scoreboard controls and overlays
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="w-full text-lg"
              onClick={() => navigate({ to: '/broadcast' })}
            >
              Start Recording
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
