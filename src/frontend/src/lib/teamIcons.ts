import { TeamIcon } from '../backend';

export interface TeamIconInfo {
  value: TeamIcon;
  label: string;
  imagePath: string;
  alt: string;
}

export const TEAM_ICONS: TeamIconInfo[] = [
  {
    value: TeamIcon.dolphin,
    label: 'Dolphin',
    imagePath: '/assets/generated/icon-team-dolphin.dim_256x256.png',
    alt: 'Dolphin team icon',
  },
  {
    value: TeamIcon.bullfrog,
    label: 'Bullfrog',
    imagePath: '/assets/generated/icon-team-bullfrog.dim_256x256.png',
    alt: 'Bullfrog team icon',
  },
  {
    value: TeamIcon.fist,
    label: 'Fist',
    imagePath: '/assets/generated/icon-team-fist.dim_256x256.png',
    alt: 'Fist team icon',
  },
  {
    value: TeamIcon.tornado,
    label: 'Tornado',
    imagePath: '/assets/generated/icon-team-tornado.dim_256x256.png',
    alt: 'Tornado team icon',
  },
];

export function getTeamIconInfo(icon: TeamIcon): TeamIconInfo {
  return TEAM_ICONS.find((i) => i.value === icon) || TEAM_ICONS[0];
}
