# Scenario Matrix — WI-008

| Scenario ID | Category | Input Context | Expected Business Outcome | Invariant | Verification Method | Status |
|---|---|---|---|---|---|---|
| SCN-001 | Plan Action Rendering | 服务端求解配餐方案成功 | 菜品卡片末尾自动渲染【确认下单】、【微调菜品】、【换种搭配】三个按钮 | INV-ACT-001 | Unit Test & Visual Inspection | VERIFIED |
| SCN-002 | Confirm Order Flow | 点击【🛒 确认下单】 | 原按钮切换为已提交禁用态，聊天流输出订单确认卡片（桌号、金额、菜品明细） | INV-ACT-002 | Interaction E2E Test | VERIFIED |
| SCN-003 | Adjust Dishes Trigger | 点击【✏️ 微调菜品】 | 输入框聚焦并预填“我想调整当前方案：不要”，唤起键盘 | INV-ACT-001 | Interaction Test | VERIFIED |
| SCN-004 | Re-solve Trigger | 点击【🔄 换种搭配】 | 自动发送重新搭配需求并驱动服务端重新计算方案 | INV-ACT-001 | Multi-turn Solver Test | VERIFIED |
| SCN-005 | Persistence & Refresh | 下单或调整后刷新页面 | 方案按钮状态及已确认订单卡片 100% 恢复回显 | INV-ACT-002 | Reload Recovery Test | VERIFIED |
