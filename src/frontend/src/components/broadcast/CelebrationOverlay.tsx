import { TeamIcon } from '../../backend';
import { getCelebrationImagePath, getTeamScoreboardName } from '../../lib/teamIcons';

interface CelebrationOverlayProps {
  teamIcon: TeamIcon | null;
  isVisible: boolean;
}

export default function CelebrationOverlay({ teamIcon, isVisible }: CelebrationOverlayProps) {
  if (!isVisible || !teamIcon) {
    return null;
  }

  const imagePath = getCelebrationImagePath(teamIcon);
  const teamName = getTeamScoreboardName(teamIcon);

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Celebration Image and Text - Left Side, Stacked Vertically */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <img
          src={imagePath}
          alt={`${teamName} celebration`}
          className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-2xl animate-pulse"
        />
        <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg scoreboard-text">
          {teamName} Score!
        </div>
      </div>
    </div>
  );
}
