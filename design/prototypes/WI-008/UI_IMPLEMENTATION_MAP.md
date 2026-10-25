# UI Implementation Map — WI-008

UI ID: UI-WI-008-PLAN-ACTIONS
Mapping Status: COMPLETE
All Prototype Regions Mapped: YES
Unmapped Prototype Regions: 0
Legacy Structure Reused Without Approval: NO

## Component Mapping Matrix

| Prototype Region | Prototype Selector / Component | Production Target File | Production Target Selector | Status | Rationale |
|---|---|---|---|---|---|
| Action Buttons Container | `.chat-plan-actions` | `styles.css`, `app.js` | `.chat-plan-actions` | MAPPED | Integrated directly into plan message bubbles |
| Confirm Order Button | `.plan-action-btn[data-action="confirm"]` | `styles.css`, `app.js` | `.plan-action-btn.primary` | MAPPED | Triggers order confirmation receipt in chat |
| Adjust Dishes Button | `.plan-action-btn[data-action="adjust"]` | `styles.css`, `app.js` | `.plan-action-btn.secondary` | MAPPED | Pre-fills input prompt and focuses textarea |
| Re-solve Button | `.plan-action-btn[data-action="resolve"]` | `styles.css`, `app.js` | `.plan-action-btn.secondary` | MAPPED | Re-triggers solver with variety preference |
| Order Receipt Card | `.order-confirm-card` | `styles.css`, `app.js` | `.order-confirm-card` | MAPPED | Structured message bubble confirming draft order |
