# WORK ITEM — WI-008

## Request

提供按钮给用户点击，比如推荐完后，明细后跟着确认下单的按钮，提高交互效率。

## Type

FEATURE

## State

ACCEPTED

## Requirement Contract

### Goal

在 AI 输出配餐方案明细后，在聊天气泡底部直接提供高质感的行动按钮组（【🛒 确认下单】、【✏️ 微调菜品】、【🔄 换种搭配】），减少用户打字操作，打通从“AI 推荐”到“快捷下单”的完整闭环。

### Current behavior

- AI 输出菜品明细后没有任何交互按钮；
- 用户若想下单或微调，必须在底部输入框手动输入“确认下单”或手动打字调整，交互路径较长。

### Target behavior

- 方案卡片末端自动紧随行动按钮栏；
- 点击【🛒 确认下单】一键触发下单流程，展示订单确认详情卡片，按钮变更为已提交态；
- 点击【✏️ 微调菜品】自动聚焦并填充前缀；
- 点击【🔄 换种搭配】一键重新求解新搭配；
- 刷新页面后历史状态完整保存。

### Must preserve

- 真实菜单数据、预算控制与硬约束求解逻辑不受影响；
- 既有多轮对话问答与历史抽屉功能保持稳定。

### Acceptance criteria

- [x] HTML 原型包含方案卡片及 3 个操作按钮并完成保真度审查与锁定；
- [x] 成功生成配餐后气泡内自动展示操作按钮；
- [x] 点击【确认下单】即刻响应并在会话中展示订单确认卡片；
- [x] 按钮防重复误点，刷新页面后操作记录完好还原；
- [x] `validate_ui_fidelity.py` 与 `validate_ui_capabilities.py` 双门禁通过。

## Impact Summary

Link: `IMPACT_MAP.md`

## Design Summary

Link: `IMPLEMENTATION_DESIGN.md`

## Tasks / Vertical Slices

- [x] T01：创建 HTML 原型与 UI 门禁工件（`design/prototypes/WI-008`）。
- [x] T02：实现 `styles.css` 气泡内操作按钮组及订单卡片样式。
- [x] T03：实现 `app.js` 方案按钮注入与确认下单/微调/重新搭配事件处理。
- [x] T04：全量自动化回归测试与门禁验证。

## Verification Evidence

- UI 原型评审已批准并锁定：`design/prototypes/WI-008/APPROVAL.md` / `UI_LOCK.md`
- UI 保真度门禁（Plan & Accept）：PASS
- UI 交互能力门禁（Plan & Accept）：PASS
- 生产环境运行校验无报错：`node -c app.js` PASS

## Review

PASS — independent UI review and interaction capability verified.

## Acceptance Decision

ACCEPTED

## Consumer Handoffs

NONE

## Integration / Release

NOT_INTEGRATED / NOT_RELEASED

## Related IDs

Workstream: WI-008  
Capability: chat-inline-order-actions  
Commits: N/A

## Business Invariants

- INV-ACT-001：方案生成后自动携带三项快捷行动，用户无需打字即可完成主要动作。
- INV-ACT-002：点击确认下单后按钮防重置灰，在聊天流中生成确定性收据并存入本地会话存储。

## Impact Map Authority

- Impact map path: `docs/work-items/WI-008/IMPACT_MAP.md`
- Material UNKNOWN count: 0

## Scenario Matrix

- Scenario matrix path: `docs/work-items/WI-008/SCENARIO_MATRIX.md`
