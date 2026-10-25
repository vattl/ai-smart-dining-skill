# 点餐业务规则

## Constraint priority

1. Safety and hard restrictions: allergies, explicit forbidden ingredients, verified kitchen limitations.
2. Order validity: active SKU, known price, stock/sale status, quantity and variant rules.
3. Budget and required portion constraints when verified.
4. Strong preferences: no-spicy, dislikes, dining mode.
5. Soft goals: balanced variety, high protein, weight control, calorie preference.

Never let a soft score compensate for a safety violation or exceed the budget.

## Member allocation and safety

- Treat `member_id` as stable for the lifetime of a dining session. Never reuse an ID after removing a member.
- Do not bind an ambiguous phrase such as “其中一人” to P1 automatically. Ask for the target member or keep the constraint unassigned until resolved.
- Apply allergy and ingredient restrictions to every member receiving a shared item. A shared dish is not exempt from member-level safety checks.
- For a no-spicy member, verify the selected line item's actual variant, not only the dish-level capability. `non_spicy_available=true` is insufficient when the selected `spice_level` is `微辣` or another spicy value.

## Session concurrency and revisions

- Keep `session_id` and `revision` in state. Send the latest revision for every session mutation when the API supports it.
- On a revision conflict, do not overwrite the newer state. Re-read the current session and plan, then apply the user's patch again.
- Invalidate the prior plan, draft, validation, and confirmation after any accepted constraint mutation.
- Require the authorized session owner or order principal to provide the final confirmation.
- Bind the confirmation to the current `draft_id`, menu version, final line items, amount, fees, and validation timestamp; any mutation invalidates it.
- Model submission as `READY_TO_VALIDATE -> VALIDATED -> AWAITING_CONFIRMATION -> SUBMITTING -> ORDER_CREATED`, with `SUBMIT_UNKNOWN` for timeout/connection loss. Never treat a button click or model inference as confirmation.
- Retry the same unresolved submission with the same idempotency key only after status lookup; never create a second key for the same order intent.
- Prediction-test mode ends at validation and must not invoke `submit_order`.

## Structured adjustment patch

Prefer a structured patch alongside the original natural-language request:

```json
{
  "member_constraints": [
    {"member_id": "P1", "add_restrictions": ["no_beef"]}
  ],
  "budget_fen": 13000,
  "add_items": [],
  "remove_items": [],
  "strategy": null,
  "patch_text": "其中一人不吃牛肉，再便宜20元"
}
```

Require the service to validate the patch and preserve all fields not included in it. Do not infer an unspecified member or silently relax a hard restriction.

## Visual plan and action presentation

- 方案输出必须同时服务顾客阅读和宿主渲染：自然语言负责解释，结构化 `ui.type=meal_plan_card` 负责卡片、菜品列表、费用摘要和按钮。
- 列表字段只允许使用当前菜单/求解/校验接口返回值；不得为了视觉效果补造图片、折扣、营养、库存或推荐标签。
- 操作按钮不是授权凭证。`adjust_meal_plan`、`validate_order_draft`、`submit_order` 必须各自执行对应参数和安全门禁。
- 在预测试环境中，确认下单按钮始终禁用并展示禁用原因；真实下单必须等待最新草稿校验和明确用户确认。

## Fees and total consistency

Require a structured total when fees apply:

```json
{
  "subtotal_fen": 12000,
  "service_fee_fen": 0,
  "packing_fee_fen": 200,
  "delivery_fee_fen": 0,
  "discount_fen": 500,
  "total_fen": 11700
}
```

Verify `total_fen` against the server response. Never display a dish subtotal as the amount payable when additional fees or discounts exist.

## State flow

`COLLECTING -> FETCHING_MENU -> SOLVING -> PROPOSED -> VALIDATING -> AWAITING_CONFIRMATION -> ORDER_CREATED`

Use `INFEASIBLE` when no valid plan exists and `FAILED` when the service or upstream system fails. Return to `PROPOSED` after a valid adjustment and return to `VALIDATING` before confirmation.

## Truth and freshness

The server menu is authoritative. Attach menu version and validation time to every candidate. Do not silently substitute a similar SKU. If an item becomes unavailable, regenerate or ask the user to choose; preserve the old draft for audit but do not submit it.

## Confirmation

Planning is not ordering. A phrase that approves a recommendation is not enough if the exact latest total and item list have not been shown. Request an explicit confirmation after validation. Any material change cancels the previous confirmation.

## Fallback

When the menu or order service is unavailable, preserve structured user constraints, explain the limitation, and route to manual ordering. Never generate a plausible sample price as a fallback.
