#!/usr/bin/env bash
# PreToolUse hook: warn when `gh pr create` runs without evidence
# that code-review / code-simplify agents have been invoked on the
# current branch's commits.
#
# Fires only when the Bash command contains `gh pr create`. Never
# blocks — just prints a reminder on stderr that Claude will see
# in its next turn and can act on.
#
# Registered via .claude/settings.json:
#   hooks.PreToolUse[matcher=Bash].hooks[].command

# NOTE: no `set -o pipefail` on purpose — grep -q returns early once it
# matches, which SIGPIPEs the upstream `git log` and propagates as a
# non-zero exit through pipefail. That would make the match look like a
# miss and spam the reminder on every PR. `set -eu` is still safe.
set -eu

input=$(cat)

# Fast exit: not a gh pr create call.
if [[ "$input" != *"gh pr create"* ]]; then
  exit 0
fi

# Fast exit: a recent commit mentions review/simplify activity.
# Covers our commit-message conventions (code-simplifier, code-review,
# refactor(simplifier), etc.) plus explicit [review] / [simplify] tags.
log_out=$(git log -20 --format=%s%n%b 2>/dev/null || true)
if echo "$log_out" \
  | grep -qiE '(code[- ]reviewer|code[- ]simplif|simplifier|review agent|\[review\]|\[simplify\])'; then
  exit 0
fi

# Skip on main / detached HEAD — PRs shouldn't be opened from there
# anyway, and the check is about branch-local work.
branch=$(git branch --show-current 2>/dev/null || echo "")
if [[ -z "$branch" || "$branch" == "main" || "$branch" == "master" ]]; then
  exit 0
fi

cat >&2 <<'REMINDER'

⚠️  Review gate reminder

About to run `gh pr create`, but the last 20 commits on this branch
don't show evidence of code-review / code-simplify having run.

Project CLAUDE.md requires both before opening a PR:
  • frontend-orchestration:code-review
  • frontend-orchestration:code-simplify

Their output should be committed BEFORE the PR is opened.

(This hook only reminds — it does not block. Proceeding…)

REMINDER

exit 0
