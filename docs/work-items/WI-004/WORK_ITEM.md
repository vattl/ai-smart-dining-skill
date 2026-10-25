# WORK ITEM — WI-004

## Request

依据全栈产品交付流程审计，补全从立项、调研、PRD、技术/UI 设计、多 Agent 开发、安全审计、测试、部署到提交关闭的完整生命周期，并把关键规则接入不可静默跳过的统一门禁。

## Type

REPAIR

## State

ACCEPTED

## Requirement Contract

### Goal

将 v4.3 从“工程变更规则集合”升级为具有产品前置阶段、统一状态机和可执行阶段门的全栈产品交付工作流。

### Current behavior

- `/init` 从产品意图直接进入 MVP/PRD，缺少研究、机会判断和 Go/No-Go。
- `validate.py --release` 只验证文档/包结构，可能在无 Git、无部署证据时通过。
- Work Item、UI、跨层、Security、Test、Release 校验器未由统一入口按路由强制执行。
- Security、测试矩阵、多 Agent 编排和部署证明没有完整证据合同。
- v4.3 无豁免策略与旧文档中的 WAIVED 值冲突。

### Target behavior

- 定义 IDEA 到 CLOSED 的唯一产品交付状态机和阶段证据。
- 明确分离 package/work/release 三类检查。
- Work Gate 根据 Work Item 路由自动执行适用的子门禁；required gate 未运行即失败。
- Release Gate 在没有 Git 集成、构建产物、部署、冒烟和生产验证证据时失败。
- 新增立项/研究/PRD、安全、测试、多 Agent、发布证据模板和命令。
- 清理 UI waiver 与版本权威冲突。

### Must preserve

- 现有 UI HTML 原型和两阶段 fidelity gate 行为。
- Impact Map、Scenario Matrix、业务不变量与跨层契约规则。
- 旧 `validate.py` 的普通包校验入口兼容；发布检查语义变严格。
- 不引入第三方 Python 依赖。

### Acceptance criteria

- [x] package/work/release 三类检查有明确不同的 CLI 和结果语义。
- [x] 缺失阶段证据、Git 集成证据或部署证据时对应 gate 失败。
- [x] 完整 fixture 能通过 Work 和 Release Gate。
- [x] 产品研究、PRD 审批、安全、测试、多 Agent 和发布证据有正式模板与规则。
- [x] UI waiver 冲突被清理。
- [x] 全部自动化测试和包完整性校验通过。

### Open product questions

无。按审计报告优先修复可绕过门禁，再补全生命周期工件。

## Impact Summary

Link: `IMPACT_MAP.md`

## Design Summary

Link: `IMPLEMENTATION_DESIGN.md`

## Tasks / Vertical Slices

- [x] T01：用失败测试定义统一 Gate Orchestrator 的 work/release 阻断行为。
- [x] T02：实现统一 gate CLI 及兼容入口。
- [x] T03：补齐产品前置、安全、测试、多 Agent、部署/提交规则与模板。
- [x] T04：清理权威冲突，接入包语义校验并完成全量验证。

## Verification Evidence

- 25/25 automated tests PASS.
- Work ready and accept gates PASS.
- Package gate and compatibility policy check PASS.
- Strict release check BLOCKED as designed because this directory has no Git/deployment evidence.
- Python compile and secret-pattern scan PASS.

## Review

PASS — adversarial review fixed path case handling, presence-only product approval, missing UI approval orchestration, missing multi-agent reviewer evidence and missing integration-branch binding.

## Acceptance Decision

ACCEPTED

## Consumer Handoffs

NONE

## Integration / Release

NOT_INTEGRATED / NOT_RELEASED

## Related IDs

Workstream: WI-004  
Capability: full-product-delivery-governance  
Commits: N/A — current directory is not a Git repository

## Business Invariants

- INV-GATE-001：包完整性通过不等于 Work Item 或 Release 通过。
- INV-GATE-002：Required gate 缺证据、未运行或失败都必须阻断。
- INV-REL-001：READY 不等于 DEPLOYED，DEPLOYED 不等于 RELEASED。
- INV-SEC-001：高风险安全发现未关闭或未显式接受时不得发布。
- INV-UI-001：任何 UI 影响仍必须经过 HTML 原型、显式审批和 fidelity 双门。

## Impact Map Authority

- Impact map path: `docs/work-items/WI-004/IMPACT_MAP.md`
- Material UNKNOWN count: 0

## Scenario Matrix

- Scenario matrix path: `docs/work-items/WI-004/SCENARIO_MATRIX.md`
- Material NOT_VERIFIED count: 0

## Implementation Ready

- Status: `YES`
- Blockers: NONE

## Completion Level

`ACCEPTED`
