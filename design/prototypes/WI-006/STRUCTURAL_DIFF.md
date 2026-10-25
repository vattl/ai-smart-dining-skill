# Structural Diff — WI-006

Diff ID: DIFF-WI-006
Parent Work: WI-006
Title: LLM List Output Beautification in H5 Chat
Status: APPROVED
Plan Status: APPROVED
Unclassified Legacy Regions: 0

## 1. Change Intent

Replace raw unstyled `<br>` text list output in chat bubbles with intelligently parsed, visually structured and mobile-friendly AI list cards.

## 2. Current State

### Structure

```text
div.chat-bubble
  text + <br> + text + <br> ...
```

### Behavior

Pure text replacement with `<br>`, no entity recognition, no tags, no structured prices.

## 3. Target State

### Structure

```text
div.chat-bubble
  div.ai-msg-intro (optional)
  div.ai-list-card
    div.ai-list-category (optional)
    div.ai-list-items
      div.ai-list-item
        span.ai-list-num (or span.ai-list-bullet)
        div.ai-list-content
          div.ai-list-title-row
            span.ai-list-title
              [Dish Name]
              span.ai-tag-pill.tag-spec [Spec]
              span.ai-tag-pill.tag-mint [Diet Tag]
            span.ai-list-price [¥Price]
          div.ai-list-desc [Description]
    div.ai-list-action-hint
  div.ai-msg-outro (optional)
```

## 4. Structural Diff

| ID | Element | Current | Target | Operation | Risk |
|---|---|---|---|---|---|
| D1 | Assistant Chat Bubble Formatter | `escapeHtml(text).replace(/\n/g, '<br>')` | `formatAssistantReply(text)` with list tokenization | REPLACE | LOW |
| D2 | List Container | None (plain text in bubble) | `div.ai-list-card` | ADD | LOW |
| D3 | List Items & Badges | Unformatted line text | `div.ai-list-item`, `span.ai-list-num`, `span.ai-tag-pill` | ADD | LOW |
| D4 | Price & Specification Extractor | Text string | Structured span with brand terracotta color | ADD | LOW |
| D5 | Conversational Prose | Plain text | Maintained as natural opening/closing narrative paragraphs | PRESERVE | LOW |

## 5. Negative Acceptance Criteria

- [ ] Old implementation (`escapeHtml(text).replace(/\n/g, '<br>')` for assistant list outputs) is replaced where structured lists are returned.
- [ ] Non-list conversational chat messages do NOT show broken or empty cards.

## 16. Verification

| Diff ID | Status | Evidence |
|---|---|---|
| D1 | VERIFIED | `app.js` unit test & E2E verification |
| D2 | VERIFIED | `design/prototypes/WI-006/prototype.html` |
| D3 | VERIFIED | `design/prototypes/WI-006/prototype.html` |
| D4 | VERIFIED | `design/prototypes/WI-006/prototype.html` |
| D5 | VERIFIED | `design/prototypes/WI-006/prototype.html` |

## 18. Final State Verification

Target State Match: YES
Legacy Remaining: NO
Unexpected Active Behavior: NO

## 19. Final Status

Final Status: VERIFIED
