#!/usr/bin/env python3
"""Validate AI Development OS v4.3 package structure, semantics, and integrity."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys


PACKAGE_VERSION = "4.3"
MANIFEST_NAME = "MANIFEST.json"

REQUIRED_FILES = (
    "VERSION.md",
    "AGENTS.md",
    "README.md",
    "USAGE.md",
    ".ai/SKILL.md",
    ".ai/commands/work.md",
    ".ai/rules/WORKFLOW_CORE.md",
    ".ai/rules/WORKFLOW_ROUTER_RULES.md",
    ".ai/rules/IMPLEMENTATION_READY_RULES.md",
    ".ai/rules/IMPACT_MAP_AUTHORITY_RULES.md",
    ".ai/rules/SCENARIO_MATRIX_RULES.md",
    ".ai/rules/COMPLETION_STATE_RULES.md",
    ".ai/rules/PROTOTYPE_ENFORCEMENT_RULES.md",
    ".ai/templates/WORK_ITEM.md",
    ".ai/templates/IMPACT_MAP.md",
    ".ai/templates/IMPLEMENTATION_DESIGN.md",
    ".ai/templates/SCENARIO_MATRIX.md",
    ".ai/templates/IMPLEMENTATION_READY_REPORT.md",
    ".ai/templates/PROTOTYPE_APPROVAL.md",
    ".ai/templates/UI_IMPLEMENTATION_MAP.md",
    ".ai/templates/MEASURED_UI_SPEC.md",
    ".ai/templates/STRUCTURAL_DIFF.md",
    ".ai/templates/SCREENSHOT_VISUAL_DIFF_REPORT.md",
    ".ai/templates/PROTOTYPE_INTERACTION_CONTRACT.md",
    ".ai/templates/BACKEND_COORDINATION_REPORT.md",
    ".ai/scripts/validate.py",
    ".ai/scripts/validate_ui_gate.py",
    ".ai/scripts/validate_ui_fidelity.py",
    ".ai/scripts/validate_ui_capabilities.py",
    ".ai/scripts/gate.py",
    ".ai/rules/PRODUCT_LIFECYCLE_RULES.md",
    ".ai/rules/SECURITY_AUDIT_RULES.md",
    ".ai/rules/MULTI_AGENT_ORCHESTRATION_RULES.md",
    ".ai/templates/DELIVERY_GATE.md",
    ".ai/templates/SECURITY_AUDIT.md",
    ".ai/templates/TEST_REPORT.md",
    ".ai/templates/RELEASE_EVIDENCE.md",
    "docs/WORKFLOW_V4_2.md",
    "docs/UI_PROTOTYPE_ENFORCEMENT.md",
    MANIFEST_NAME,
)

SEMANTIC_MARKERS = {
    "VERSION.md": ("AI Development OS v4.3",),
    "AGENTS.md": (
        "AI Development OS v4.3",
        "IMPLEMENTATION_READY = YES",
        "PROTOTYPE_REQUIREMENT=REQUIRED",
        "PROTOTYPE_MODE=HTML",
        "Approval Status: APPROVED",
        "validate_ui_fidelity.py --phase plan",
        "validate_ui_fidelity.py --phase accept",
    ),
    ".ai/SKILL.md": (
        "AI Development OS v4.3",
        "Impact Map",
        "Scenario Matrix",
        "ACCEPTED",
        "INTEGRATED",
        "RELEASED",
        "PROTOTYPE_MODE=HTML",
        "strict prototype-to-production fidelity gate",
    ),
    ".ai/commands/work.md": (
        "IMPLEMENTATION_READY — HARD GATE",
        "Production edits are forbidden until the result is `YES`",
        "Scenario Matrix",
        "HTML/HTM prototype",
    ),
    ".ai/rules/WORKFLOW_ROUTER_RULES.md": (
        "UI_IMPACT=MINOR|STRUCTURAL",
        "PROTOTYPE_MODE=HTML",
        "Approval Status: APPROVED",
    ),
    ".ai/rules/PROTOTYPE_ENFORCEMENT_RULES.md": (
        "PROTOTYPE_REQUIREMENT=REQUIRED",
        "PROTOTYPE_MODE=HTML",
        "IMPLEMENTATION_READY=NO",
        "Approval Status: APPROVED",
    ),
    ".ai/templates/PROTOTYPE_APPROVAL.md": (
        "Prototype Mode: HTML",
        "Presented To User: YES / NO",
        "Approval Status: DRAFT / APPROVED / REVISE",
    ),
    ".ai/commands/ui-implement.md": (
        "Unmapped Prototype Regions",
        "Unclassified Legacy Regions",
        "validate_ui_capabilities.py",
        "BACKEND_COORDINATION_REPORT.md",
        "--phase plan",
    ),
    ".ai/rules/ACCEPTANCE_RULES.md": (
        "validate_ui_fidelity.py --phase accept",
        "validate_ui_capabilities.py --phase accept",
        "BACKEND_COORDINATION_REPORT.md",
        "Functional usability",
    ),
    ".ai/templates/UI_IMPLEMENTATION_MAP.md": (
        "Mapping Status: DRAFT / COMPLETE",
        "All Prototype Regions Mapped: YES / NO",
        "Legacy Structure Reused Without Approval: YES / NO",
    ),
    ".ai/templates/SCREENSHOT_VISUAL_DIFF_REPORT.md": (
        "Production Presented To User: YES / NO",
        "User Fidelity Confirmation: PENDING / APPROVED / REVISE",
    ),
    ".ai/rules/COMPLETION_STATE_RULES.md": (
        "`ACCEPTED`",
        "`INTEGRATED`",
        "`RELEASED`",
        "`DONE` must not hide these distinctions",
    ),
    ".ai/rules/WORKFLOW_CORE.md": (
        "IDEA → RESEARCHED → PROJECT_APPROVED → PRD_APPROVED",
        "package` validates installation/package integrity only",
        "RELEASE_READY → DEPLOYED → PRODUCTION_VERIFIED → RELEASED",
    ),
    ".ai/scripts/gate.py": (
        "def check_work",
        "def check_release",
        "validate_package(root)",
        "Release Gate requires a Git repository and integrated commit",
    ),
    ".ai/rules/SECURITY_AUDIT_RULES.md": (
        "Security Decision: APPROVED",
        "open CRITICAL = 0",
    ),
    ".ai/templates/DELIVERY_GATE.md": (
        "Product Inception Gate",
        "Multi Agent Gate",
        "Independent Review",
    ),
    ".ai/scripts/validate_ui_capabilities.py": (
        "PROTOTYPE_INTERACTION_CONTRACT.md",
        "BACKEND_COORDINATION_REPORT.md",
        "UI CAPABILITY ACCEPTANCE GATE",
        "Unresolved backend capabilities: 0",
    ),
    ".ai/templates/PROTOTYPE_INTERACTION_CONTRACT.md": (
        "All Prototype Interactions Mapped",
        "Production Fake/Mock/Placeholder Interactions",
        "Unresolved Required Backend Capabilities",
        "API_EXTENSION / NEW_API / NOT_SUPPORTED",
    ),
    "docs/WORKFLOW_V4_2.md": (
        "BASELINE FAST CONTEXT",
        "IMPLEMENTATION_READY",
        "SELF_VERIFY",
        "BASELINE UPDATE",
    ),
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def package_files(root: Path) -> set[str]:
    return {
        path.relative_to(root).as_posix()
        for path in root.rglob("*")
        if path.is_file()
        and path.name != MANIFEST_NAME
        and path.suffix != ".pyc"
        and not {".git", "__pycache__", ".pytest_cache"}.intersection(
            path.relative_to(root).parts
        )
    }


def validate_required_files(root: Path, errors: list[str]) -> None:
    for relative_path in REQUIRED_FILES:
        if not (root / relative_path).is_file():
            errors.append(f"missing required file: {relative_path}")


def validate_semantics(root: Path, errors: list[str]) -> None:
    for relative_path, markers in SEMANTIC_MARKERS.items():
        path = root / relative_path
        if not path.is_file():
            continue
        content = path.read_text(encoding="utf-8", errors="replace")
        for marker in markers:
            if marker not in content:
                errors.append(f"semantic marker missing in {relative_path}: {marker}")


def validate_manifest(root: Path, errors: list[str]) -> None:
    manifest_path = root / MANIFEST_NAME
    if not manifest_path.is_file():
        return

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        errors.append(f"invalid {MANIFEST_NAME}: {exc}")
        return

    if str(manifest.get("version")) != PACKAGE_VERSION:
        errors.append(
            f"manifest version mismatch: expected {PACKAGE_VERSION}, "
            f"got {manifest.get('version')!r}"
        )

    entries = manifest.get("files")
    if not isinstance(entries, list):
        errors.append("manifest field 'files' must be a list")
        return

    declared_count = manifest.get("file_count_excluding_manifest")
    if declared_count != len(entries):
        errors.append(
            "manifest file count mismatch: "
            f"declared {declared_count!r}, listed {len(entries)}"
        )

    listed: dict[str, dict[str, object]] = {}
    for index, entry in enumerate(entries):
        if not isinstance(entry, dict):
            errors.append(f"manifest entry {index} must be an object")
            continue
        relative_path = entry.get("path")
        if not isinstance(relative_path, str) or not relative_path:
            errors.append(f"manifest entry {index} has invalid path")
            continue
        pure_path = PurePosixPath(relative_path)
        if pure_path.is_absolute() or ".." in pure_path.parts or "\\" in relative_path:
            errors.append(f"manifest path is not normalized/safe: {relative_path}")
            continue
        if relative_path in listed:
            errors.append(f"duplicate manifest path: {relative_path}")
            continue
        listed[relative_path] = entry

    actual = package_files(root)
    listed_paths = set(listed)
    for relative_path in sorted(actual - listed_paths):
        errors.append(f"unlisted file: {relative_path}")
    for relative_path in sorted(listed_paths - actual):
        errors.append(f"manifest references missing file: {relative_path}")

    for relative_path in sorted(actual & listed_paths):
        path = root / relative_path
        entry = listed[relative_path]
        actual_size = path.stat().st_size
        expected_size = entry.get("size")
        if expected_size != actual_size:
            errors.append(
                f"size mismatch: {relative_path} "
                f"(manifest={expected_size!r}, actual={actual_size})"
            )
        expected_hash = entry.get("sha256")
        actual_hash = sha256(path)
        if expected_hash != actual_hash:
            errors.append(f"hash mismatch: {relative_path}")


def validate_package(root: Path, *, verify_manifest: bool = True) -> list[str]:
    resolved_root = root.resolve()
    errors: list[str] = []
    validate_required_files(resolved_root, errors)
    validate_semantics(resolved_root, errors)
    if verify_manifest:
        validate_manifest(resolved_root, errors)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate an AI Development OS v4.3 package"
    )
    parser.add_argument(
        "root",
        nargs="?",
        type=Path,
        default=Path(__file__).resolve().parents[2],
        help="package root (defaults to this script's package)",
    )
    args = parser.parse_args()

    errors = validate_package(args.root)
    if errors:
        print("FAIL: v4.3 package validation")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS: v4.3 package structure, semantics, and manifest are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
