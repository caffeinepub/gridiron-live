import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Flag } from 'lucide-react';
import { getTeamScoreboardName } from '../../lib/teamIcons';
import type { Scoreboard } from '../../backend';

interface FootballControlPanelProps {
  scoreboard: Scoreboard;
  onAddFlagEvent: (team: string, reason: string) => void;
}

export default function FootballControlPanel({
  scoreboard,
  onAddFlagEvent,
}: FootballControlPanelProps) {
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'team1' | 'team2' | null>(null);
  const [flagReason, setFlagReason] = useState('');

  const team1Name = getTeamScoreboardName(scoreboard.team1Icon);
  const team2Name = getTeamScoreboardName(scoreboard.team2Icon);

  const handleFlagSubmit = () => {
    if (!selectedTeam || !flagReason.trim()) return;

    const teamName = selectedTeam === 'team1' ? team1Name : team2Name;
    onAddFlagEvent(teamName, flagReason.trim());

    setFlagDialogOpen(false);
    setSelectedTeam(null);
    setFlagReason('');
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="scoreboard-text">Game Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" variant="outline" className="w-full">
              <Flag className="mr-2 h-5 w-5" />
              Flag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Flag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Which team?</Label>
                <div className="flex gap-3">
                  <Button
                    variant={selectedTeam === 'team1' ? 'default' : 'outline'}
                    onClick={() => setSelectedTeam('team1')}
                    className="flex-1"
                  >
                    {team1Name}
                  </Button>
                  <Button
                    variant={selectedTeam === 'team2' ? 'default' : 'outline'}
                    onClick={() => setSelectedTeam('team2')}
                    className="flex-1"
                  >
                    {team2Name}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flag-reason">Reason</Label>
                <Textarea
                  id="flag-reason"
                  placeholder="Enter flag reason..."
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleFlagSubmit}
                disabled={!selectedTeam || !flagReason.trim()}
              >
                Submit Flag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
