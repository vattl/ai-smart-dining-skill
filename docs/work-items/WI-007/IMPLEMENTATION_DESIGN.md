# Implementation Design — WI-007

## Root Fix / Owner

Owner: Frontend UI Styling Layer (`styles.css`)

### Technical Rationale

1. **移动端纵向空间释放**：
   - 现有的 `.welcome-card` 标题为 30px，外加上下大 padding，手机打开后占据了约 1/3 的纵向屏幕；
   - 将其重构为轻量级紧凑标语（移动端 `h1` 字号 18px，padding 8px），为聊天区域释放 > 100px 纵向高度。
2. **沉浸式对话区域扩展**：
   - 提升 `.chat-messages` 在移动端（<= 600px）的高度：`min-height: 480px; max-height: 66vh;`；
   - 扩大 `.chat-bubble` 最大宽度至 `92%`（旧为 86%），让大模型返回的菜品列表、规格与标签拥有更充裕的单行阅读空间。
3. **移动端触控人体工学适配**：
   - 输入框与发送按钮优化为 54px 大小，便于大拇指单手快速点按；
   - 顶部导航在小屏（375px）下自适应缩进，确保历史记录、新对话按钮与状态圆点并排优雅展示。

## Verification Strategy

1. **响应式几何测量**：
   - 在 375px、390px、430px 及桌面端测量聊天容器与气泡尺寸；
2. **UI 门禁验证**：
   - `validate_ui_fidelity.py` (plan & accept)
   - `validate_ui_capabilities.py` (plan & accept)
3. **自动化回归套件**：
   - 运行全部自动化测试套件确保已有功能不受任何影响。
