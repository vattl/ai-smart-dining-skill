# WORK ITEM — WI-001

## Request

完善 AI Development OS v4.3 工作流。

## Type

MAINTENANCE

## State

ACCEPTED

## Requirement Contract

### Goal

让 v4.3 工作流的入口文档、生命周期表述和机器校验相互一致，并让校验器能够发现版本、核心规则和包清单漂移。

### Current behavior

- 权威生命周期已升级到 v4.2/v4.3 语义，但 `.ai/scripts/validate.py` 仍标识为 v3.2，且只验证少量旧约束。
- `validate_v43_package.py` 只检查关键文件是否存在和 `VERSION.md` 是否含有 `v4.3`，无法发现关键内容退化或 `MANIFEST.json` 漂移。
- `AGENTS.md`、`.ai/SKILL.md`、`USAGE.md` 和 `README.md` 的入口版本/主生命周期表述不完全一致。

### Target behavior

- 主校验器明确为 v4.3，并组合执行可机器验证的核心工作流、包结构、清单完整性和现有治理检查。
- v4.3 包校验验证关键语义，不仅验证文件存在。
- 入口文档以 v4.3 为当前版本，并指向同一条权威生命周期。
- 校验失败输出能够明确指出修复位置；正常包在普通与 release 模式均通过（非 Git 分发目录仅保留明确警告）。

### Must preserve

- `/work` 是统一入口。
- `IMPLEMENTATION_READY = YES` 前禁止生产编辑。
- STRUCTURAL UI / REFACTOR / REDESIGN 的真实原型门槛。
- Impact Map、Business Invariants、Scenario Matrix 和 ACCEPTED/INTEGRATED/RELEASED 分离。
- 无第三方依赖的 Python 校验方式。

### Acceptance criteria

- [x] `python .ai/scripts/validate.py` 通过并显示 v4.3。
- [x] `python .ai/scripts/validate.py --release` 通过（允许非 Git 警告）。
- [x] `python .ai/scripts/validate_v43_package.py .` 通过并验证语义与清单。
- [x] 人为破坏的隔离副本会被清单/语义校验拒绝。
- [x] 入口文档不再把 v4.1 或旧 PRE-EDIT GUARD 生命周期作为当前入口。
- [x] `MANIFEST.json` 与最终文件集合、大小和 SHA-256 一致。

### Open product questions

无。按“提升现有 v4.3 的可执行性和自证能力、不引入新生命周期”的最小范围执行。

## Impact Summary

Link: `IMPACT_MAP.md`

## Design Summary

Link: `IMPLEMENTATION_DESIGN.md`

## Tasks / Vertical Slices

- [x] T01：升级校验器并增加语义/清单校验。
- [x] T02：统一入口版本和权威生命周期表述。
- [x] T03：正向、release 和负向验证；刷新清单。

## Verification Evidence

- `python -m unittest discover -s .ai/scripts/tests -v`：5/5 PASS；覆盖 v4.3 标识、语义漂移、哈希漂移、未列文件，以及运行态漂移仅阻塞 release 的边界。
- `python -m py_compile .ai/scripts/validate.py .ai/scripts/validate_v43_package.py .ai/scripts/tests/test_workflow_validation.py`：PASS。
- `python .ai/scripts/validate.py`：0 errors；仅报告当前目录非 Git 的预期警告。
- `python .ai/scripts/validate.py --release`：0 errors；仅报告当前目录非 Git 的预期警告。
- `python .ai/scripts/validate_v42_package.py`：PASS，确认 v4.2 核心结构仍在。
- `python .ai/scripts/validate_v43_package.py .`：PASS，确认结构、语义和最终清单一致。

## Review

五轴复核结论：APPROVE。

- Correctness：日常检查与分发完整性检查边界明确；错误路径有负向测试。
- Readability：校验职责拆分为 required files、semantics、manifest 三个部分。
- Architecture：沿用 `/policy-check` → `validate.py` 的既有入口，无新并行生命周期。
- Security：清单路径拒绝绝对路径、`..` 和反斜杠非规范路径；无外部依赖或网络输入。
- Performance：一次有界文件遍历与流式 SHA-256；普通检查不做哈希扫描。

## Acceptance Decision

ACCEPTED — 原始请求已在本 Work Item 的收敛范围内由场景测试、策略校验和清单校验证明。

## Consumer Handoffs

NONE

## Integration / Release

本目录不是 Git 仓库；状态为 ACCEPTED / NOT_INTEGRATED / NOT_RELEASED。

## Related IDs

Workstream: WI-001（共享目录，无 Git worktree）  
UI: N/A  
Capability: workflow-policy-validation  
Commits: N/A（非 Git 目录）

## Business Invariants

- INV-001：生产编辑必须由 `IMPLEMENTATION_READY = YES` 放行。
- INV-002：结构性 UI 原型要求与原型模式分离。
- INV-003：`ACCEPTED`、`INTEGRATED`、`RELEASED` 不得合并为模糊 DONE。
- INV-004：分发清单必须精确描述除自身外的包文件。

## Impact Map Authority

- Impact map path: `docs/work-items/WI-001/IMPACT_MAP.md`
- Material UNKNOWN count: 0

## Scenario Matrix

- Scenario matrix path: `docs/work-items/WI-001/SCENARIO_MATRIX.md`
- Material NOT_VERIFIED count: 0

## Implementation Ready

- Status: `YES`
- Blockers: NONE

## Completion Level

`ACCEPTED`

