# WORK ITEM — WI-007

## Request

对话聊天页面再大一点，适配手机端。

## Type

FEATURE

## State

ACCEPTED

## Requirement Contract

### Goal

显著增大 H5 聊天对话区域面积与视窗高度，优化移动端手机屏幕排版空间利用率，精简顶部标题占位，让对话与大模型推荐卡片更开阔、更舒展。

### Current behavior

- 顶部 `.welcome-card` 占位过高（30px 大字号 + 宽上下间距，占据首屏近 35% 空间）；
- 移动端 `.chat-messages` 视窗被限制在 `min-height: 320px; max-height: 55vh;`，对话内容容易截断需要频繁滚动；
- 移动端气泡最大宽度仅 86%，整体显得局促。

### Target behavior

- 聊天区域高度大幅提升至 `min-height: 480px; max-height: 66vh`，桌面端支持更高比例；
- 顶部引导标题紧凑精简，为聊天释放至少 100px 纵向首屏空间；
- 手机端气泡可用宽度扩展至 `92%`，内部大模型美化卡片展现更自然；
- 底部输入框与发送按钮优化触控比例（54px 大小），支持平滑触控滚动。

### Must preserve

- 既有对话功能、历史记录侧栏、MCP 工具调用、真实菜单展示与订单计算逻辑完全保持正常；
- 桌面端自适应良好。

### Acceptance criteria

- [x] HTML 原型对比展示改造前后效果并通过审核；
- [x] 移动端视窗高度与气泡宽度明显扩大；
- [x] 顶部导航与输入框在 375px~430px 移动屏幕无水平溢出；
- [x] `gate.py work --phase accept` 门禁通过。

## Impact Summary

Link: `IMPACT_MAP.md`

## Design Summary

Link: `IMPLEMENTATION_DESIGN.md`

## Tasks / Vertical Slices

- [x] T01：创建 HTML 原型与 UI 门禁文件（`design/prototypes/WI-007`）。
- [x] T02：调整 `styles.css` 响应式媒体查询，扩大 `.chat-messages` 视窗与气泡宽度。
- [x] T03：优化 `.welcome-card` 与移动端外边距，释放屏幕垂直高度。
- [x] T04：捕获移动端生产截图，完成视觉比对并执行回归验证。

## Verification Evidence

- Production screenshot & visual comparison: PASS (`Image Dimensions Match: YES`, `Critical Deltas: 0`).
- Delivery Gate accept phase (`gate.py work --phase accept`): PASS.
- Full regression suite (36/36 tests): PASS.

## Review

PASS — independent UI review and mobile responsiveness verified.

## Acceptance Decision

ACCEPTED

## Consumer Handoffs

NONE

## Integration / Release

NOT_INTEGRATED / NOT_RELEASED

## Related IDs

Workstream: WI-007  
Capability: h5-mobile-chat-enlarge  
Commits: N/A

## Business Invariants

- INV-UI-001：页面所有业务功能（会话历史、模型解析、真实菜单求解）在加大视图后完全正常工作。
- INV-UI-002：移动端任何横向宽度（320px~430px）下均不得产生横向滚动条或页面撕裂。

## Impact Map Authority

- Impact map path: `docs/work-items/WI-007/IMPACT_MAP.md`
- Material UNKNOWN count: 0

## Scenario Matrix

- Scenario matrix path: `docs/work-items/WI-007/SCENARIO_MATRIX.md`
- Material NOT_VERIFIED count: 0

## Implementation Ready

- Status: `YES`
- Blockers: NONE

## Completion Level

`ACCEPTED`
