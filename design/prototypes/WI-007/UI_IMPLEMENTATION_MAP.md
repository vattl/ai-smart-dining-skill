# UI Implementation Map — WI-007

UI ID: UI-WI-007-MOBILE-CHAT-EXPAND
Approved Prototype: design/prototypes/WI-007/prototype.html
Measured Spec: design/prototypes/WI-007/MEASURED_UI_SPEC.md
Parent Feature / Change: WI-007
Interaction Capability Contract: `PROTOTYPE_INTERACTION_CONTRACT.md`
Backend Coordination Report: `BACKEND_COORDINATION_REPORT.md`

Mapping Status: COMPLETE
All Prototype Regions Mapped: YES
Unmapped Prototype Regions: 0
Legacy Structure Reused Without Approval: NO

---

# Prototype-to-Production Mapping

| Prototype Region | Production File / Component | Operation | Business Logic | Visual Constraints | Notes |
|---|---|---|---|---|---|
| Chat Messages Container | `styles.css` / `.chat-messages` | MODIFY | PRESERVE | min-height: 480px, max-height: 66vh, smooth scrolling | Expanded vertical conversation area |
| Welcome Card Banner | `styles.css` / `.welcome-card` | MODIFY | PRESERVE | Compact vertical margins, responsive title | Frees > 100px vertical space |
| Chat Bubbles Width | `styles.css` / `.chat-bubble` | MODIFY | PRESERVE | max-width: 92%, padding: 12px 14px | Ample space for list cards and text |
| Chat Compose Controls | `styles.css` / `.chat-compose` | MODIFY | PRESERVE | 54px send button, 14px font, comfortable touch | Mobile thumb ergonomics |
| Main Mobile Container | `styles.css` / `.mobile-main` | MODIFY | PRESERVE | padding: 8px 10px 32px on mobile screens | Maximizes horizontal screen utilization |

---

# Token Mapping

| Visual Constraint | Target | Existing Token | Action |
|---|---:|---|---|
| Chat Background | `#f7f4ed` | `#f7f4ed` | REUSE |
| Card Surface | `#fffdf9` | `#fffdf9` | REUSE |
| Brand Dark Text | `#26322d` | `#26322d` | REUSE |
| Border Line | `#e9e0d4` | `#e9e0d4` | REUSE |

---

# Business Logic to Preserve

- All message sending, real-time typing indicators, MCP menu calls, and state management in `app.js` are preserved.
- Existing history sidebar and draft/submit actions are unaffected.

---

# Legacy Visual Implementation to Remove

- Removed the cramped 320px / 55vh height restriction on mobile chat viewports.
- Removed oversized banner margins that occupied 35% of the mobile viewport.

---

# High-Fidelity Constraints

- Chat messages container must automatically scroll to bottom on new messages.
- Input box and quick prompt buttons must fit within 375px~430px viewports without horizontal screen overflow.
