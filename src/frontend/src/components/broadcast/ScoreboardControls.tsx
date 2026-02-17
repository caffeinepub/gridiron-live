import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Minus } from 'lucide-react';
import { getTeamIconInfo, getTeamScoreboardName } from '../../lib/teamIcons';
import { useUpdateScoreboard } from '../../hooks/useQueries';
import type { Scoreboard, TeamRole } from '../../backend';

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
  const [team1Role, setTeam1Role] = useState<TeamRole>(currentScoreboard.team1Role);
  const [team2Role, setTeam2Role] = useState<TeamRole>(currentScoreboard.team2Role);

  const updateMutation = useUpdateScoreboard();

  const team1Icon = getTeamIconInfo(currentScoreboard.team1Icon);
  const team2Icon = getTeamIconInfo(currentScoreboard.team2Icon);
  const team1Name = getTeamScoreboardName(currentScoreboard.team1Icon);
  const team2Name = getTeamScoreboardName(currentScoreboard.team2Icon);

  const handleUpdate = async () => {
    await updateMutation.mutateAsync({
      sessionCode,
      team1Score: BigInt(team1Score),
      team2Score: BigInt(team2Score),
      team1Role,
      team2Role,
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

  const incrementTeam1Score = () => {
    setTeam1Score((prev) => prev + 1);
  };

  const decrementTeam1Score = () => {
    setTeam1Score((prev) => Math.max(0, prev - 1));
  };

  const incrementTeam2Score = () => {
    setTeam2Score((prev) => prev + 1);
  };

  const decrementTeam2Score = () => {
    setTeam2Score((prev) => Math.max(0, prev - 1));
  };

  const setTeamAOnOffense = () => {
    setTeam1Role('offense' as TeamRole);
    setTeam2Role('defense' as TeamRole);
  };

  const setTeamBOnOffense = () => {
    setTeam1Role('defense' as TeamRole);
    setTeam2Role('offense' as TeamRole);
  };

  const hasChanges =
    team1Score !== Number(currentScoreboard.team1Score) ||
    team2Score !== Number(currentScoreboard.team2Score) ||
    team1Role !== currentScoreboard.team1Role ||
    team2Role !== currentScoreboard.team2Role;

  const isProcessing = updateMutation.isPending;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="scoreboard-text">Scoreboard Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team A Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex-shrink-0 bg-primary/20 rounded p-1 border border-primary/30">
              <img
                src={team1Icon.imagePath}
                alt={team1Icon.alt}
                className="w-full h-full object-contain"
              />
            </div>
            <Label className="text-sm font-semibold text-primary">{team1Name}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              onClick={decrementTeam1Score}
              disabled={disabled || isProcessing || team1Score === 0}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
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
            <Button
              size="icon"
              variant="outline"
              onClick={incrementTeam1Score}
              disabled={disabled || isProcessing}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Team B Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex-shrink-0 bg-primary/20 rounded p-1 border border-primary/30">
              <img
                src={team2Icon.imagePath}
                alt={team2Icon.alt}
                className="w-full h-full object-contain"
              />
            </div>
            <Label className="text-sm font-semibold text-primary">{team2Name}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              onClick={decrementTeam2Score}
              disabled={disabled || isProcessing || team2Score === 0}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
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
            <Button
              size="icon"
              variant="outline"
              onClick={incrementTeam2Score}
              disabled={disabled || isProcessing}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Offense Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-primary">On Offense</Label>
          <div className="flex gap-3">
            <Button
              variant={team1Role === 'offense' ? 'default' : 'outline'}
              onClick={setTeamAOnOffense}
              disabled={disabled || isProcessing}
              className="flex-1"
            >
              {team1Name}
            </Button>
            <Button
              variant={team2Role === 'offense' ? 'default' : 'outline'}
              onClick={setTeamBOnOffense}
              disabled={disabled || isProcessing}
              className="flex-1"
            >
              {team2Name}
            </Button>
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
