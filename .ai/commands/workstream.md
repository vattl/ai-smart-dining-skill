# /workstream

Manage automatic workstream isolation and lifecycle.

Input: `$ARGUMENTS`

Typical intents:

- `/workstream status`
- `/workstream ensure <type> <parent-id> <title>`
- `/workstream list`
- `/workstream attach <WSID>`
- `/workstream close <WSID>`
- `/workstream cleanup <WSID>`

When shell/Python execution is available, prefer `.ai/scripts/workstream.py` for machine-verifiable operations.

---

# status

Inspect:

- current Git root
- current branch
- current worktree path
- registered workstreams
- active workstreams
- dirty state
- overlap/conflict risk when known

Do not modify the repository.

---

# ensure

Before non-trivial new work:

1. Inspect existing workstreams.
2. Search for a matching parent work ID/title/branch.
3. Resume existing matching workstream if one exists.
4. Classify isolation mode using `AUTO_ISOLATION_RULES.md`.
5. If WORKTREE is required and creation is safe:
   - allocate a Workstream ID,
   - create branch if needed,
   - create worktree,
   - create STATE.md,
   - register it,
   - return the worktree path to use.
6. If automation is unsafe, stop with a precise blocker.

Never manipulate unrelated dirty changes to make isolation convenient.

---

# attach

Attach the current agent/session to an existing workstream after verifying:

- workstream exists,
- branch/worktree mapping is valid,
- status permits continuation.

Then use `/continue` in that worktree.

---

# close

Use after successful merge/integration.

Record:

- status MERGED
- merge target
- merge/integration reference
- last validation
- cleanup eligibility

Do not remove the worktree as part of state recording unless cleanup safety is separately verified.

---

# cleanup

Only remove a managed worktree when:

- state is MERGED or explicitly ABANDONED,
- the worktree is clean,
- the path matches the recorded managed worktree,
- no active task remains.

Do not force remove by default.
Do not delete the branch by default.

---

# Final Output

Report:

Workstream:
Isolation Mode:
Branch:
Worktree:
Status:
Conflict Risk:
Action Taken:
Next Command:
