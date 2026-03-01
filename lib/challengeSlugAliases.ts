export const legacyChallengeSlugMap: Record<string, string> = {
  'pwd-trace': 'pwd-ls-cd',
  'ls-record': 'paths-01',
  'help-scroll': 'help-01',
  'touch-report': 'touch-01',
  'mkdir-structure': 'mkdir-01',
  'copy-file': 'cp-01',
  'move-file': 'mv-01',
  'grep-errors': 'grep-01',
  'wc-lines': 'grep-flags',
  'sort-numbers': 'wc-01',
  'cut-columns': 'sort-01',
  'pipe-filter': 'pipe-01',
  'append-log': 'redir-01',
  'tee-signal': 'stderr-01',
  'xargs-touch': 'tee-01',
  'chmod-01': 'perm-strings',
  'chmod-755': 'chmod-01',
  'sticky-share': 'chown-01',
  'sed-replace': 'sed-sub',
  'sed-delete': 'sed-lines',
  'awk-columns': 'awk-cols',
  'awk-sum': 'awk-filter',
  'ps-aux': 'ps-01',
  'kill-sleep': 'pgrep-01',
  'pgrep-target': 'kill-01',
  'killall-sleep': 'jobs-01',
  'ping-localhost': 'ping-01',
  'ss-ports': 'ss-01',
  'curl-file': 'curl-01',
  'df-report': 'df-01',
  'free-report': 'free-01',
  'lscpu-report': 'lscpu-01',
  'uptime-report': 'uptime-01',
  'script-hello': 'script-01',
  'script-args': 'vars-01',
  'script-if': 'if-01',
  'script-loop': 'loop-01',
  'cron-entry': 'cron-01',
  'trap-signal': 'at-01',
  'heredoc-msg': 'trap-01',
  'regex-hunt': 'heredoc-01',
  'useradd-hunter': 'useradd-01',
  'groupadd-hunters': 'group-01',
  'ssh-keygen': 'sudo-01',
  'gpg-encrypt': 'ssh-keygen-01',
  'trial-forensics': 'trial-logs'
};

const mappedTargetSlugs = new Set(Object.values(legacyChallengeSlugMap));
const remappableLegacyChallengeSlugMap = Object.fromEntries(
  Object.entries(legacyChallengeSlugMap).filter(([legacySlug]) => !mappedTargetSlugs.has(legacySlug))
);

const reverseLegacyChallengeSlugMap = Object.entries(remappableLegacyChallengeSlugMap).reduce(
  (acc, [legacySlug, canonicalSlug]) => {
    const list = acc[canonicalSlug] ?? [];
    list.push(legacySlug);
    acc[canonicalSlug] = list;
    return acc;
  },
  {} as Record<string, string[]>
);

export function normalizeChallengeSlug(slug: string) {
  return remappableLegacyChallengeSlugMap[slug] ?? slug;
}

export function getChallengeSlugCandidates(slug: string) {
  const normalized = normalizeChallengeSlug(slug);
  const candidates = new Set<string>([slug, normalized]);
  (reverseLegacyChallengeSlugMap[slug] ?? []).forEach((legacySlug) => candidates.add(legacySlug));
  (reverseLegacyChallengeSlugMap[normalized] ?? []).forEach((legacySlug) => candidates.add(legacySlug));
  return Array.from(candidates);
}
