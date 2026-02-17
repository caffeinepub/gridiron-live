import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAddFlagEvent } from '../../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { getTeamScoreboardName } from '../../lib/teamIcons';
import type { Scoreboard } from '../../backend';

interface FootballControlPanelProps {
  sessionCode: string;
  disabled?: boolean;
  scoreboard?: Scoreboard;
}

export default function FootballControlPanel({ sessionCode, disabled, scoreboard }: FootballControlPanelProps) {
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'team1' | 'team2' | ''>('');
  const [flagReason, setFlagReason] = useState('');

  const addFlagMutation = useAddFlagEvent();

  const team1Name = scoreboard ? getTeamScoreboardName(scoreboard.team1Icon) : 'Team A';
  const team2Name = scoreboard ? getTeamScoreboardName(scoreboard.team2Icon) : 'Team B';

  const handleFlagClick = () => {
    setFlagDialogOpen(true);
    setSelectedTeam('');
    setFlagReason('');
  };

  const handleFlagSubmit = async () => {
    if (!selectedTeam || !flagReason.trim() || !scoreboard) return;

    const teamName = selectedTeam === 'team1' ? team1Name : team2Name;

    await addFlagMutation.mutateAsync({
      sessionCode,
      team: teamName,
      reason: flagReason.trim(),
    });

    setFlagDialogOpen(false);
    setSelectedTeam('');
    setFlagReason('');
  };

  const isProcessing = addFlagMutation.isPending;
  const canSubmit = selectedTeam && flagReason.trim() && !isProcessing && scoreboard;
  const isBlocked = !scoreboard;

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="scoreboard-text">Game Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            variant="destructive"
            className="w-full h-32 flex flex-col gap-3 text-lg"
            onClick={handleFlagClick}
            disabled={disabled || isProcessing || isBlocked}
            title={isBlocked ? 'Please select team icons before adding flags' : undefined}
          >
            <img
              src="/assets/generated/icon-flag.dim_256x256.png"
              alt="Flag"
              className="h-16 w-16 object-contain"
            />
            <span className="scoreboard-text">Flag</span>
          </Button>
          {isBlocked && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Select team icons to enable flags
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="scoreboard-text">Flag Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Team</Label>
              <div className="flex gap-2">
                <Button
                  variant={selectedTeam === 'team1' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setSelectedTeam('team1')}
                  disabled={isProcessing}
                >
                  {team1Name}
                </Button>
                <Button
                  variant={selectedTeam === 'team2' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setSelectedTeam('team2')}
                  disabled={isProcessing}
                >
                  {team2Name}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="flag-reason">Reason</Label>
              <Input
                id="flag-reason"
                placeholder="Enter flag reason"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                disabled={isProcessing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSubmit) {
                    handleFlagSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFlagDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFlagSubmit}
              disabled={!canSubmit}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Flag'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
