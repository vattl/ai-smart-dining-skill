# WORK ITEM — WI-002

## Request

所有 UI 相关需求强制生成 HTML 原型，并交由用户审核确认后才能修改生产 UI。

## Type

CHANGE

## State

ACCEPTED

## Requirement Contract

### Goal

把 HTML 原型和用户明确批准设为所有 UI 变更的统一硬门槛。

### Current behavior

- 仅 STRUCTURAL / REFACTOR / REDESIGN 强制原型。
- 原型可以是 NATIVE、COMPONENT_COMPATIBLE 或 CONCEPT。
- 校验器接受 HTML、Dart、React/Vue/Svelte、小程序等多种可渲染文件。
- `WAIVED_BY_USER` 可作为批准替代条件。

### Target behavior

- `UI_IMPACT=MINOR|STRUCTURAL` 或 UI intent 为 REFINE/REFACTOR/REDESIGN 时，`PROTOTYPE_REQUIREMENT=REQUIRED`。
- `PROTOTYPE_MODE=HTML`，原型必须包含 `.html` 或 `.htm` 可渲染入口及截图。
- 必须把渲染结果展示给用户，并记录 `Approval Status: APPROVED`。
- NATIVE/COMPONENT_COMPATIBLE 原型和 `WAIVED_BY_USER` 不再满足门槛。
- 批准后才允许 UI Lock、生产实施计划和生产 UI 编辑。

### Must preserve

- 原型仍需基于真实项目技术、组件、字体、图标、数据和响应式约束进行可行性审计。
- HTML 原型是设计审查工件，不替代生产技术栈实现。
- 多页面、弹窗和关键状态继续使用 Prototype Coverage Matrix。
- `/work`、Impact Map、Scenario Matrix 和 `IMPLEMENTATION_READY` 生命周期保持不变。

### Acceptance criteria

- [x] UI 规则、入口、模板和用户文档一致规定 HTML-only 原型。
- [x] MINOR/REFINE UI 也必须进入 HTML 原型审核门槛。
- [x] UI gate 接受 HTML + 截图 + 同一记录中的 Presented YES/APPROVED + UI lock。
- [x] UI gate 拒绝 TSX/Vue/Dart 等非 HTML 原型。
- [x] UI gate 拒绝 `WAIVED_BY_USER`、未展示或分离的展示/批准记录。
- [x] v4.3 策略、包完整性和回归测试通过。

### Open product questions

无。按用户最新明确要求采用全 UI、HTML-only、不可豁免的严格策略。

## Impact Summary

Link: `IMPACT_MAP.md`

## Design Summary

Link: `IMPLEMENTATION_DESIGN.md`

## Tasks / Vertical Slices

- [x] T01：先用回归测试证明当前 gate 接受非 HTML/WAIVED。
- [x] T02：收紧 UI gate、路由和 Implementation Ready 规则。
- [x] T03：同步 Skill、命令、模板、安装/使用和原型文档。
- [x] T04：正负向验收并刷新 MANIFEST。

## Verification Evidence

- `python -m unittest discover -s .ai/scripts/tests -v`：11/11 PASS。
- UI gate 正向：HTML + 截图 + 同一批准记录内 `Presented To User: YES` 与 `Approval Status: APPROVED` + UI lock → PASS。
- UI gate 负向：TSX-only、`WAIVED_BY_USER`、未展示、展示/批准分离 → BLOCKED。
- `python .ai/scripts/validate.py` 与 `--release`：0 errors（仅非 Git 预期警告）。
- `python .ai/scripts/validate_v43_package.py .`：结构、语义、清单 PASS。

## Review

五轴复核：APPROVE。复核期间发现“展示与批准可来自不同文件”的证据拼接漏洞，已增加失败测试并要求两者位于同一批准记录。无新依赖、无网络/凭证访问，文件扫描有界。

## Acceptance Decision

ACCEPTED — 用户要求的 HTML-only、必须展示并明确批准的 UI 前置门槛已有可执行规则和回归证据。

## Consumer Handoffs

NONE

## Integration / Release

ACCEPTED / NOT_INTEGRATED / NOT_RELEASED（当前目录非 Git 仓库）。

## Related IDs

Workstream: WI-002  
UI: workflow-ui-prototype-policy  
Capability: html-prototype-approval-gate  
Commits: N/A

## Business Invariants

- INV-UI-001：所有 UI 变更必须先有 HTML 原型和视觉证据。
- INV-UI-002：用户明确 APPROVED 是生产 UI 编辑的必要条件。
- INV-UI-003：HTML 原型不得替代真实生产技术栈或伪造后端能力。
- INV-UI-004：生产 UI 编辑前必须 `IMPLEMENTATION_READY=YES`。

## Impact Map Authority

- Impact map path: `docs/work-items/WI-002/IMPACT_MAP.md`
- Material UNKNOWN count: 0

## Scenario Matrix

- Scenario matrix path: `docs/work-items/WI-002/SCENARIO_MATRIX.md`
- Material NOT_VERIFIED count: 0

## Implementation Ready

- Status: `YES`
- Blockers: NONE

## Completion Level

`ACCEPTED`

