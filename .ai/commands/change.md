# v4.0 Unified Routing

This command is a typed entry into `/work` with Work Type = `CHANGE`. Do not create a separate lifecycle. Attach all discovery, design, implementation, verification and acceptance evidence to the parent Work Item.


---

# /change

Use for an intentional behavior change.

## Required flow

1. Restate desired current-state → target-state delta.
2. Identify capability and authoritative owner.
3. Build Layer Impact Matrix.
4. Search direct + indirect consumers.
5. If contract semantics change, create Contract Delta.
6. Review semantic UI impact.
7. Break work into tasks with Definition of Done.
8. Implement the smallest coherent cross-layer change.
9. Verify request and response propagation.
10. Run consumer regression.
11. Record completion evidence.

Do not stop after the first layer passes.
