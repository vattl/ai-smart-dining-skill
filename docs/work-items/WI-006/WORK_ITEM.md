# WORK ITEM — WI-006

## Request

H5增加识别大模型返回的列表，自动美化展示给消费者。

## Type

FEATURE

## State

ACCEPTED

## Requirement Contract

### Goal

在消费者端 H5 聊天中自动识别大模型返回的各类列表内容（有序编号、无序列表、菜品价格规格标签属性及分类推荐），自动美化展示为高品质的消费端卡片，提升扫读效率与视觉体验。

### Current behavior

- 大模型返回的文本通过 `escapeHtml(text).replace(/\n/g, '<br>')` 直接输出在聊天气泡中。
- 菜品编号、价格、规格、忌口/招牌标签与介绍文本混杂堆叠，缺乏清晰层次。
- 视觉风格单一，移动端阅读疲劳。

### Target behavior

- 纯前端实时解析大模型回复中的列表块，保留前后自然语言段落；
- 列表区块渲染为精致的 `.ai-list-card`，包含序列号圆形徽章、无序项目符号、分类小标题、标签徽章（如 `[免辣]` 绿标、`[招牌]` 橙标）、规格分量、高亮价格与次级风味描述；
- 列表项支持移动端轻触交互反馈；
- XSS 字符严格转义，杜绝安全漏洞；
- 移动端 375px/390px/420px 视口下良好排版自适应。

### Must preserve

- 既有对话流程、快速提问按钮、MCP 菜单读取及智能配餐流程不受影响；
- 纯文本回复（无列表的常规对话）保持原有对话气泡展示；
- 生产环境严禁假数据或前端 mock。

### Acceptance criteria

- [x] HTML 原型包含改造前后对比并通过保真度审查与批准；
- [x] 大模型返回编号列表（如 `1.`、`1、`、`(1)`）自动转换为美化卡片；
- [x] 大模型返回无序列表（如 `- `、`* `、`• `）自动转换为美化要点卡片；
- [x] 菜品价格（如 `¥35`、`20元`）、规格分量（如 `10串`、`1份`）、标签（如 `[招牌]`、`[免辣]`）精准识别抽取与徽章化；
- [x] 普通问答与错误提示不受影响，XSS 注入测试通过；
- [x] `validate_ui_fidelity.py` 与 `validate_ui_capabilities.py` 双门禁通过。

## Impact Summary

Link: `IMPACT_MAP.md`

## Design Summary

Link: `IMPLEMENTATION_DESIGN.md`

## Tasks / Vertical Slices

- [x] T01：创建 HTML 原型与 UI 门禁文件（`design/prototypes/WI-006`）。
- [x] T02：实现 `app.js` 文本分析器与列表识别格式化函数 `formatAssistantReply`。
- [x] T03：实现 `styles.css` 美化卡片、微标签、序号徽章与价格排版样式。
- [x] T04：端到端与全量场景回归验证，捕获生产截图并执行视觉差异比对。

## Verification Evidence

- Automated unit & regression tests (`test_h5_list_beautify.py`): 3/3 PASS.
- Edge headless screenshot capture & visual diff: PASS (`Image Dimensions Match: YES`, `Critical Deltas: 0`).
- Delivery Gate accept phase (`gate.py work --phase accept`): PASS.
- Security Audit & SAST checks: PASS.

## Review

PASS — independent UI review and visual regression completed.

## Acceptance Decision

ACCEPTED

## Consumer Handoffs

NONE

## Integration / Release

NOT_INTEGRATED / NOT_RELEASED

## Related IDs

Workstream: WI-006  
Capability: h5-llm-list-beautification  
Commits: N/A

## Business Invariants

- INV-LLM-001：解析过程必须完全幂等，不修改大模型真实返回的核心语义。
- INV-LLM-002：所有提取字段（菜品名、价格、标签）必须全部来源于大模型原文，严禁前端脑补或伪造价格。
- INV-LLM-003：非列表的普通问答对话必须 100% 保持原有展示形式。
- INV-LLM-004：所有输出内容必须经过安全转义，防止恶意内容 XSS 注入。

## Impact Map Authority

- Impact map path: `docs/work-items/WI-006/IMPACT_MAP.md`
- Material UNKNOWN count: 0

## Scenario Matrix

- Scenario matrix path: `docs/work-items/WI-006/SCENARIO_MATRIX.md`
- Material NOT_VERIFIED count: 0

## Implementation Ready

- Status: `YES`
- Blockers: NONE

## Completion Level

`ACCEPTED`
