# Implementation Design — WI-008

## Root Fix / Owner

Owner: Frontend Application UI Layer (`app.js`, `styles.css`)

### Technical Rationale

1. **会话流内操作直达（In-Bubble Actions）**：
   - 将原先脱离聊天视口的底部按钮下沉至 AI 菜品方案卡片末端，实现“看完方案 -> 一键下单/调整”的零距离直达操作；
   - 按钮采用语义化 `data-action` 属性标识：`confirm-order`（确认下单）、`adjust-dishes`（微调菜品）、`re-solve`（换种搭配）。
2. **确认下单交互闭环**：
   - 点击【🛒 确认下单】后，前端直接在消息流中模拟真实顾客操作：
     - 用户侧输出消息：“确认下单”；
     - AI 侧即刻返回【订单已确认】结构化卡片（展示桌号、用餐人数、核验总额、5项在售菜品清单与预测试免扣款说明）；
     - 当前方案卡片上的【确认下单】按钮更新为已提交禁用态 `✓ 已提交下单`，杜绝重复触发。
3. **微调与重新搭配**：
   - 点击【✏️ 微调菜品】：自动聚焦输入框并预填文字，降低用户手机打字成本；
   - 点击【🔄 换种搭配】：自动向大模型发送重新搭配指令，实现连续多轮无缝求解。

## Verification Strategy

1. **测试用例**：
   - TC-01：AI 生成方案后，菜品卡片尾部准确呈现 3 个操作按钮；
   - TC-02：点击【确认下单】，按钮切换为已提交态，并输出订单确认卡片；
   - TC-03：点击【微调菜品】，输入框获得焦点并填入引导前缀；
   - TC-04：点击【换种搭配】，自动发起新搭配求解并更新会话；
   - TC-05：刷新页面后，历史会话中方案卡片及按钮状态 100% 正常回显。
2. **UI 保真度双门禁**：
   - `validate_ui_fidelity.py` (plan & accept)
   - `validate_ui_capabilities.py` (plan & accept)
