# Measured UI Specification — WI-006

UI ID: UI-WI-006-LIST-BEAUTIFY
Prototype: design/prototypes/WI-006/prototype.html
Approved Revision: v1.0
Target Viewport: 390x844 (Mobile) / 980x1100 (Prototype Grid)
Measurement Status: COMPLETE
Material UNKNOWN Count: 0
Reference Viewport: 390x844
Measurement Confidence: HIGH

---

# 1. Page Geometry

Viewport Width: 390px
Viewport Height: 844px
Content Max Width: 560px
Horizontal Page Padding: 16px
Top Padding: 18px
Bottom Padding: 40px
Primary Section Gap: 12px

---

# 2. Header

Header Height / Natural Height: 62px
Title Font Size: 14px
Title Weight: 700
Subtitle Font Size: 9px
Title-to-Subtitle Gap: 2px
Header Bottom Gap: 12px

---

# 3. Chat Card Geometry

Chat Card Padding: 15px
Chat Card Radius: 22px
Chat Messages Gap: 10px
Bubble Padding: 13px 15px
Bubble Radius: 16px 16px 16px 4px

---

# 4. AI List Card Geometry

Card Margin: 8px 0 4px
Card Background: #ffffff
Card Border: 1px solid #ebd9c8
Card Radius: 14px
Card Shadow: 0 4px 14px rgba(60, 40, 20, 0.04)

---

# 5. List Items & Metrics

Item Padding: 10px 12px
Item Gap: 10px
Item Border Bottom: 1px solid #f7efe6
Number Badge Size: 20px x 20px
Number Badge Font: 10px / weight 800
Number Badge Color: #ffffff on #203c32
Bullet Badge Size: 7px x 7px
Title Font Size: 13px / weight 700
Tag Font Size: 10px / weight 600
Tag Padding: 1px 6px
Price Font Size: 13px / weight 800
Price Color: #c35e35
Description Font Size: 11px / color #79837a / line-height 1.5

---

# 6. Typography Hierarchy

Page Title: 30px
Card Title: 19px
Chat Text: 13px
List Item Title: 13px
List Item Price: 13px
List Item Desc: 11px
Badge Text: 10px

---

# 7. Color / Border / Shadow

Background: #f7f4ed
Surface: #fffdf9
Card Surface: #ffffff
Border: #ebd9c8 / #eee5da
Primary Dark: #203c32
Accent Terracotta: #c35e35
Accent Mint: #59a875 / #2e7347
Shadow Policy: subtle warm elevation

---

# 8. Production Token Mapping

| Prototype Constraint | Target Value | Production Token / Component | Status |
|---|---:|---|---|
| Card Background | #ffffff | `--card-bg: #ffffff` | VERIFIED |
| Border Color | #ebd9c8 | `--list-border: #ebd9c8` | VERIFIED |
| Primary Text | #26322d | `--brand-dark: #26322d` | VERIFIED |
| Price Color | #c35e35 | `--accent-ember: #c35e35` | VERIFIED |
| Mint Tag | #e3f3e8 / #2e7347 | `--tag-mint-bg / --tag-mint-fg` | VERIFIED |
| Orange Tag | #feede3 / #b55627 | `--tag-orange-bg / --tag-orange-fg` | VERIFIED |

---

# 9. Measurement Notes

All dimensions extracted directly from prototype.html and verified against production styles.css tokens.
