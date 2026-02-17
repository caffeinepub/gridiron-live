import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreboardShellProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function ScoreboardShell({ title, children, icon }: ScoreboardShellProps) {
  return (
    <Card className="border-2 border-primary/30 bg-card/95 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 scoreboard-text text-primary">
          {icon && <span className="text-accent">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
