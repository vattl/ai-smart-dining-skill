# Prototype Interaction Capability Contract — WI-007

UI ID: UI-WI-007-MOBILE-CHAT-EXPAND
Approved Prototype: design/prototypes/WI-007/prototype.html
Parent Work Item: WI-007

Capability Mapping Status: COMPLETE
All Prototype Interactions Mapped: YES
Unmapped Prototype Interactions: 0
Production Fake/Mock/Placeholder Interactions: 0
Unresolved Required Backend Capabilities: 0

## Interaction-to-Capability Matrix

| Interaction ID | Prototype Interaction | Classification | Production Integration | Contract / Capability Evidence | Capability Request | E2E Evidence | Status |
|---|---|---|---|---|---|---|---|
| INT-001 | 移动端大视窗聊天消息列表展示与平滑触控滚动 | DERIVABLE | styles.css | ../../../styles.css | N/A | E2E_EVIDENCE.md | VERIFIED |
| INT-002 | 移动端贴合输入框内容输入与一键发送触控交互 | DERIVABLE | app.js | ../../../app.js | N/A | E2E_EVIDENCE.md | VERIFIED |

## Classification Rules

- AVAILABLE: an existing verified backend/interface directly supports the interaction.
- DERIVABLE: production code can safely derive it from existing verified data without inventing business truth.
- API_EXTENSION: an existing contract must be extended.
- NEW_API: a new backend/interface capability is required.
- NOT_SUPPORTED: implementation is blocked; revise and re-approve the prototype or authorize backend capability work.
