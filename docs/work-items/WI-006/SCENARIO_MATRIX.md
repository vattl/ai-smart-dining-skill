# Scenario Matrix — WI-006

| Scenario ID | Category | Input Context | Expected Business Outcome | Invariant | Verification Method | Status |
|---|---|---|---|---|---|---|
| SCN-001 | Ordered Dish List | 带有序号 `1.`、价格 `¥35`、规格 `10串`、标签 `[招牌]` 的大模型菜品推荐 | 渲染为结构化 `.ai-list-card`，徽章、价格右对齐、说明文字分层 | INV-LLM-001, INV-LLM-002 | Automated Unit Test & Visual Screenshot | VERIFIED |
| SCN-002 | Unordered Advice List | 带有项目符号 `- ` 或 `• ` 的用餐建议列表 | 渲染为项目卡片，显示圆润品牌强调项目符号 | INV-LLM-001 | Automated Unit Test & Visual Screenshot | VERIFIED |
| SCN-003 | Mixed Narrative & Lists | 前导开场白 + 2个分类列表 + 结尾注意事项 | 前后保持自然气泡段落，中间精确渲染为独立列表卡片 | INV-LLM-001, INV-LLM-003 | Automated Unit Test | VERIFIED |
| SCN-004 | Plain Text Dialogue | 纯文本闲聊或普通错误信息（无任何列表标记） | 100% 保持原有对话气泡展示，无任何多余卡片包裹 | INV-LLM-003 | Automated Unit Test | VERIFIED |
| SCN-005 | Security / XSS Prevention | 列表中包含 `<script>alert(1)</script>` 或 `onerror=` 属性 | 所有字符完整安全转义，无脚本执行漏洞 | INV-LLM-004 | Security Injection Test | VERIFIED |
