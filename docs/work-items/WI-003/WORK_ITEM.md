# WORK ITEM — WI-003

## Request

防止智能体批准 HTML 原型后仍受旧结构影响，只做近似可用实现便宣称完成。

## Type

REPAIR

## State

ACCEPTED

## Requirement Contract

### Goal

把“忠实落地原型”从原则升级为可机器检查的实施映射与后置视觉验收硬门槛。

### Current behavior

- 前置 gate 能证明 HTML 原型存在并已批准，但不能证明生产实现逐项遵循原型。
- Implementation Map、Measured Spec、Structural Diff 和 Screenshot Diff 只是建议性工件。
- 智能体可以保留旧结构、只做表层样式调整，然后以“功能可用”通过。

### Target behavior

- 生产 UI 编辑前，所有原型区域必须映射到生产组件/文件，未映射数为 0。
- 旧结构必须逐项标记 PRESERVE/MODIFY/MOVE/REPLACE/REMOVE，禁止未批准复用。
- UI 完成前必须有同视口原型截图、生产截图、差异图/报告和结构差异最终状态。
- `Target State Match=YES`、`Legacy Remaining=NO`、无 HIGH/CRITICAL delta，并再次把生产结果展示给用户确认，才可 ACCEPT。
- “大致相似”“功能可用”“沿用旧组件更省事”均不能替代证据。

### Must preserve

- 业务逻辑、可访问性和真实平台约束优先于盲目复制 HTML 代码。
- 原型 HTML 仍是设计合同，不是生产源码。
- 合理渲染差异必须显式记录并由用户接受，不能由智能体自行降级标准。

### Acceptance criteria

- [x] 新增生产 UI fidelity/translation gate。
- [x] 缺 Implementation Map、Measured Spec、Structural Diff 或截图差异报告时阻塞。
- [x] 未映射区域、空映射表、旧结构残留、目标状态不匹配时阻塞。
- [x] 未再次展示生产结果并获得用户确认时阻塞。
- [x] 完整证据集通过 plan/accept 两阶段 gate。
- [x] 原有 HTML 前置 gate 与全部回归测试继续通过。

### Open product questions

无。采用严格策略：不能以“差不多能用”作为视觉/结构验收标准。

## Impact Summary

Link: `IMPACT_MAP.md`

## Design Summary

Link: `IMPLEMENTATION_DESIGN.md`

## Tasks / Vertical Slices

- [x] T01：为缺失映射、旧结构残留和未确认生产结果编写失败测试。
- [x] T02：实现 `validate_ui_fidelity.py` 两阶段 gate。
- [x] T03：升级模板、实施/验证/接受规则与入口文档。
- [x] T04：完整正负向验证并刷新 MANIFEST。

## Verification Evidence

- `python -m unittest discover -s .ai/scripts/tests -v`：18/18 PASS。
- `--phase plan`：完整区域映射、度量和旧结构分类通过；缺文件或空表阻塞。
- `--phase accept`：完整同视口证据通过；旧结构残留、PARTIAL 目标、缺用户确认阻塞。
- Python `py_compile`、普通/release 策略检查、v4.2/v4.3 包检查、Baseline 与 Work Item 检查全部通过。

## Review

五轴复核：APPROVE。复核期间发现“状态字段填 0 但表为空”的形式主义绕过，已增加真实表数据行校验和回归测试。路径解析限制在仓库根目录，证据文件必须存在且非空；无新依赖。

## Acceptance Decision

ACCEPTED — 原型批准后的实施映射、旧结构处置、最终视觉证据和用户确认均已成为可执行硬门槛。

## Consumer Handoffs

NONE

## Integration / Release

ACCEPTED / NOT_INTEGRATED / NOT_RELEASED（当前目录非 Git 仓库）。

## Related IDs

Workstream: WI-003  
UI: workflow-ui-fidelity  
Capability: prototype-to-production-enforcement  
Commits: N/A

## Business Invariants

- INV-FID-001：所有原型区域必须有生产映射，未映射数为 0。
- INV-FID-002：旧结构不得未经批准继续存在。
- INV-FID-003：功能可用不等于视觉/结构验收通过。
- INV-FID-004：最终生产结果必须用同视口证据展示给用户确认。

## Impact Map Authority

- Impact map path: `docs/work-items/WI-003/IMPACT_MAP.md`
- Material UNKNOWN count: 0

## Scenario Matrix

- Scenario matrix path: `docs/work-items/WI-003/SCENARIO_MATRIX.md`
- Material NOT_VERIFIED count: 0

## Implementation Ready

- Status: `YES`
- Blockers: NONE

## Completion Level

`ACCEPTED`

