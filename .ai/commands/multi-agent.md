# /multi-agent

Plan and govern parallel agents for one Work Item.

1. Define the task dependency DAG and contract-first prerequisites.
2. Assign roles, owned areas and immutable handoff contracts in `AGENT_PLAN.md`.
3. Create isolated workstreams/worktrees for simultaneous mutable work.
4. Do not dispatch a dependent task before its input contract is stable.
5. Aggregate actual command/evidence results; do not convert agent claims into PASS.
6. Require an independent reviewer for implementation authored by another agent.
7. Resolve semantic conflicts in the declared integration order.

Only `Aggregation Status: PASS` satisfies the Multi Agent Gate.
