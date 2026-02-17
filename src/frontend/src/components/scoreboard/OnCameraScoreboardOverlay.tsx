import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getTeamIconInfo, getTeamScoreboardName } from '../../lib/teamIcons';
import type { Scoreboard } from '../../backend';

interface OnCameraScoreboardOverlayProps {
  scoreboard: Scoreboard;
}

export default function OnCameraScoreboardOverlay({ scoreboard }: OnCameraScoreboardOverlayProps) {
  const team1Icon = getTeamIconInfo(scoreboard.team1Icon);
  const team2Icon = getTeamIconInfo(scoreboard.team2Icon);
  const team1Name = getTeamScoreboardName(scoreboard.team1Icon);
  const team2Name = getTeamScoreboardName(scoreboard.team2Icon);

  const team1OnOffense = scoreboard.team1Role === 'offense';
  const team2OnOffense = scoreboard.team2Role === 'offense';

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-t border-primary/50">
      <div className="px-2 py-0.5">
        <div className="flex items-center justify-between gap-2">
          {/* VillanSpoon Label */}
          <div className="absolute left-1.5 top-0.5 text-[8px] font-semibold text-primary/80 tracking-wide">
            VillanSpoon
          </div>

          {/* Team 1 */}
          <div className="flex items-center gap-1.5 flex-1 mt-2">
            <div className="w-6 h-6 flex-shrink-0 bg-primary/20 rounded p-0.5 border border-primary/30">
              <img
                src={team1Icon.imagePath}
                alt={team1Icon.alt}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-white/70 uppercase tracking-wide leading-tight">{team1Name}</span>
              <span className="text-base font-bold scoreboard-text text-white leading-tight">
                {scoreboard.team1Score.toString()}
              </span>
            </div>
          </div>

          {/* Centered Arrow */}
          <div className="flex-shrink-0 flex items-center justify-center mt-2">
            {team1OnOffense && (
              <ArrowLeft className="w-4 h-4 text-primary animate-pulse" />
            )}
            {team2OnOffense && (
              <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
            )}
            {!team1OnOffense && !team2OnOffense && (
              <div className="w-4 h-4" />
            )}
          </div>

          {/* Team 2 */}
          <div className="flex items-center gap-1.5 flex-1 justify-end mt-2">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-white/70 uppercase tracking-wide leading-tight">{team2Name}</span>
              <span className="text-base font-bold scoreboard-text text-white leading-tight">
                {scoreboard.team2Score.toString()}
              </span>
            </div>
            <div className="w-6 h-6 flex-shrink-0 bg-primary/20 rounded p-0.5 border border-primary/30">
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
