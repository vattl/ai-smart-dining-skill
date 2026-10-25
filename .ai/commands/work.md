# /work — Unified Work Item Entry (v4.3)

Use for normal product and engineering work. `/work` owns routing and specialist-track selection.

## 1. REQUEST
Create/reuse one Work Item and capture the raw request.

For a new product/material initiative, route through `/project`, `/research` and `/prd` first. Do not use an engineering Work Item to manufacture product approval.

## 2. UNDERSTAND — PRODUCT TRUTH
Define Goal / Current / Target / Must Preserve / Acceptance / Open Questions. Identify relevant known business invariants. Do not guess product decisions that materially change the target.

## 3. BASELINE FAST CONTEXT
Read project profile, architecture map, business rules, and design-system profile when UI may matter. Treat baseline as cached context; repository evidence wins.

## 4. ROUTE — TRACK SELECTION ONLY
Classify work type, complexity/risk and required tracks/gates. ROUTE does not choose exact files or implementation details.

Possible required tracks include UI Design, Contract Collaboration, Migration/Data, Reliability/Performance, Security and Baseline Review.

## 5. DISCOVER — ENGINEERING TRUTH
Build/update one authoritative Impact Map from focused repository evidence. Resolve the authoritative owner, consumers, propagation path, interfaces, UI/data/runtime/release surfaces and relevant invariants.

Material `UNKNOWN` blocks implementation.

## 6. DESIGN
Produce one Implementation Design for non-trivial work. Specialist outputs become sections/attachments of this Work Item, not parallel lifecycles.

## 7. PLAN
Split into end-to-end verifiable vertical slices. Build a Scenario Matrix for STANDARD+ work. Each slice must state business outcome, start point, end point, observable result and DoD.

## 8. IMPLEMENTATION_READY — HARD GATE
Evaluate `.ai/rules/IMPLEMENTATION_READY_RULES.md`. Production edits are forbidden until the result is `YES`.

Create `DELIVERY_GATE.md` and run `python .ai/scripts/gate.py work --work-item <dir> --phase ready`. A failed or unrun executable gate keeps the result `NO`.

## 9. IMPLEMENT
Implement one slice at a time. No silent mocks, fake completion, local workaround that contradicts the design, or undocumented contract substitution.

## 10. SELF_VERIFY
Derive checks from the Impact Map + Scenario Matrix + Business Invariants. Verify technical behavior and cross-layer propagation.

## 11. REVIEW
Independent pass for omissions, patch smells, stale consumers, regression risk, architecture drift, invariant violations and false completion.

## 12. ACCEPT
Re-read original requirement and acceptance criteria. Require evidence for every material requirement, scenario, invariant and affected surface.

Run the security, test, independent-review and acceptance gates selected in `DELIVERY_GATE.md`, then run the work gate with `--phase accept`.

## 13. BASELINE UPDATE
Only after acceptance, update Project/Architecture/Design/Business baseline when the accepted change intentionally creates durable new project truth.

## 14. INTEGRATE / optional RELEASE / optional MONITOR
`ACCEPTED`, `INTEGRATED`, `RELEASED` and `MONITORED` are distinct states. Do not require deployment for work whose scope ends at engineering or repository completion.

## Critical principles
- Understand before changing.
- Fix the capability, not only the symptom.
- Impact Map is the Work Item's affected-surface authority.
- No affected layer may silently assume another layer will adapt.
- Any UI impact requires an HTML/HTM prototype, visual reference, explicit user approval, and UI lock. Native previews, silence, inference, and per-Work-Item waivers do not satisfy the gate.
- Any UI impact also requires a complete prototype interaction capability contract. Missing backend capabilities become assigned requests and visible coordination items; they may not be replaced with fake production UI or hidden at completion.
- Completion requires evidence; an agent's claim is not evidence.
- Business invariants must survive the change.
