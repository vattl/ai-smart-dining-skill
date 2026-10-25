# AI Development OS v4.3 Usage

## Normal work

For a new product, use `/project` → `/research` → `/prd`, then enter `/work` after explicit product/PRD approval.

Executable gates:

- package: `python .ai/scripts/gate.py package`
- implementation ready: `python .ai/scripts/gate.py work --work-item <dir> --phase ready`
- acceptance: `python .ai/scripts/gate.py work --work-item <dir> --phase accept`
- release: `python .ai/scripts/gate.py release --work-item <dir> --release-evidence <file>`

Release requires Git integration plus artifact, deployment, smoke and production-verification evidence.

```text
/work
给订单列表增加订单来源筛选，并保证前后端完整支持。
```

The system should:
1. read project baseline
2. create/reuse one Work Item and route required tracks
3. discover current API/UI capability into one authoritative Impact Map
4. identify business invariants and any contract gap
5. design frontend + backend changes together
6. plan vertical slices and a Scenario Matrix for STANDARD+ work
7. pass `IMPLEMENTATION_READY = YES` before production edits
8. implement and verify end-to-end
9. accept with evidence, then distinguish integration and release state

## Structural UI

```text
/work
重构日志页面、二三级页面和弹窗，重新设计信息架构和视觉，但保留现有业务能力。
```

Expected route:
`UI_IMPACT=STRUCTURAL` → UI Design Track → HTML prototype/screenshot/critique/user approval/lock → production implementation → visual verification.

Before production UI implementation, also create `PROTOTYPE_INTERACTION_CONTRACT.md` and run:

```text
python .ai/scripts/validate_ui_capabilities.py --root . --ui-dir <artifact-dir> --phase plan
```

After implementation, run the same command with `--phase accept`. If it writes an OPEN `BACKEND_COORDINATION_REPORT.md`, show that report to the user and keep the UI BLOCKED/PARTIAL; do not replace missing interfaces with fake production behavior.

The same HTML review and explicit approval gate applies to REFINE/MINOR UI work; its prototype may be smaller, but it may not be skipped.

## Backend changed first
Use the same `/work`; the system should either update frontend consumers or generate a Frontend Consumer Handoff.

## Frontend need changed first
If the UI requires data/behavior the backend cannot provide, the system should generate a Backend Capability Request instead of inventing client-side fake behavior.

## Project baseline
Run `/baseline` when first installing into an existing repository. Normal `/work` reuses it and performs focused drift checks. Use `/rebaseline` only after accepted foundation changes.


## UI prototype rule

For every `/work` or `/ui` request that changes visible UI or interaction, the agent must create and present an isolated HTML/CSS/JS prototype before production UI implementation. Production editing remains blocked until you explicitly approve the rendered result and the approval is recorded as `Approval Status: APPROVED`.

After approval, run the translation plan gate before editing production UI. After implementation, present same-viewport prototype and production screenshots plus diff evidence; UI work cannot be accepted until the final fidelity gate reports `Target State Match: YES`, `Legacy Remaining: NO`, zero HIGH/CRITICAL deltas, and your explicit fidelity confirmation.
