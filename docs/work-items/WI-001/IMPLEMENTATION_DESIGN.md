# Implementation Design — WI-001

## Root Fix / Owner

Make `.ai/scripts/validate.py` the current v4.3 policy-check entry and make `.ai/scripts/validate_v43_package.py` the package/semantic integrity authority.

## Why this location

The documented `/policy-check` command already delegates to `validate.py`; strengthening that path repairs the shared validation capability instead of adding another disconnected command.

## End-to-End Change

### Backend

- Refactor the dependency-free validators into explicit checks with actionable errors.
- Check current version markers, lifecycle ordering, implementation-ready gate, prototype enforcement, completion-state separation, required files, and manifest integrity.

### Frontend

N/A.

### UI / Interaction

N/A. CLI output will consistently identify `AI Development OS v4.3` and summarize errors/warnings.

### Data / Persistence

Regenerate `MANIFEST.json` after all edits so its file list, size and SHA-256 values match the package.

### Interfaces / Contracts

Preserve existing command-line options. Allow `validate_v43_package.py` to accept an optional root path, matching current usage examples and the earlier invocation pattern.

### Jobs / Events / Integrations

N/A.

## Preserve / Compatibility

- Retain existing Git/workstream checks and release-specific document checks.
- Retain older versioned validators as compatibility tools.
- Do not initialize the baseline placeholders in this distributable template.

## API Consumer Migration / Handoff

N/A. No consumer action required.

## Failure / Boundary Behavior

- Missing/unreadable/invalid manifest fails cleanly.
- Missing, extra, size-mismatched or hash-mismatched package files fail with exact paths.
- Non-Git installation warns and skips Git-only checks rather than failing.
- Semantic markers are checked in authoritative files; inherited historical documents are not rejected merely for mentioning old versions.

## Runtime / Performance / Reliability

One bounded recursive file scan and SHA-256 pass over this small package. No network or third-party dependencies.

## Security / Permissions

Read-only validation except the explicit manifest-regeneration maintenance step. No shell interpolation of repository content.

## UI Design Track

N/A — `UI_IMPACT=NONE`; no structural UI/refactor/redesign.

## Vertical Slice Plan

1. T01: upgrade package and policy validation; prove current package passes.
2. T02: align current-version entry documents and lifecycle wording.
3. T03: regenerate manifest, run positive/release checks, then verify an isolated corrupted copy fails.

## Verification Strategy

- Compile Python scripts with `py_compile`.
- Run `validate.py` and `validate.py --release`.
- Run v4.1, v4.2 and v4.3 package validators for backward compatibility.
- Copy the package to a temporary directory, corrupt a guarded semantic marker and assert v4.3 validation fails.
- Independently compare manifest entries/count/size/hash against the final file tree.

## Rollback / Recovery

All changes are documentation/Python policy files. In this non-Git directory, preserve pre-change intent in this Work Item and keep edits narrowly scoped; if validation cannot be made self-consistent, stop at PARTIAL and report exact files.

