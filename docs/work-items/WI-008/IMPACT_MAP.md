# Impact Map — WI-008

## Authoritative Owner

Frontend UI & Interaction Layer (`styles.css`, `app.js`)

## Layer Coverage

| Layer | Component | Status | Impact Details |
|---|---|---|---|
| Frontend UI | `index.html` | MONITORED | Chat messages viewport `#chatMessages` |
| Frontend Style | `styles.css` | MODIFIED | Add `.chat-plan-actions`, `.plan-action-btn`, `.order-confirm-card` |
| Frontend Script | `app.js` | MODIFIED | Add plan action buttons in `formatPlanChatMessage`, handle confirm/adjust/re-solve clicks, order confirmation flow |
| Backend API | `/mcp/v1/chat` | UNCHANGED | Reuses existing chat and solver routes |
| Data Model | Local Storage | MONITORED | Action state persisted in session chat history |

## Material Unknowns

Count: 0
