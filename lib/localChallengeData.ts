export type LocalChallenge = {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  xp_reward: number;
  time_limit_seconds: number;
  hints: string[];
  setup_script: string;
  validator_script: string;
};

export const fallbackChallenges: LocalChallenge[] = [
  {
    id: 1001,
    slug: 'echo-hello',
    title: 'Hello Terminal',
    description: 'Run echo to print hello world.',
    difficulty: 'E',
    tags: ['terminal', 'concept'],
    xp_reward: 30,
    time_limit_seconds: 60,
    hints: [
      'Use echo to print text.',
      'Redirect output into a file.',
      'echo "hello world" > /tmp/hello.txt'
    ],
    setup_script: 'true',
    validator_script: 'test -f /tmp/hello.txt && echo PASS || echo FAIL'
  },
  {
    id: 1002,
    slug: 'chmod-01',
    title: 'Lock it down',
    description: 'Set secret.txt to 600.',
    difficulty: 'D',
    tags: ['permissions', 'chmod'],
    xp_reward: 75,
    time_limit_seconds: 120,
    hints: [
      'Owner read/write only.',
      'Try chmod 600 /tmp/secret.txt.',
      'Check with stat -c "%a" /tmp/secret.txt.'
    ],
    setup_script: 'echo secret > /tmp/secret.txt && chmod 777 /tmp/secret.txt',
    validator_script: 'perms=$(stat -c "%a" /tmp/secret.txt); [ "$perms" = "600" ] && echo PASS || echo FAIL'
  }
];

export function getFallbackChallengeBySlug(slug: string) {
  return fallbackChallenges.find((challenge) => challenge.slug === slug) ?? null;
}
