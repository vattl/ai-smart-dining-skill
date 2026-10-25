# Structural Diff — WI-007

Diff ID: DIFF-WI-007
Parent Work: WI-007
Title: Enlarged H5 Chat Viewport and Mobile Adaptation
Status: APPROVED
Plan Status: APPROVED
Unclassified Legacy Regions: 0

## 1. Change Intent

Significantly enlarge the chat viewport height and bubble width on mobile devices, streamline the oversized welcome card, and optimize touch targets for mobile consumer ergonomics.

## 2. Current State

### Structure

- `.welcome-card` has large font-size (30px) and padding (22px 4px 18px), consuming ~35% of the mobile screen.
- `.chat-messages` has a narrow height limit (`min-height: 320px; max-height: 55vh;`).
- `.chat-bubble` has restricted width (`max-width: 86%`).

## 3. Target State

### Structure

- `.welcome-card` is compact and streamlined on mobile (`font-size: 18px; padding: 10px 4px 8px;`).
- `.chat-messages` is expanded to `min-height: 480px; max-height: 66vh;`.
- `.chat-bubble` expands to `max-width: 92%` on mobile screens.
- Touch-friendly compose bar (54px buttons, 14px font, smooth momentum scrolling).

## 4. Structural Diff

| ID | Element | Current | Target | Operation | Risk |
|---|---|---|---|---|---|
| D1 | Chat Viewport Height | min-height: 320px; max-height: 55vh | min-height: 480px; max-height: 66vh | MODIFY | LOW |
| D2 | Welcome Card Space | Large padding & 30px title | Compact 10px padding & 18px title on mobile | MODIFY | LOW |
| D3 | Chat Bubble Max Width | 86% max width on mobile | 92% max width on mobile | MODIFY | LOW |
| D4 | Compose Bar & Send Button | 60px/64px desktop size | 54px compact mobile touch target | MODIFY | LOW |
| D5 | Mobile Main Padding | 16px lateral padding | 8px-10px lateral padding on mobile | MODIFY | LOW |

## 16. Verification

| Diff ID | Status | Evidence |
|---|---|---|
| D1 | VERIFIED | `design/prototypes/WI-007/prototype.html` |
| D2 | VERIFIED | `design/prototypes/WI-007/prototype.html` |
| D3 | VERIFIED | `design/prototypes/WI-007/prototype.html` |
| D4 | VERIFIED | `design/prototypes/WI-007/prototype.html` |
| D5 | VERIFIED | `design/prototypes/WI-007/prototype.html` |

## 18. Final State Verification

Target State Match: YES
Legacy Remaining: NO
Unexpected Active Behavior: NO

## 19. Final Status

Final Status: VERIFIED
