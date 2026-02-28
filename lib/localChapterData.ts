import { slugify } from './slug';

export type LocalChapter = {
  id: number;
  order_index: number;
  title: string;
  description: string;
  rank_required: string;
};

export const localChapters: LocalChapter[] = [
  { id: 1, order_index: 1, title: 'Awakening', description: 'Terminal basics.', rank_required: 'E' },
  { id: 2, order_index: 2, title: 'First Steps', description: 'File and directory management.', rank_required: 'E' },
  { id: 3, order_index: 3, title: 'Reading the World', description: 'Text processing basics.', rank_required: 'D' },
  { id: 4, order_index: 4, title: 'Power of Pipes', description: 'Pipes and redirection.', rank_required: 'D' },
  { id: 5, order_index: 5, title: 'Hidden Knowledge', description: 'Permissions and ownership.', rank_required: 'D' },
  { id: 6, order_index: 6, title: 'Finding the Path', description: 'Search and find.', rank_required: 'C' },
  { id: 7, order_index: 7, title: 'The Architect', description: 'Advanced text processing.', rank_required: 'C' },
  { id: 8, order_index: 8, title: 'Process Hunter', description: 'Process management.', rank_required: 'C' },
  { id: 9, order_index: 9, title: 'Network Scout', description: 'Networking basics.', rank_required: 'B' },
  { id: 10, order_index: 10, title: 'System Whisperer', description: 'System info and monitoring.', rank_required: 'B' },
  { id: 11, order_index: 11, title: 'Shell Scribe', description: 'Shell scripting.', rank_required: 'B' },
  { id: 12, order_index: 12, title: 'The Dungeon Master', description: 'Advanced scripting.', rank_required: 'A' },
  { id: 13, order_index: 13, title: 'Shadow Admin', description: 'Users and security.', rank_required: 'A' },
  { id: 14, order_index: 14, title: 'S-Rank Trial', description: 'Real world scenarios.', rank_required: 'S' }
];

export function getLocalChapterBySlug(slug: string) {
  return localChapters.find((chapter) => slugify(chapter.title) === slug) ?? null;
}
