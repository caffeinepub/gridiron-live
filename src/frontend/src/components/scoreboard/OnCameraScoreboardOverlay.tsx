import { getTeamIconInfo } from '../../lib/teamIcons';
import type { Scoreboard } from '../../backend';

interface OnCameraScoreboardOverlayProps {
  scoreboard: Scoreboard;
}

export default function OnCameraScoreboardOverlay({ scoreboard }: OnCameraScoreboardOverlayProps) {
  const team1Icon = getTeamIconInfo(scoreboard.team1Icon);
  const team2Icon = getTeamIconInfo(scoreboard.team2Icon);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-t-2 border-primary/50">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* VillanSpoon Label */}
          <div className="absolute left-2 top-2 text-xs font-semibold text-primary/80 tracking-wide">
            VillanSpoon
          </div>

          {/* Team 1 */}
          <div className="flex items-center gap-2 flex-1 mt-4">
            <div className="w-10 h-10 flex-shrink-0 bg-primary/20 rounded-lg p-1 border border-primary/30">
              <img
                src={team1Icon.imagePath}
                alt={team1Icon.alt}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/70 uppercase tracking-wide">Team A</span>
              <span className="text-xl font-bold scoreboard-text text-white">
                {scoreboard.team1Score.toString()}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 text-white/70 font-bold text-sm">VS</div>

          {/* Team 2 */}
          <div className="flex items-center gap-2 flex-1 justify-end mt-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/70 uppercase tracking-wide">Team B</span>
              <span className="text-xl font-bold scoreboard-text text-white">
                {scoreboard.team2Score.toString()}
              </span>
            </div>
            <div className="w-10 h-10 flex-shrink-0 bg-primary/20 rounded-lg p-1 border border-primary/30">
              <img
                src={team2Icon.imagePath}
                alt={team2Icon.alt}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
