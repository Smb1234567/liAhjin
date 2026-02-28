import type { Rank } from './xp';

export const rankExamContent: Record<Rank, { prompt: string; answer: string }> = {
  E: {
    prompt: 'What command prints the current working directory?',
    answer: 'pwd'
  },
  D: {
    prompt: 'Lock secret.txt to owner read/write only (numeric chmod).',
    answer: 'chmod 600 secret.txt'
  },
  C: {
    prompt: 'List all processes (common full command).',
    answer: 'ps aux'
  },
  B: {
    prompt: 'Show disk usage in human-readable form.',
    answer: 'df -h'
  },
  A: {
    prompt: 'Create a new user named hunter (standard command).',
    answer: 'useradd hunter'
  },
  S: {
    prompt: 'Generate an SSH key pair (default RSA).',
    answer: 'ssh-keygen'
  },
  SS: {
    prompt: 'Make a script executable (chmod symbolic).',
    answer: 'chmod +x script.sh'
  },
  SSS: {
    prompt: 'You are already at the top rank.',
    answer: ''
  }
};
