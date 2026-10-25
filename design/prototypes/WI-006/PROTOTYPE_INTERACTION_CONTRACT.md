# Prototype Interaction Capability Contract — WI-006

UI ID: UI-WI-006-LIST-BEAUTIFY
Approved Prototype: design/prototypes/WI-006/prototype.html
Parent Work Item: WI-006

Capability Mapping Status: COMPLETE
All Prototype Interactions Mapped: YES
Unmapped Prototype Interactions: 0
Production Fake/Mock/Placeholder Interactions: 0
Unresolved Required Backend Capabilities: 0

## Interaction-to-Capability Matrix

| Interaction ID | Prototype Interaction | Classification | Production Integration | Contract / Capability Evidence | Capability Request | E2E Evidence | Status |
|---|---|---|---|---|---|---|---|
| INT-001 | 自动解析大模型返回文本中的列表并渲染为卡片 | DERIVABLE | app.js | ../../../app.js | N/A | E2E_EVIDENCE.md | VERIFIED |
| INT-002 | 点击美化列表项快速将菜品填入沟通输入框 | DERIVABLE | app.js | ../../../index.html | N/A | E2E_EVIDENCE.md | VERIFIED |

## Classification Rules

- AVAILABLE: an existing verified backend/interface directly supports the interaction.
- DERIVABLE: production code can safely derive it from existing verified data without inventing business truth.
- API_EXTENSION: an existing contract must be extended.
- NEW_API: a new backend/interface capability is required.
- NOT_SUPPORTED: implementation is blocked; revise and re-approve the prototype or authorize backend capability work.
