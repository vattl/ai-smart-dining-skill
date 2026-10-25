# WorkBuddy 开发对话记录

## 项目概览

- 项目：深圳烧烤店 AI 智能配餐与点餐系统
- 前端：手机端 H5，目录 `G:\Mini Program\diancanSkills`
- 后端项目：`G:\Mini Program\my_project_server\server`
- 预测试门店：`shop_id=3`
- MCP 网关：`https://laofei.com.cn/mcp/v1`
- 当前环境：预测试环境，默认禁止正式下单

## 一、智能点餐 Skill 开发

依据 MCP 接入文档和 PRD，创建并持续完善 `barbecue-smart-order` Skill。

### 已实现能力

- 真实菜单优先：先读取菜单，再推荐菜品。
- 固定预测试门店 `shop_id=3`。
- 固定 MCP 网关及工具发现流程。
- 支持多人用餐、预算、辣度、过敏原、忌口、健身、控重和食量目标。
- 使用整数分表示金额，例如 `15000` 表示 150 元。
- 真实菜单、价格、库存、菜品状态和辣度变体校验。
- 不吃辣成员的最终变体校验，不能把“微辣”分配给免辣成员。
- 共享菜必须同时满足所有被分配成员的安全约束。
- 保留 `session_id`、`plan_id`、`draft_id` 等 opaque ID，不转成数字。
- 支持菜单版本、revision 冲突和增量调餐。
- 支持 MCP 响应的 `result`、`content[*].text` 双层解析。
- 没有真实菜单、价格、库存或 draft_id 时，不生成虚构结果，也不绕过下单门禁。

## 二、MCP 工具链路

标准点餐工具：

1. `get_store_menu`
2. `get_dish_profile`
3. `create_dining_session`
4. `solve_meal_plan`
5. `adjust_meal_plan`
6. `validate_order_draft`
7. `submit_order`

后端大模型接口：

- `POST /mcp/v1/chat`
- `GET /mcp/v1/config`

### 线上问题及修复

曾出现后端配置读取到中文弯引号：

```text
“https://lax.toklens.ai/v1”
```

导致 Java HTTP 客户端解析失败。

后端已增加：

- ASCII 和中文外层引号清理；
- `/v1` 自动补全 `/chat/completions`；
- API Key、模型名和 URL 统一规范化。

正确上游接口为：

```text
https://lax.toklens.ai/v1/chat/completions
```

线上验证结果：

- `/mcp/v1/config`：HTTP 200
- `/mcp/v1/chat`：HTTP 200
- `chat_with_llm`：HTTP 200
- 工具发现：HTTP 200
- 真实菜单：HTTP 200
- 建桌：HTTP 200
- 确定性配餐：HTTP 200
- 增量调餐：HTTP 200

## 三、Skill 可视化输出协议

为支持不同大模型和 Agent 平台，Skill 增加了通用可视化输出协议：

- 优先输出方案卡片，而不是长段自然语言。
- 支持 Markdown 表格降级。
- 支持结构化 `ui.meal_plan_card`。
- 菜品列表展示真实菜名、数量、单价、小计、辣度、分配成员和安全状态。
- 禁止为了美化补造图片、营养、评分、销量或标签。
- 输出调整方案、校验草稿和确认下单按钮语义。
- 预测试环境确认下单按钮固定禁用。

## 四、H5 页面迭代

### 初版

初版页面包含：

- 人数、预算和桌号设置；
- 配餐策略选择；
- 多人餐桌 DNA 标签；
- MCP 调试面板；
- AI 方案展示；
- 预测试订单确认区。

### 简化版

根据使用体验反馈，页面改为低操作负担的对话式点餐：

- 欢迎区；
- 单一对话输入框；
- AI 和用户聊天气泡；
- 快捷需求按钮；
- 方案结果卡；
- 预测试安全提示；
- 连接诊断默认折叠。

用户只需输入：

```text
3个人，预算200元，1人不吃辣，想吃得均衡
```

页面自动执行：

```text
自然语言输入
→ 后端大模型解析
→ 发现 MCP 工具
→ 获取 #3 门店真实菜单
→ 创建用餐会话
→ 确定性配餐
→ 展示方案卡
```

