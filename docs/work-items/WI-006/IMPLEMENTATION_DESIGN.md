# Implementation Design — WI-006

## Root Fix / Owner

Owner: Frontend Application UI Layer (`app.js`, `styles.css`)

### Technical Rationale

1. **为什么在前端解析而非修改后端 Prompt**：
   - 后端大模型由不同 LLM 驱动，返回格式可能包含 Markdown、纯文本、缩进等多种变体；
   - 在前端展示层做自适应语法解析和美化渲染，解耦了后端大模型生成逻辑，具有最高的鲁棒性和即时渲染效率，零网络往返延迟。
2. **列表识别引擎架构**：
   - **Line Tokenizer**：逐行扫描大模型文本，区分【普通段落】、【分类标题 (如 `### 荤菜` / `**素菜类**`)】、【有序列表项 (`1.` / `1、` / `(1)` / `[1]`)】、【无序列表项 (`- ` / `* ` / `• `)】；
   - **Entity Extractor**：对列表项内容提取【名称】、【价格 (正则匹配 `¥\d+(\.\d+)?` 或 `\d+元`)】、【规格 (正则匹配 `\d+(串|份|只|条|扎|瓶|碗|个|把|斤)`)】、【标签 (提取 `\[([^\]]+)\]`、`【([^】]+)】`、`\((不辣|免辣|招牌|微辣|推荐)[^)]*\)`)】与【次级风味说明】；
   - **Card Builder**：将连续列表项聚合输出为 `.ai-list-card`，并自动注入结构化 HTML 与转义保护；
   - **Fallback & Graceful Degradation**：若不含列表，优雅回退至普通段落；若解析某行出现非预期格式，安全降级为普通条目，绝不抛出异常导致页面白屏。

## Verification Strategy

1. **语法测试用例**：
   - TC-01：标准编号菜品推荐（含价格、标签、规格、风味说明）；
   - TC-02：无序项目符号（饮食建议、就餐注意事项）；
   - TC-03：分类多列表（荤菜类、素菜类、饮品主食类）；
   - TC-04：混合问答文本（前导自然语言问候 + 菜品清单 + 尾部温馨提示）；
   - TC-05：无列表纯问答文本（验证无回归破坏）；
   - TC-06：特殊字符与恶意 XSS 字符测试（`<script>`, `onerror=`, `&`, `"`）。
2. **UI 保真度双门禁**：
   - `validate_ui_fidelity.py` (plan & accept)
   - `validate_ui_capabilities.py` (plan & accept)
