import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Video, Eye } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 scoreboard-text">
            Gridiron Live
          </h1>
          <p className="text-xl text-muted-foreground">
            Broadcast your game live with real-time scoreboard controls
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-primary transition-colors cursor-pointer broadcast-glow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Broadcast</CardTitle>
              </div>
              <CardDescription className="text-base">
                Start streaming your game with live scoreboard controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={() => navigate({ to: '/broadcast' })}
              >
                Start Broadcasting
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-accent/20">
                  <Eye className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Watch</CardTitle>
              </div>
              <CardDescription className="text-base">
                Enter a session code to watch a live game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg"
                onClick={() => navigate({ to: '/watch' })}
              >
                Watch Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
