# Multi-Agent Orchestration Rules

Worktrees isolate files; they do not by themselves coordinate a product team.

When more than one agent works on a Work Item, create `AGENT_PLAN.md` before dispatch.

It must define:

- role and accountable output for every agent;
- task dependency DAG and sequential/parallel boundaries;
- owned files/modules/contracts and shared conflict surfaces;
- immutable input contract and expected handoff artifact;
- verification command and completion evidence per task;
- independent reviewer who did not author the reviewed implementation;
- integration order and evidence aggregation owner.

No agent may broaden its owned scope or assume another layer will adapt. Contract-first tasks land before dependent parallel tasks. `Aggregation Status: PASS` requires all handoffs received, required checks executed, semantic conflicts resolved and independent review complete.
