import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SessionCodeCardProps {
  sessionCode: string;
}

export default function SessionCodeCard({ sessionCode }: SessionCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-2 border-accent broadcast-glow">
      <CardHeader>
        <CardTitle className="text-xl">Session Code</CardTitle>
        <CardDescription>
          Share this code with viewers to let them watch your broadcast
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-accent/20 rounded-lg p-4 text-center">
            <span className="text-4xl font-bold scoreboard-text tracking-widest text-accent">
              {sessionCode}
            </span>
          </div>
          <Button
            size="lg"
            variant="outline"
            onClick={handleCopy}
            className="h-auto px-6"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
