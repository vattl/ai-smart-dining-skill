# Measured UI Spec — WI-008

UI ID: UI-WI-008-PLAN-ACTIONS
Measurement Status: COMPLETE
Material UNKNOWN Count: 0
Reference Viewport: 390x844 (Mobile) / 980x1100 (Prototype Board)

## Design Tokens & Spatial Specs

| Element | CSS Selector / Token | Computed Value / Value | Purpose |
|---|---|---|---|
| Action Bar Container | `.chat-plan-actions` | margin-top: 10px, padding-top: 10px, border-t: 1px dashed #ebd9c8, display: flex, gap: 8px | Container housing inline action buttons |
| Primary Action Button | `.plan-action-btn.primary` | height: 36px, px: 14px, radius: 10px, bg: #203c32, color: #fff, font: 12px/800, flex: 1.2 | High-contrast "Confirm Order" primary action |
| Secondary Action Button | `.plan-action-btn.secondary` | height: 36px, px: 10px, radius: 10px, bg: #fff, border: 1px solid #ebd9c8, color: #203c32, font: 11px/700, flex: 1 | Adjust dishes or re-solve secondary actions |
| Confirmed State Button | `.plan-action-btn.is-confirmed` | bg: #e3f3e8, color: #2e7347, border: 1px solid #badcc2, cursor: default | Non-clickable indicator after successful submission |
| Order Confirmation Card | `.order-confirm-card` | border-radius: 14px, bg: #fcfbf7, border: 1.5px solid #203c32, padding: 12px 14px, margin-top: 8px | Order summary receipt card in chat flow |
