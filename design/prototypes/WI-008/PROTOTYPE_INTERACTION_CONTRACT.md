# Prototype Interaction Capability Contract — WI-008

UI ID: UI-WI-008-PLAN-ACTIONS
Approved Prototype: design/prototypes/WI-008/prototype.html
Parent Work Item: WI-008

Capability Mapping Status: COMPLETE
All Prototype Interactions Mapped: YES
Unmapped Prototype Interactions: 0
Production Fake/Mock/Placeholder Interactions: 0
Unresolved Required Backend Capabilities: 0

## Interaction-to-Capability Matrix

| Interaction ID | Prototype Interaction | Classification | Production Integration | Contract / Capability Evidence | Capability Request | E2E Evidence | Status |
|---|---|---|---|---|---|---|---|
| INT-001 | 求解方案后气泡尾部自动渲染 3 个行动按钮 | DERIVABLE | app.js | ../../../app.js | N/A | E2E_EVIDENCE.md | VERIFIED |
| INT-002 | 点击【🛒 确认下单】生成订单确认卡片并锁定按钮 | DERIVABLE | app.js | ../../../app.js | N/A | E2E_EVIDENCE.md | VERIFIED |
| INT-003 | 点击【✏️ 微调菜品】预填输入框并聚焦唤起键盘 | DERIVABLE | app.js | ../../../app.js | N/A | E2E_EVIDENCE.md | VERIFIED |
| INT-004 | 点击【🔄 换种搭配】驱动大模型与求解器重新计算 | DERIVABLE | app.js | ../../../app.js | N/A | E2E_EVIDENCE.md | VERIFIED |
| INT-005 | 页面刷新后方案卡片与按钮状态保持 100% 恢复 | DERIVABLE | app.js | ../../../app.js | N/A | E2E_EVIDENCE.md | VERIFIED |

## Classification Rules

- AVAILABLE: an existing verified backend/interface directly supports the interaction.
- DERIVABLE: production code can safely derive it from existing verified data without inventing business truth.
- API_EXTENSION: an existing contract must be extended.
- NEW_API: a new backend/interface capability is required.
- NOT_SUPPORTED: implementation is blocked; revise and re-approve the prototype or authorize backend capability work.
