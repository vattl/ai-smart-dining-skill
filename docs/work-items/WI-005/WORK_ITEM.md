# WORK ITEM — WI-005

## Request

修复 UI 原型进入开发后，原型交互因缺少后端接口而被实现成假功能，且最终没有明确输出需要后端协调的接口事项。

## Type

REPAIR

## State

ACCEPTED

## Requirement Contract

### Goal

把原型交互能力、后端契约、前端接入和端到端验证纳入 UI 开发前与验收硬门禁。

### Current behavior

- UI fidelity gate 只验证区域映射、结构、截图和用户视觉确认。
- 原型中的按钮、筛选、提交、状态变化等交互没有机器可验的能力矩阵。
- 缺少接口时，智能体可能用 mock、静态数据、空处理或前端假成功维持视觉效果。
- Backend Capability Request 虽已有模板，但不由 UI gate 强制，也不会形成最终协调清单。

### Target behavior

- 每个原型数据项和交互必须分类为 AVAILABLE / DERIVABLE / API_EXTENSION / NEW_API / NOT_SUPPORTED。
- API_EXTENSION / NEW_API 必须绑定真实 Backend Capability Request；NOT_SUPPORTED 必须先修改并重新批准原型，不能进入生产实现。
- plan gate 在生产 UI 编辑前验证能力映射完整、请求存在、没有未声明的后端假设。
- accept gate 要求所有生产交互 VERIFIED、后端请求 VERIFIED、未解决能力为 0、假功能为 0，并有端到端证据。
- 若仍需后端协作，必须生成 `BACKEND_COORDINATION_REPORT.md`，UI 只能 BLOCKED/PARTIAL，不能 ACCEPTED。

### Must preserve

- HTML 原型审批和视觉 fidelity 双门。
- 原型可使用明确标记的 PROTOTYPE_MOCK，但不得复制到生产路径。
- 前后端同一 Work Item 直接实现仍优先于跨团队 handoff。

### Acceptance criteria

- [x] 缺交互能力矩阵时 UI plan/accept gate 阻断。
- [x] NEW_API/API_EXTENSION 没有能力请求时阻断。
- [x] NOT_SUPPORTED 仍存在于已批准原型时阻断。
- [x] 未验证接口、前端假功能或缺 E2E 证据时 accept gate 阻断。
- [x] 有后端缺口时输出机器可读和人可读的协调报告。
- [x] 完整能力合同可通过 plan/accept，并保留全部既有回归测试。

## Impact Summary

Link: `IMPACT_MAP.md`

## Design Summary

Link: `IMPLEMENTATION_DESIGN.md`

## Tasks / Vertical Slices

- [x] T01：先写能力合同缺失、接口请求缺失、假功能和未验证交互的失败测试。
- [x] T02：实现 `validate_ui_capabilities.py` plan/accept 两阶段门禁及协调报告。
- [x] T03：接入统一 Work Gate、UI implement/verify、规则和模板。
- [x] T04：审查、全量回归、清单刷新和接受。

## Verification Evidence

- Capability gate tests: 7/7 PASS.
- Full workflow regression: 33/33 PASS.
- Work ready/accept gates and strict Work Item validation: PASS.
- Python compile: PASS.

## Review

PASS — five-axis review completed; two evidence-loophole findings were fixed before acceptance.

## Acceptance Decision

ACCEPTED

## Consumer Handoffs

NONE

## Integration / Release

NOT_INTEGRATED / NOT_RELEASED

## Related IDs

Workstream: WI-005  
Capability: prototype-interaction-contract-enforcement  
Commits: N/A — current directory is not a Git repository

## Business Invariants

- INV-INT-001：每个已批准原型交互必须映射到真实生产能力或先从原型移除。
- INV-INT-002：缺后端能力不得由生产前端 mock、静态成功或空事件替代。
- INV-INT-003：有未解决后端能力时必须输出协调报告且不得接受 UI。
- INV-INT-004：视觉 fidelity 通过不等于交互/契约通过。

## Impact Map Authority

- Impact map path: `docs/work-items/WI-005/IMPACT_MAP.md`
- Material UNKNOWN count: 0

## Scenario Matrix

- Scenario matrix path: `docs/work-items/WI-005/SCENARIO_MATRIX.md`
- Material NOT_VERIFIED count: 0

## Implementation Ready

- Status: `YES`
- Blockers: NONE

## Completion Level

`ACCEPTED`
