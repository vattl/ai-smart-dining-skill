# Impact Map — WI-006

## Authoritative Owner

Frontend UI Layer (`app.js`, `styles.css`)

## Layer Coverage

| Layer | Component | Status | Impact Details |
|---|---|---|---|
| Frontend UI | `index.html` | MONITORED | Chat messages container `#chatMessages` and `#prompt` |
| Frontend Script | `app.js` | MODIFIED | Add `formatAssistantReply` list parser, update `addChatMessage` |
| Frontend Style | `styles.css` | MODIFIED | Add `.ai-list-card`, `.ai-list-item`, `.ai-tag-pill`, `.ai-list-price` |
| Backend API | `/mcp/v1/chat` | UNCHANGED | Chat API contract unchanged, receives real LLM responses |
| Data Model | Menu / Plan | UNCHANGED | Shop menu and deterministic solver data flow preserved |

## Material Unknowns

Count: 0
