# Measured UI Specification — WI-007

UI ID: UI-WI-007-MOBILE-CHAT-EXPAND
Prototype: design/prototypes/WI-007/prototype.html
Approved Revision: v1.0
Target Viewport: 390x844 (Mobile) / 980x1200 (Comparison Grid)
Measurement Status: COMPLETE
Material UNKNOWN Count: 0
Reference Viewport: 390x844
Measurement Confidence: HIGH

---

# 1. Page Geometry

Viewport Width: 390px
Viewport Height: 844px
Content Max Width: 560px
Horizontal Page Padding: 10px
Top Padding: 8px
Bottom Padding: 32px

---

# 2. Header & Welcome Geometry

Header Height: 60px
Welcome Padding: 10px 4px 8px
Welcome Title Font Size: 18px (down from 30px on mobile)
Welcome Bottom Gap: 8px

---

# 3. Chat Messages Viewport

Messages Min Height: 480px
Messages Max Height: 66vh
Messages Padding: 6px 2px 14px
Messages Gap: 12px
Scroll Behavior: smooth, touch-momentum

---

# 4. Chat Bubble Geometry

Bubble Max Width: 92% (up from 86%)
Bubble Font Size: 14px
Bubble Line Height: 1.65
Bubble Padding: 12px 14px
Bubble Radius: 16px 16px 16px 4px (AI) / 16px 16px 4px 16px (User)

---

# 5. Chat Compose & Buttons

Textarea Min Height: 54px
Textarea Font Size: 14px
Send Button Size: 54px x 54px
Send Button Font Size: 22px
Quick Prompt Font Size: 11px
Quick Prompt Padding: 7px 11px

---

# 6. Color / Border / Shadow

Background: #f7f4ed
Surface: #fffdf9
Border: #e9e0d4 / #eee5da
Brand Dark: #203c32
Terracotta: #c35e35
Mint: #59a875

---

# 7. Production Token Mapping

| Prototype Constraint | Target Value | Production Token / Component | Status |
|---|---:|---|---|
| Chat Height | min-height: 480px; max-height: 66vh | `.chat-messages` | VERIFIED |
| Bubble Width | max-width: 92% | `.chat-bubble` | VERIFIED |
| Welcome Title | font-size: 18px | `.welcome-card h1` | VERIFIED |
