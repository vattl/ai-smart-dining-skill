# Implementation Plan: Full Product Delivery Governance

## Overview

Implement WI-004 in four verified slices: executable gate foundation, lifecycle evidence contracts, authority cleanup, then package/integration verification.

## Architecture Decisions

- One orchestrator selects required sub-gates; focused validators remain reusable.
- Evidence files use stable machine-readable `Field: Value` markers plus human-readable sections.
- Release success requires repository and deployment evidence, not document presence.

## Task List

### Phase 1 — Executable gates
- [x] T01 Write failing orchestrator tests.
- [x] T02 Implement package/work/release modes and compatibility routing.

### Phase 2 — Lifecycle contracts
- [x] T03 Add inception/research/PRD approval commands, rules and templates.
- [x] T04 Add security, test, multi-agent and release evidence contracts.

### Phase 3 — Authority and verification
- [x] T05 Remove current UI waiver/version conflicts and update entry docs.
- [x] T06 Update package semantics/manifest and run all checks.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Provider-specific deployment cannot be generalized | require explicit project command/result/artifact evidence |
| Existing package-check callers break | keep default `validate.py`; add explicit strict release arguments |
| Evidence-only compliance | verify paths/fields and require independent review/user approvals where applicable |

## Open Questions

None.
