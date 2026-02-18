import { TeamIcon } from '../backend';

export interface TeamIconInfo {
  value: TeamIcon;
  label: string;
  imagePath: string;
  alt: string;
}

export const TEAM_ICONS: TeamIconInfo[] = [
  {
    value: 'dolphin' as TeamIcon,
    label: 'Dolphins',
    imagePath: '/assets/generated/icon-team-dolphin.dim_256x256.png',
    alt: 'Dolphin team icon',
  },
  {
    value: 'bullfrog' as TeamIcon,
    label: 'Bullfrogs',
    imagePath: '/assets/generated/icon-team-bullfrog.dim_256x256.png',
    alt: 'Bullfrog team icon',
  },
  {
    value: 'fist' as TeamIcon,
    label: 'Titans',
    imagePath: '/assets/generated/icon-team-fist.dim_256x256.png',
    alt: 'Fist team icon',
  },
  {
    value: 'tornado' as TeamIcon,
    label: 'Twisters',
    imagePath: '/assets/generated/icon-team-tornado.dim_256x256.png',
    alt: 'Tornado team icon',
  },
];

export function getTeamIconInfo(icon: TeamIcon): TeamIconInfo {
  const found = TEAM_ICONS.find((t) => t.value === icon);
  if (!found) {
    throw new Error(`Unknown team icon: ${icon}`);
  }
  return found;
}

export function getTeamScoreboardName(icon: TeamIcon): string {
  const iconInfo = getTeamIconInfo(icon);
  return iconInfo.label;
}

export function getCelebrationImagePath(icon: TeamIcon): string {
  // Use the team icon images as celebration images
  const celebrationMap: Record<TeamIcon, string> = {
    dolphin: '/assets/generated/icon-team-dolphin.dim_256x256.png',
    bullfrog: '/assets/generated/icon-team-bullfrog.dim_256x256.png',
    fist: '/assets/generated/icon-team-fist.dim_256x256.png',
    tornado: '/assets/generated/icon-team-tornado.dim_256x256.png',
  };

  return celebrationMap[icon];
}
