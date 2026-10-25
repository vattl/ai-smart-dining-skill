# Policy as Code and Workstream Automation

These scripts automate machine-verifiable invariants while preserving model engineering judgment.

## Policy validation

```bash
python .ai/scripts/validate.py
python .ai/scripts/validate.py --release
```

The v4.3 policy check always validates current workflow semantics, governance state, and required package structure. `--release` additionally validates `MANIFEST.json` file count, paths, sizes, and SHA-256 hashes; this keeps normal runtime/baseline state changes from being mistaken for distribution corruption. A non-Git distribution directory produces an explicit warning and skips Git-only transaction checks.

Release validation is intentionally read-only. Refresh `MANIFEST.json` only as an explicit packaging step after all intended files and mutable template state are finalized; do not auto-accept unexplained drift.

## HTML UI prototype gate

```bash
python .ai/scripts/validate_ui_gate.py \
  --root . \
  --require-ui-prototype \
  --prototype-dir design/prototypes/UI001-example
```

The gate accepts only `.html/.htm` review prototypes and requires a screenshot, a single approval record containing both `Presented To User: YES` and `Approval Status: APPROVED`, and a UI lock. `--require-structural-ui` remains a compatibility alias with the same strict behavior.

## Prototype-to-production fidelity gates

```bash
python .ai/scripts/validate_ui_fidelity.py --root . --ui-dir <artifact-dir> --phase plan
python .ai/scripts/validate_ui_fidelity.py --root . --ui-dir <artifact-dir> --phase accept
```

The plan phase requires complete prototype/component mapping, measurements, and classification of every legacy region before production UI editing. The accept phase additionally requires structural target closure, no legacy residue, same-viewport screenshot/diff evidence, zero HIGH/CRITICAL deltas, and explicit final user fidelity confirmation.

## Prototype interaction capability gate

```bash
python .ai/scripts/validate_ui_capabilities.py --root . --ui-dir <artifact-dir> --phase plan
python .ai/scripts/validate_ui_capabilities.py --root . --ui-dir <artifact-dir> --phase accept
```

The plan phase requires every prototype datum/action to map to a real production capability or assigned Backend Capability Request. The accept phase requires VERIFIED provider/consumer integration, real E2E evidence, zero fake production interactions and zero unresolved backend capabilities. On failure it writes `BACKEND_COORDINATION_REPORT.md`; surface that report to the user instead of claiming UI completion.

## Automatic workstream isolation

```bash
python .ai/scripts/workstream.py status
python .ai/scripts/workstream.py list
python .ai/scripts/workstream.py ensure --type FEATURE --parent F012 --title "reservation ordering"
```

See `WORKSTREAM_README.md` and `.ai/rules/AUTO_ISOLATION_RULES.md`.

The scripts must not replace engineering reasoning. Add project-specific checks only when they are reliably machine-verifiable.

## UI screenshot tools (introduced in v3.2)

### Capture a deterministic screenshot

Requires Playwright in the target project:

```bash
node .ai/scripts/capture_ui.mjs \
  --url http://localhost:3000/members \
  --out production.png \
  --width 1440 \
  --height 900
```

### Generate diagnostic image diff

Requires Pillow:

```bash
python .ai/scripts/visual_diff.py \
  prototype.png production.png \
  --out-dir visual-diff-output
```

The generated pixel-difference ratio is diagnostic only. Use `/ui-verify` for acceptance.
