# Impact Map — WI-001

## Authoritative Owner

- Lifecycle semantics: `.ai/rules/WORKFLOW_CORE.md` and `docs/WORKFLOW_V4_2.md`.
- Entry routing: `.ai/commands/work.md` and `.ai/rules/WORKFLOW_ROUTER_RULES.md`.
- Machine enforcement: `.ai/scripts/validate.py` plus version package validators.
- Distribution integrity: `MANIFEST.json`.

## Change Propagation Path

```text
User invokes /work or /policy-check
→ entry documentation selects v4.3 lifecycle
→ validate.py runs governance and v4.3 package checks
→ validate_v43_package.py checks semantic markers and manifest integrity
→ actionable PASS/WARN/ERROR output
→ trustworthy acceptance evidence
```

## Consumer Coverage

| Consumer | Relationship | Classification | Needs Change | Evidence |
|---|---|---|---|---|
| Coding agents reading `AGENTS.md` / `.ai/SKILL.md` | primary entry | AFFECTED | YES | stale v4.1 headings |
| Users reading `README.md` / `USAGE.md` | operator guidance | AFFECTED | YES | old lifecycle and usage heading |
| `/policy-check` | validator caller | AFFECTED | YES | delegates to stale main validator |
| versioned package validators | compatibility checks | AFFECTED | YES | v4.3 validator is presence-only |
| UI prototype gate | preserved invariant | VERIFIED_UNAFFECTED | NO | rules remain authoritative |

## Layer Coverage

| Layer | Classification | Reason / Evidence |
|---|---|---|
| UI | NOT_APPLICABLE | No product UI or structural layout change. |
| Interaction | NOT_APPLICABLE | CLI/document workflow only. |
| Frontend State | NOT_APPLICABLE | No frontend runtime. |
| API Client | NOT_APPLICABLE | No API client. |
| Request Contract | VERIFIED_UNAFFECTED | `/work` input contract is unchanged. |
| Backend/Domain | AFFECTED | Workflow validation policy and lifecycle semantics. |
| Persistence | AFFECTED | `MANIFEST.json` integrity metadata. |
| Response Contract | AFFECTED | Validator output/version and error reporting. |
| Jobs/Events/Integrations | VERIFIED_UNAFFECTED | No external integrations. |
| Config/Security | VERIFIED_UNAFFECTED | No permission or secret changes. |
| Runtime/NFR | AFFECTED | Validator remains dependency-free and bounded to package files. |
| Tests | AFFECTED | Add positive/release/negative validation evidence. |

Classifications: AFFECTED / VERIFIED_UNAFFECTED / NOT_APPLICABLE / UNKNOWN.

## Duplicate Logic / Patch Smells

- Version-specific validators duplicate required-file lists; v4.3 should compose prior-version checks through semantic coverage rather than merely add another shallow existence list.
- `validate.py` and `validate_v43_package.py` currently present two different notions of “valid”.

## Contract Delta Summary

No external API delta. CLI compatibility is preserved: `validate.py [--release]` and `validate_v43_package.py [root]` remain valid. Validation becomes stricter and error messages more specific.

## UI Semantic Impact

NONE. `UI_DESIGN_TRACK=NOT_REQUIRED`; `PROTOTYPE_REQUIREMENT=OPTIONAL`; no production UI files are affected.

## Risks

- Stricter checks may expose intentionally stale downstream copies; messages must identify exact files/markers.
- Updating any package file invalidates the manifest until it is regenerated as the final mutable step.
- This working directory has no Git metadata, so integration evidence cannot be produced here.

