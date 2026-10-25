#!/usr/bin/env python3
"""Unified, scope-honest delivery gate for AI Development OS v4.3."""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import re
import subprocess
import sys


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace") if path.is_file() else ""


def field(text: str, name: str) -> str:
    match = re.search(rf"(?mi)^\s*{re.escape(name)}\s*:\s*`?([^`\r\n]+?)`?\s*$", text)
    return match.group(1).strip() if match else ""


def status(text: str, name: str) -> str:
    return field(text, name).upper()


def inside(root: Path, path: Path) -> bool:
    try:
        path.resolve().relative_to(root.resolve())
        return True
    except ValueError:
        return False


def required_file(path: Path, label: str, errors: list[str]) -> str:
    text = read(path)
    if not text.strip():
        errors.append(f"missing or empty {label}: {path.name}")
    return text


def check_work(root: Path, work: Path, phase: str) -> list[str]:
    errors: list[str] = []
    if not inside(root, work):
        return ["Work Item path must remain inside repository root"]
    if not work.is_dir():
        return [f"Work Item directory missing: {work}"]

    required = {
        "WORK_ITEM.md": ("## Requirement Contract", "## Acceptance Decision"),
        "IMPACT_MAP.md": ("## Authoritative Owner", "## Layer Coverage"),
        "IMPLEMENTATION_DESIGN.md": ("## Root Fix / Owner", "## Verification Strategy"),
        "IMPLEMENTATION_READY_REPORT.md": ("IMPLEMENTATION_READY: YES",),
        "SCENARIO_MATRIX.md": (),
        "DELIVERY_GATE.md": (),
    }
    texts: dict[str, str] = {}
    for name, markers in required.items():
        text = required_file(work / name, "Work Item evidence", errors)
        texts[name] = text
        for marker in markers:
            if text and marker not in text:
                errors.append(f"{name} missing required marker: {marker}")

    gate = texts.get("DELIVERY_GATE.md", "")
    if not gate:
        return errors
    if status(gate, "Implementation Ready") != "YES":
        errors.append("Implementation Ready must be YES")

    route_fields = (
        "Product Inception Gate", "UI Gate", "Cross Layer Gate", "Multi Agent Gate",
        "Security Gate", "Test Gate", "Independent Review", "Acceptance",
    )
    for name in route_fields:
        if not field(gate, name):
            errors.append(f"DELIVERY_GATE.md missing route field: {name}")

    product_gate = status(gate, "Product Inception Gate")
    if product_gate == "REQUIRED":
        for name in ("PROJECT_CHARTER.md", "RESEARCH_BRIEF.md", "PRODUCT_ANALYSIS.md", "PRD_APPROVAL.md"):
            required_file(work / name, "product inception evidence", errors)
        analysis = read(work / "PRODUCT_ANALYSIS.md")
        approval = read(work / "PRD_APPROVAL.md")
        if status(analysis, "Go/No-Go Decision") != "GO":
            errors.append("PRODUCT_ANALYSIS.md Go/No-Go Decision must be GO")
        if status(approval, "Approval Status") != "APPROVED":
            errors.append("PRD_APPROVAL.md Approval Status must be APPROVED")
        if status(approval, "Research Traceability") != "COMPLETE":
            errors.append("PRD_APPROVAL.md Research Traceability must be COMPLETE")
    elif product_gate != "NOT_APPLICABLE":
        errors.append("Product Inception Gate must be REQUIRED or NOT_APPLICABLE")

    ui = status(gate, "UI Gate")
    if ui == "REQUIRED":
        ui_dir_value = field(gate, "UI Artifact Dir")
        if not ui_dir_value:
            errors.append("UI Gate is REQUIRED but UI Artifact Dir is missing")
        else:
            ui_dir = root / ui_dir_value if not Path(ui_dir_value).is_absolute() else Path(ui_dir_value)
            approval_result = subprocess.run(
                [sys.executable, str(root / ".ai/scripts/validate_ui_gate.py"),
                 "--root", str(root), "--work-item", str(work),
                 "--require-ui-prototype", "--prototype-dir", str(ui_dir)],
                text=True, capture_output=True,
            )
            if approval_result.returncode:
                errors.append("UI prototype approval sub-gate failed: " + (approval_result.stdout.strip() or approval_result.stderr.strip()))
            command = [
                sys.executable, str(root / ".ai/scripts/validate_ui_fidelity.py"),
                "--root", str(root), "--ui-dir", str(ui_dir),
                "--phase", "accept" if phase == "accept" else "plan",
            ]
            result = subprocess.run(command, text=True, capture_output=True)
            if result.returncode:
                errors.append("UI fidelity sub-gate failed: " + (result.stdout.strip() or result.stderr.strip()))
            capability_result = subprocess.run(
                [sys.executable, str(root / ".ai/scripts/validate_ui_capabilities.py"),
                 "--root", str(root), "--ui-dir", str(ui_dir),
                 "--phase", "accept" if phase == "accept" else "plan"],
                text=True, capture_output=True,
            )
            if capability_result.returncode:
                errors.append("UI capability sub-gate failed: " + (capability_result.stdout.strip() or capability_result.stderr.strip()))
    elif ui != "NOT_APPLICABLE":
        errors.append("UI Gate must be REQUIRED or NOT_APPLICABLE")

    cross_layer = status(gate, "Cross Layer Gate")
    if cross_layer == "REQUIRED":
        result = subprocess.run(
            [sys.executable, str(root / ".ai/scripts/validate_cross_layer.py"),
             "--root", str(root), "--evidence-dir", str(work), "--strict"],
            text=True, capture_output=True,
        )
        if result.returncode:
            errors.append("Cross Layer sub-gate failed: " + (result.stdout.strip() or result.stderr.strip()))
    elif cross_layer != "NOT_APPLICABLE":
        errors.append("Cross Layer Gate must be REQUIRED or NOT_APPLICABLE")

    multi_agent = status(gate, "Multi Agent Gate")
    if multi_agent == "REQUIRED":
        agent = required_file(work / "AGENT_PLAN.md", "multi-agent evidence", errors)
        if agent and status(agent, "Aggregation Status") != "PASS":
            errors.append("AGENT_PLAN.md Aggregation Status must be PASS")
        if agent and not field(agent, "Independent Reviewer"):
            errors.append("AGENT_PLAN.md Independent Reviewer is required")
    elif multi_agent != "NOT_APPLICABLE":
        errors.append("Multi Agent Gate must be REQUIRED or NOT_APPLICABLE")

    if phase == "accept":
        scenario = texts.get("SCENARIO_MATRIX.md", "").upper()
        if any(token in scenario for token in ("| NOT_RUN |", "| UNKNOWN |", "| FAIL |", "| BLOCKED |")):
            errors.append("Scenario Matrix contains material non-PASS results")
        expected = {
            "Security Gate": "PASS",
            "Test Gate": "PASS",
            "Independent Review": "PASS",
            "Acceptance": "ACCEPTED",
        }
        for name, value in expected.items():
            if status(gate, name) != value:
                errors.append(f"{name} must be {value} for acceptance")

        security = required_file(work / "SECURITY_AUDIT.md", "security evidence", errors)
        if security:
            for name, value in {
                "Security Decision": "APPROVED", "Threat Model Status": "COMPLETE",
                "Critical Open": "0", "High Open": "0",
            }.items():
                if status(security, name) != value:
                    errors.append(f"SECURITY_AUDIT.md {name} must be {value}")
            for name in ("Secret Scan", "Dependency Scan", "SAST"):
                if status(security, name) not in {"PASS", "NOT_APPLICABLE"}:
                    errors.append(f"SECURITY_AUDIT.md {name} must be PASS or NOT_APPLICABLE")

        tests = required_file(work / "TEST_REPORT.md", "test evidence", errors)
        if tests:
            if status(tests, "Test Decision") != "PASS":
                errors.append("TEST_REPORT.md Test Decision must be PASS")
            if status(tests, "Required Checks Complete") != "YES":
                errors.append("TEST_REPORT.md Required Checks Complete must be YES")
            if status(tests, "Failed Required Checks") != "0":
                errors.append("TEST_REPORT.md Failed Required Checks must be 0")
        acceptance = required_file(work / "ACCEPTANCE_REPORT.md", "acceptance evidence", errors)
        if acceptance and status(acceptance, "Decision") != "ACCEPTED":
            errors.append("ACCEPTANCE_REPORT.md Decision must be ACCEPTED")
    return errors


