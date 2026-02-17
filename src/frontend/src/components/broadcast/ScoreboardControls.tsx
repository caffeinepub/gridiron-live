import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { TEAM_ICONS } from '../../lib/teamIcons';
import { useUpdateScoreboard } from '../../hooks/useQueries';
import type { Scoreboard, TeamIcon } from '../../backend';

interface ScoreboardControlsProps {
  sessionCode: string;
  currentScoreboard: Scoreboard;
  disabled?: boolean;
}

export default function ScoreboardControls({
  sessionCode,
  currentScoreboard,
  disabled,
}: ScoreboardControlsProps) {
  const [team1Score, setTeam1Score] = useState(Number(currentScoreboard.team1Score));
  const [team2Score, setTeam2Score] = useState(Number(currentScoreboard.team2Score));
  const [team1Icon, setTeam1Icon] = useState<TeamIcon>(currentScoreboard.team1Icon);
  const [team2Icon, setTeam2Icon] = useState<TeamIcon>(currentScoreboard.team2Icon);

  const updateMutation = useUpdateScoreboard();

  const handleUpdate = async () => {
    await updateMutation.mutateAsync({
      sessionCode,
      team1Score: BigInt(team1Score),
      team2Score: BigInt(team2Score),
      team1Icon,
      team2Icon,
    });
  };

  const handleTeam1ScoreChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setTeam1Score(num);
    } else if (value === '') {
      setTeam1Score(0);
    }
  };

  const handleTeam2ScoreChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setTeam2Score(num);
    } else if (value === '') {
      setTeam2Score(0);
    }
  };

  const hasChanges =
    team1Score !== Number(currentScoreboard.team1Score) ||
    team2Score !== Number(currentScoreboard.team2Score) ||
    team1Icon !== currentScoreboard.team1Icon ||
    team2Icon !== currentScoreboard.team2Icon;

  const isProcessing = updateMutation.isPending;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="scoreboard-text">Scoreboard Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team A Controls */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-primary">Team A</Label>
          <div className="flex items-center gap-3">
            <div className="w-24">
              <Input
                type="number"
                min="0"
                value={team1Score}
                onChange={(e) => handleTeam1ScoreChange(e.target.value)}
                disabled={disabled || isProcessing}
                className="text-center text-2xl font-bold scoreboard-text"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {TEAM_ICONS.map((icon) => (
              <button
                key={icon.value}
                type="button"
                onClick={() => setTeam1Icon(icon.value)}
                disabled={disabled || isProcessing}
                className={`w-14 h-14 rounded-lg border-2 p-1.5 transition-all ${
                  team1Icon === icon.value
                    ? 'border-primary bg-primary/20 scale-105'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <img src={icon.imagePath} alt={icon.alt} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Team B Controls */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-primary">Team B</Label>
          <div className="flex items-center gap-3">
            <div className="w-24">
              <Input
                type="number"
                min="0"
                value={team2Score}
                onChange={(e) => handleTeam2ScoreChange(e.target.value)}
                disabled={disabled || isProcessing}
                className="text-center text-2xl font-bold scoreboard-text"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {TEAM_ICONS.map((icon) => (
              <button
                key={icon.value}
                type="button"
                onClick={() => setTeam2Icon(icon.value)}
                disabled={disabled || isProcessing}
                className={`w-14 h-14 rounded-lg border-2 p-1.5 transition-all ${
                  team2Icon === icon.value
                    ? 'border-primary bg-primary/20 scale-105'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <img src={icon.imagePath} alt={icon.alt} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Update Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleUpdate}
          disabled={disabled || isProcessing || !hasChanges}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Scoreboard'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
