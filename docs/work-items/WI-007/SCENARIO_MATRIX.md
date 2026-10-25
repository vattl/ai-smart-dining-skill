# Scenario Matrix — WI-007

| Scenario ID | Category | Input Context | Expected Business Outcome | Invariant | Verification Method | Status |
|---|---|---|---|---|---|---|
| SCN-001 | Mobile 390px Viewport | 标准 iPhone 390x844 视口 | 聊天窗口高大（>480px），气泡宽度达到 92%，文字与列表卡片舒展 | INV-UI-001, INV-UI-002 | Headless Screenshot & Visual Verification | VERIFIED |
| SCN-002 | Compact 375px Viewport | 紧凑型手机 375x667 视口 | 顶部导航无水平溢出，输入框与快速按钮无换行撕裂 | INV-UI-002 | Headless Screenshot & Visual Verification | VERIFIED |
| SCN-003 | Desktop / Tablet Fallback | 宽度 > 700px 桌面视口 | 自动居中限制 max-width 560px，保持优雅比例 | INV-UI-001 | Visual Inspection & Regression Test | VERIFIED |
