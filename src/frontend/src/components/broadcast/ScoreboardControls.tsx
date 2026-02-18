import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { getTeamIconInfo, getTeamScoreboardName } from '../../lib/teamIcons';
import { useCelebrationOverlay } from '../../hooks/useCelebrationOverlay';
import type { Scoreboard, TeamRole } from '../../backend';

interface ScoreboardControlsProps {
  currentScoreboard: Scoreboard;
  onUpdate: (scoreboard: Scoreboard) => void;
  showThrowOff: boolean;
  onThrowOffToggle: (enabled: boolean) => void;
  disabled?: boolean;
  onCelebrationTrigger?: (teamIcon: string) => void;
}

export default function ScoreboardControls({
  currentScoreboard,
  onUpdate,
  showThrowOff,
  onThrowOffToggle,
  disabled,
  onCelebrationTrigger,
}: ScoreboardControlsProps) {
  const [team1Score, setTeam1Score] = useState(Number(currentScoreboard.team1Score));
  const [team2Score, setTeam2Score] = useState(Number(currentScoreboard.team2Score));
  const [team1Role, setTeam1Role] = useState<TeamRole>(currentScoreboard.team1Role);
  const [team2Role, setTeam2Role] = useState<TeamRole>(currentScoreboard.team2Role);

  const team1Icon = getTeamIconInfo(currentScoreboard.team1Icon);
  const team2Icon = getTeamIconInfo(currentScoreboard.team2Icon);
  const team1Name = getTeamScoreboardName(currentScoreboard.team1Icon);
  const team2Name = getTeamScoreboardName(currentScoreboard.team2Icon);

  const handleUpdate = () => {
    onUpdate({
      ...currentScoreboard,
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
    const newScore = team1Score + 1;
    setTeam1Score(newScore);
    onUpdate({
      ...currentScoreboard,
      team1Score: BigInt(newScore),
      team2Score: BigInt(team2Score),
      team1Role,
      team2Role,
    });
    
    // Trigger celebration for team 1
    if (onCelebrationTrigger) {
      onCelebrationTrigger(currentScoreboard.team1Icon);
    }
  };

  const decrementTeam1Score = () => {
    const newScore = Math.max(0, team1Score - 1);
    setTeam1Score(newScore);
    onUpdate({
      ...currentScoreboard,
      team1Score: BigInt(newScore),
      team2Score: BigInt(team2Score),
      team1Role,
      team2Role,
    });
  };

  const incrementTeam2Score = () => {
    const newScore = team2Score + 1;
    setTeam2Score(newScore);
    onUpdate({
      ...currentScoreboard,
      team1Score: BigInt(team1Score),
      team2Score: BigInt(newScore),
      team1Role,
      team2Role,
    });
    
    // Trigger celebration for team 2
    if (onCelebrationTrigger) {
      onCelebrationTrigger(currentScoreboard.team2Icon);
    }
  };

  const decrementTeam2Score = () => {
    const newScore = Math.max(0, team2Score - 1);
    setTeam2Score(newScore);
    onUpdate({
      ...currentScoreboard,
      team1Score: BigInt(team1Score),
      team2Score: BigInt(newScore),
      team1Role,
      team2Role,
    });
  };

  const setTeamAOnOffense = () => {
    const newTeam1Role = 'offense' as TeamRole;
    const newTeam2Role = 'defense' as TeamRole;
    setTeam1Role(newTeam1Role);
    setTeam2Role(newTeam2Role);
    onUpdate({
      ...currentScoreboard,
      team1Score: BigInt(team1Score),
      team2Score: BigInt(team2Score),
      team1Role: newTeam1Role,
      team2Role: newTeam2Role,
    });
  };

  const setTeamBOnOffense = () => {
    const newTeam1Role = 'defense' as TeamRole;
    const newTeam2Role = 'offense' as TeamRole;
    setTeam1Role(newTeam1Role);
    setTeam2Role(newTeam2Role);
    onUpdate({
      ...currentScoreboard,
      team1Score: BigInt(team1Score),
      team2Score: BigInt(team2Score),
      team1Role: newTeam1Role,
      team2Role: newTeam2Role,
    });
  };

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
              disabled={disabled || team1Score === 0}
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
                onBlur={handleUpdate}
                disabled={disabled}
                className="text-center text-2xl font-bold scoreboard-text"
              />
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={incrementTeam1Score}
              disabled={disabled}
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
              disabled={disabled || team2Score === 0}
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
                onBlur={handleUpdate}
                disabled={disabled}
                className="text-center text-2xl font-bold scoreboard-text"
              />
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={incrementTeam2Score}
              disabled={disabled}
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
              disabled={disabled}
              className="flex-1"
            >
              {team1Name}
            </Button>
            <Button
              variant={team2Role === 'offense' ? 'default' : 'outline'}
              onClick={setTeamBOnOffense}
              disabled={disabled}
              className="flex-1"
            >
              {team2Name}
            </Button>
          </div>
        </div>

        {/* ThrowOff Toggle */}
        <div className="space-y-3 pt-3 border-t border-border">
          <Label className="text-sm font-semibold text-primary">ThrowOff Indicator</Label>
          <div className="flex gap-3">
            <Button
              variant={showThrowOff ? 'default' : 'outline'}
              onClick={() => onThrowOffToggle(true)}
              disabled={disabled}
              className="flex-1"
            >
              Show
            </Button>
            <Button
              variant={!showThrowOff ? 'default' : 'outline'}
              onClick={() => onThrowOffToggle(false)}
              disabled={disabled}
              className="flex-1"
            >
              Hide
            </Button>
          </div>
          {showThrowOff && (
            <p className="text-xs text-muted-foreground">
              "ThrowOff" label is visible on camera overlay
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
