# UI Implementation Map — WI-006

UI ID: UI-WI-006-LIST-BEAUTIFY
Approved Prototype: design/prototypes/WI-006/prototype.html
Measured Spec: design/prototypes/WI-006/MEASURED_UI_SPEC.md
Parent Feature / Change: WI-006
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
| AI Chat Assistant Message Bubble | `app.js` / `addChatMessage` | MODIFY | PRESERVE | Wrap assistant messages with list parsing | Preserves user message and chat history |
| AI List Card Container | `styles.css` / `.ai-list-card` | ADD | PRESERVE | Background #ffffff, border #ebd9c8, radius 14px | Responsive card wrapping list items |
| AI List Item & Number Badge | `styles.css` / `.ai-list-item`, `.ai-list-num` | ADD | PRESERVE | 20px circle, font-size 10px, background #203c32 | Clean numbered identification |
| AI Dish Title, Specs & Tags | `styles.css` / `.ai-list-title`, `.ai-tag-pill` | ADD | PRESERVE | Pill badges, font-weight 700, tag colors | Distinguishes specs and dietary tags |
| AI Item Price Highlight | `styles.css` / `.ai-list-price` | ADD | PRESERVE | Terracotta accent #c35e35, font-size 13px bold | Right-aligned price visibility |
| AI Item Description | `styles.css` / `.ai-list-desc` | ADD | PRESERVE | Color #79837a, font-size 11px | Secondary details and recommendations |
| AI Category Banner | `styles.css` / `.ai-list-category` | ADD | PRESERVE | Background #fbf7f0, color #8c532b | Optional section title for grouped lists |

---

# Token Mapping

| Visual Constraint | Target | Existing Token | Action |
|---|---:|---|---|
| Card Background | `#ffffff` | `#fffdf9` | REUSE |
| Brand Dark Badge | `#203c32` | `#203c32` | REUSE |
| Ember Accent (Price) | `#c35e35` | `#c35e35` | REUSE |
| Mint Tag Background | `#e3f3e8` | `#dcebdd` | REUSE |
| Mint Tag Text | `#2e7347` | `#4d9565` | REUSE |
| Border Line | `#ebd9c8` | `#eee5da` | REUSE |

---

# Business Logic to Preserve

- 聊天框输入发送、快速选项、MCP 菜单查询、预算方案求解及状态条保持完全正常工作。
- 仅对大模型角色（`assistant`）的消息进行结构化智能检测与美化，用户气泡保持原状。
- 纯文本对话无列表内容时，保持纯文本段落展示。

---

# Legacy Visual Implementation to Remove

- 移除了大模型返回列表在聊天气泡中单一依赖 `<br>` 密集挤压展示的旧处理逻辑。

---

# High-Fidelity Constraints

- 列表项文字不能溢出气泡边界；价格右侧自适应贴边且不换行；移动端小屏（375px）下自适应折行。

---

# Responsive Mapping

| Target Width | Prototype Behavior | Production Behavior Required |
|---|---|---|
| 375px - 420px (Mobile) | Full-width card with flexible item title & price | Compact padding, 13px title, 10px badges |
| > 700px (Desktop / Tablet) | Max-width bounded card with comfortable padding | 14px title, 14px price, generous spacing |
