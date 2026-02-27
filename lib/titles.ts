import type { Rank } from './xp';

export type Title = {
  key: string;
  label: string;
  description: string;
};

export const TITLES: Title[] = [
  { key: 'awakened', label: 'The Awakened One', description: 'Complete Chapter 1.' },
  { key: 'pipe-dream', label: 'Pipe Dream', description: 'Complete Chapter 4.' },
  { key: 'manpage', label: 'The One Who Reads Manpages', description: 'Use man or --help 50 times.' },
  { key: 'grep-god', label: 'Grep God', description: 'Solve 50 text processing challenges.' },
  { key: 'silent-hunter', label: 'Silent Hunter', description: 'Complete 10 challenges with zero hints and zero wrong attempts.' },
  { key: 'speed-demon', label: 'Speed Demon', description: 'Solve 20 challenges faster than par time.' },
  { key: 's-rank', label: 'S-Rank Hunter', description: 'Reach S rank.' }
];

export function checkRankTitle(rank: Rank) {
  return rank === 'S' || rank === 'SS' || rank === 'SSS' ? 's-rank' : null;
}
