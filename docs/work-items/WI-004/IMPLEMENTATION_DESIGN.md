# Implementation Design — WI-004

## Root Fix / Owner

Introduce `.ai/scripts/gate.py` as the single phase-gate orchestrator. Individual validators remain focused implementations; the orchestrator owns required-gate selection and result aggregation.

## CLI Contract

```text
python .ai/scripts/gate.py package
python .ai/scripts/gate.py work --work-item <directory>
python .ai/scripts/gate.py release --work-item <directory> --release-evidence <file>
```

`validate.py` remains the compatibility entry. Normal invocation remains a package/policy check; `--release` delegates to strict release semantics and therefore requires explicit Work Item and release evidence.

## Evidence Contracts

- Product: Project Charter, Research Brief, Product Analysis, PRD Approval.
- Engineering: Work Item, Impact Map, Implementation Design, Scenario Matrix, Implementation Ready Report.
- UI: existing HTML prototype and plan/accept fidelity gates.
- Multi Agent: Agent Plan with DAG, ownership, handoff, independent reviewer and aggregation status.
- Security: Threat Model/Security Audit with findings and decision.
- Test: Test Strategy/Matrix with required checks and actual results.
- Release: integrated commit, artifact identity/hash, environment, deployment result, smoke result, production verification, rollback readiness and approval.

## Gate Semantics

- `package`: validates installation structure/manifest only and never claims implementation or release readiness.
- `work`: validates current Work Item structure plus route-declared evidence. Missing or PENDING required evidence fails.
- `release`: includes work gate, requires Git repository/integrated commit and validated release evidence. Preparation is not deployment.

## Compatibility

Individual UI/cross-layer validators remain callable. Existing `validate.py` without release arguments remains supported.

## Security / Permissions

All validators are local read-only operations. Evidence paths must resolve inside repository root. No secrets are read or emitted.

## Verification Strategy

TDD fixtures prove missing evidence fails, package check does not claim release, complete work evidence passes, and release cannot pass outside Git or without deploy evidence. Existing 18 tests remain green.

## Rollback / Recovery

New files are additive. Compatibility changes to `validate.py` can be reverted independently; documentation additions remain harmless if the orchestrator is reverted.