def git(root: Path, *args: str) -> tuple[int, str]:
    result = subprocess.run(["git", *args], cwd=root, text=True, capture_output=True)
    return result.returncode, result.stdout.strip()


def check_release(root: Path, work: Path, evidence: Path) -> list[str]:
    errors = check_work(root, work, "accept")
    rc, head = git(root, "rev-parse", "HEAD")
    if rc:
        errors.append("Release Gate requires a Git repository and integrated commit")
        return errors
    if not inside(root, evidence):
        errors.append("Release evidence path must remain inside repository root")
        return errors
    text = required_file(evidence, "release evidence", errors)
    required_values = {
        "Release Decision": "APPROVED", "Deployment Status": "PASS",
        "Smoke Test": "PASS", "Production Verification": "PASS",
        "Rollback Ready": "YES", "Release Approval": "APPROVED",
    }
    for name, value in required_values.items():
        if status(text, name) != value:
            errors.append(f"Release evidence {name} must be {value}")
    integrated = field(text, "Integrated Commit").lower()
    deployed = field(text, "Deployed Commit").lower()
    integration_branch = field(text, "Integration Branch")
    branch_rc, current_branch = git(root, "branch", "--show-current")
    if branch_rc or not integration_branch or current_branch != integration_branch:
        errors.append("Integration Branch must equal the current Git branch")
    if not re.fullmatch(r"[0-9a-f]{40}", integrated):
        errors.append("Integrated Commit must be a full Git SHA")
    else:
        rc, _ = git(root, "merge-base", "--is-ancestor", integrated, head)
        if rc:
            errors.append("Integrated Commit is not contained in current HEAD")
    if deployed != integrated:
        errors.append("Deployed Commit must equal Integrated Commit")
    artifact_value = field(text, "Artifact Path")
    digest = field(text, "Artifact SHA256").lower()
    if not artifact_value:
        errors.append("Release evidence Artifact Path is required")
    else:
        artifact = root / artifact_value
        if not inside(root, artifact) or not artifact.is_file():
            errors.append("Release artifact is missing or outside repository root")
        elif hashlib.sha256(artifact.read_bytes()).hexdigest() != digest:
            errors.append("Release artifact SHA256 mismatch")
    if not field(text, "Target Environment"):
        errors.append("Release evidence Target Environment is required")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="AI Development OS delivery gate")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2])
    sub = parser.add_subparsers(dest="scope", required=True)
    sub.add_parser("package")
    work_parser = sub.add_parser("work")
    work_parser.add_argument("--work-item", type=Path, required=True)
    work_parser.add_argument("--phase", choices=("ready", "accept"), default="ready")
    release_parser = sub.add_parser("release")
    release_parser.add_argument("--work-item", type=Path, required=True)
    release_parser.add_argument("--release-evidence", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()

    if args.scope == "package":
        sys.path.insert(0, str(root / ".ai/scripts"))
        from validate_v43_package import validate_package
        errors = validate_package(root)
        label = "PACKAGE"
    elif args.scope == "work":
        errors = check_work(root, args.work_item.resolve(), args.phase)
        label = "WORK"
    else:
        errors = check_release(root, args.work_item.resolve(), args.release_evidence.resolve())
        label = "RELEASE"

    if errors:
        print(f"{label} GATE: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"{label} GATE: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