### 页面文件

```text
G:\Mini Program\diancanSkills\index.html
G:\Mini Program\diancanSkills\styles.css
G:\Mini Program\diancanSkills\app.js
```

## 五、H5 问题修复记录

### 1. 方案无法解析

原因：MCP 同时返回结构化 `result.plan` 和 `content[*].text` JSON 字符串，前端只解析了部分 envelope。

修复：增强 `businessOf`、`toolText` 和 `renderPlan`，兼容：

- `result.plan`
- `result.adjusted_plan`
- `result.result.plan`
- `result.content[*].text`

### 2. 简化页面点击无反应

原因：页面删掉高级设置后，旧版 JS 初始化仍然无条件访问：

- `advancedToggle`
- `dinerCount`
- `budgetYuan`
- `memberCards`
- `solveBtn`
- `menuVersion`

导致页面初始化异常，发送按钮没有完成绑定。

修复：

- 对可选 DOM 增加空值保护；
- 人数和预算解析结果保存到 `state`；
- 建桌参数使用 `state.partySize` 和 `state.budgetYuan`；
- 调试面板不存在时不再中断。

### 3. 发送按钮点击无效

修复：

- 发送按钮增加 `type="button"`；
- 增加空输入提示；
- 增加 Promise 异常兜底；
- 请求结束恢复按钮状态；
- 连接状态元素增加空值保护。

## 六、下单提交安全流程

Skill 已写入完整下单流程：

```text
方案生成
→ 创建/刷新 draft
→ validate_order_draft
→ 展示最终明细
→ 用户明确确认
→ 最终门禁
→ submit_order
→ 返回订单结果
```

### 提交门禁

必须同时满足：

- 存在真实 `draft_id`；
- 草稿未过期；
- 最近校验结果为 `VALID`；
- 菜单版本、价格、库存、数量、辣度和费用未变化；
- 用户确认针对当前订单明细；
- 使用幂等键；
- 非预测试锁定环境。

按钮点击、模型判断或“看起来可以”不能代替用户明确确认。

### 异常状态

- `ORDER_CREATED`：订单创建成功；
- `ORDER_DUPLICATE`：幂等请求已处理，不重复提交；
- `SUBMIT_UNKNOWN`：提交超时或网络中断，必须查询状态；
- 同一订单意图重试必须复用同一个幂等键；
- 预测试环境即使用户确认，也不调用 `submit_order`。

## 七、当前 Skill 文件

```text
G:\Mini Program\diancanSkills\barbecue-smart-order\SKILL.md
G:\Mini Program\diancanSkills\barbecue-smart-order\references\tool-contracts.md
G:\Mini Program\diancanSkills\barbecue-smart-order\references\ordering-rules.md
G:\Mini Program\diancanSkills\barbecue-smart-order\references\nutrition-policy.md
G:\Mini Program\diancanSkills\barbecue-smart-order\evals\acceptance-cases.json
```

验收用例目前覆盖：

- 真实菜单读取；
- 预算变化；
- 不吃辣和共享菜安全；
- 过敏原和营养未知；
- revision 冲突；
- 费用一致性；
- draft_id 缺失禁止下单；
- 按钮点击不等于确认；
- 校验后订单变更必须重新确认；
- 提交超时同幂等键恢复；
- 预测试环境禁止正式下单。

## 八、当前待办

1. 将 Skill 的 `ui.meal_plan_card` 协议进一步适配更多 Agent 平台。
2. 如果后端提供 draft 创建和订单状态查询接口，再接通 H5 的草稿校验流程。
3. 正式环境上线前移除预测试锁定，并完成权限、支付、幂等和订单状态联调。
4. 持续验证大模型返回的 Markdown/JSON 列表在 H5 中自动转为安全卡片展示。

## 当前结论

核心链路已经完成：真实 MCP 菜单、后端大模型、确定性配餐、对话式 H5、可视化方案输出和下单安全规则均已建立。

当前仍处于预测试模式，页面可以演示真实菜单和配餐，但默认不会创建真实订单。
