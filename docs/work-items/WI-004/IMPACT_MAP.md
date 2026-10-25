# Impact Map — WI-004

## Authoritative Owner

- Lifecycle: `.ai/rules/WORKFLOW_CORE.md`
- Routing/readiness: `.ai/commands/work.md`, `.ai/rules/IMPLEMENTATION_READY_RULES.md`
- Machine enforcement: `.ai/scripts/gate.py`, compatibility `.ai/scripts/validate.py`
- Package integrity: `.ai/scripts/validate_v43_package.py`

## Change Propagation Path

```text
idea/research evidence → approved PRD → implementation design
→ implementation-ready route → development/workstreams
→ self verify/review → security gate → test gate → acceptance
→ integration → release readiness → deploy evidence → production verify → release/monitor/close
```

## Consumer Coverage

| Consumer | Classification | Change |
|---|---|---|
| `/init`, `/work` | AFFECTED | add product inception and routed gate requirements |
| `/policy-check`, `/release` | AFFECTED | call scope-specific gate semantics |
| UI commands/validators | VERIFIED_UNAFFECTED | remain required sub-gates |
| Workstream rules | AFFECTED | add orchestration DAG, ownership and independent review evidence |
| Test rules | AFFECTED | add minimum matrix/evidence contract |
| Security track | AFFECTED | create missing command/rules/template |
| Release governance | AFFECTED | require artifact/deploy/smoke/production evidence |
| Package validator/tests | AFFECTED | guard new files and semantics |

## Layer Coverage

| Layer | Classification | Reason |
|---|---|---|
| Product/UI | NOT_APPLICABLE | workflow package only; no production UI |
| Commands/routing | AFFECTED | lifecycle and entry commands change |
| Rules/contracts | AFFECTED | new mandatory evidence contracts |
| Scripts/runtime | AFFECTED | new gate orchestration behavior |
| Tests | AFFECTED | positive/negative gate coverage |
| Documentation | AFFECTED | authoritative lifecycle and conflict cleanup |
| Git/release | AFFECTED | integration/release truth becomes executable |
| Security | AFFECTED | new specialist track |

## Risks

- Generic workflow cannot know every project test/deploy command; evidence contracts must require commands and outcomes without inventing provider-specific execution.
- Strict release checks may break callers that treated `--release` as package validation; preserve explicit `package` scope for that use case.
- New evidence can still be falsified manually; commands, paths, hashes and reviewer identity reduce but cannot eliminate dishonesty.
