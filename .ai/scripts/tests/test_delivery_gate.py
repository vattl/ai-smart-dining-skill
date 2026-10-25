from __future__ import annotations

import hashlib
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "gate.py"


def write(path: Path, text: str = "evidence\n") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def run_gate(root: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPT), "--root", str(root), *args],
        text=True,
        capture_output=True,
    )


def create_work(root: Path, *, accepted: bool = False) -> Path:
    work = root / "docs" / "work-items" / "WI-TEST"
    write(work / "WORK_ITEM.md", "## Requirement Contract\n## Acceptance Decision\n")
    write(work / "IMPACT_MAP.md", "## Authoritative Owner\n## Layer Coverage\n")
    write(work / "IMPLEMENTATION_DESIGN.md", "## Root Fix / Owner\n## Verification Strategy\n")
    write(work / "IMPLEMENTATION_READY_REPORT.md", "IMPLEMENTATION_READY: YES\n")
    result = "PASS" if accepted else "NOT_RUN"
    write(work / "SCENARIO_MATRIX.md", f"| S01 | path | expected | inv | test | {result} |\n")
    gate = [
        "Implementation Ready: YES",
        "Product Inception Gate: NOT_APPLICABLE",
        "UI Gate: NOT_APPLICABLE",
        "Cross Layer Gate: NOT_APPLICABLE",
        "Multi Agent Gate: NOT_APPLICABLE",
        f"Security Gate: {'PASS' if accepted else 'PLANNED'}",
        f"Test Gate: {'PASS' if accepted else 'PLANNED'}",
        f"Independent Review: {'PASS' if accepted else 'PENDING'}",
        f"Acceptance: {'ACCEPTED' if accepted else 'PENDING'}",
    ]
    write(work / "DELIVERY_GATE.md", "\n".join(gate) + "\n")
    if accepted:
        write(
            work / "SECURITY_AUDIT.md",
            "Security Decision: APPROVED\nThreat Model Status: COMPLETE\n"
            "Critical Open: 0\nHigh Open: 0\nSecret Scan: PASS\n"
            "Dependency Scan: PASS\nSAST: PASS\n",
        )
        write(
            work / "TEST_REPORT.md",
            "Test Decision: PASS\nRequired Checks Complete: YES\n"
            "Failed Required Checks: 0\n",
        )
        write(work / "ACCEPTANCE_REPORT.md", "Decision: ACCEPTED\n")
    return work


class DeliveryGateTests(unittest.TestCase):
    def test_work_gate_rejects_missing_delivery_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            work = root / "docs" / "work-items" / "WI-TEST"
            write(work / "WORK_ITEM.md", "## Requirement Contract\n## Acceptance Decision\n")
            result = run_gate(root, "work", "--work-item", str(work), "--phase", "ready")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("DELIVERY_GATE.md", result.stdout)

    def test_ready_gate_accepts_complete_planning_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            work = create_work(root)
            result = run_gate(root, "work", "--work-item", str(work), "--phase", "ready")
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("WORK GATE: PASS", result.stdout)

    def test_accept_gate_requires_security_test_review_and_acceptance(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            work = create_work(root)
            result = run_gate(root, "work", "--work-item", str(work), "--phase", "accept")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Security Gate", result.stdout)
            self.assertIn("Scenario Matrix", result.stdout)

    def test_product_inception_requires_go_and_approved_traceable_prd(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            work = create_work(root)
            gate = work / "DELIVERY_GATE.md"
            gate.write_text(
                gate.read_text(encoding="utf-8").replace(
                    "Product Inception Gate: NOT_APPLICABLE",
                    "Product Inception Gate: REQUIRED",
                ),
                encoding="utf-8",
            )
            for name in ("PROJECT_CHARTER.md", "RESEARCH_BRIEF.md"):
                write(work / name)
            write(work / "PRODUCT_ANALYSIS.md", "Go/No-Go Decision: PENDING\n")
            write(work / "PRD_APPROVAL.md", "Research Traceability: INCOMPLETE\nApproval Status: DRAFT\n")
            blocked = run_gate(root, "work", "--work-item", str(work), "--phase", "ready")
            self.assertNotEqual(blocked.returncode, 0)
            self.assertIn("Go/No-Go Decision", blocked.stdout)
            self.assertIn("Approval Status", blocked.stdout)

            write(work / "PRODUCT_ANALYSIS.md", "Go/No-Go Decision: GO\n")
            write(work / "PRD_APPROVAL.md", "Research Traceability: COMPLETE\nApproval Status: APPROVED\n")
            passed = run_gate(root, "work", "--work-item", str(work), "--phase", "ready")
            self.assertEqual(passed.returncode, 0, passed.stdout + passed.stderr)

    def test_routed_ui_work_invokes_interaction_capability_gate(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            work = create_work(root)
            gate = work / "DELIVERY_GATE.md"
            gate.write_text(
                gate.read_text(encoding="utf-8")
                .replace("UI Gate: NOT_APPLICABLE", "UI Gate: REQUIRED\nUI Artifact Dir: design/ui-1"),
                encoding="utf-8",
            )
            (root / "design" / "ui-1").mkdir(parents=True)
            scripts = root / ".ai" / "scripts"
            write(scripts / "validate_ui_gate.py", "raise SystemExit(0)\n")
            write(scripts / "validate_ui_fidelity.py", "raise SystemExit(0)\n")
            write(
                scripts / "validate_ui_capabilities.py",
                "print('UI CAPABILITY PLAN GATE: BLOCKED')\nraise SystemExit(4)\n",
            )

            result = run_gate(root, "work", "--work-item", str(work), "--phase", "ready")

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("UI capability", result.stdout)

    def test_release_gate_rejects_non_git_workspace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            work = create_work(root, accepted=True)
            release = root / "release.md"
            write(release, "Release Decision: APPROVED\n")
            result = run_gate(
                root, "release", "--work-item", str(work),
                "--release-evidence", str(release),
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Git repository", result.stdout)

    def test_release_gate_passes_only_with_integrated_deployment_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            subprocess.run(["git", "init", "-q"], cwd=root, check=True)
            subprocess.run(["git", "config", "user.email", "gate@example.test"], cwd=root, check=True)
            subprocess.run(["git", "config", "user.name", "Gate Test"], cwd=root, check=True)
            work = create_work(root, accepted=True)
            artifact = root / "dist" / "artifact.bin"
            write(artifact, "release artifact\n")
            subprocess.run(["git", "add", "."], cwd=root, check=True)
            subprocess.run(["git", "commit", "-qm", "test fixture"], cwd=root, check=True)
            commit = subprocess.run(
                ["git", "rev-parse", "HEAD"], cwd=root, check=True,
                text=True, capture_output=True,
            ).stdout.strip()
            branch = subprocess.run(
                ["git", "branch", "--show-current"], cwd=root, check=True,
                text=True, capture_output=True,
            ).stdout.strip()
            digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
            release = root / "release.md"
            write(
                release,
                f"Release Decision: APPROVED\nIntegration Branch: {branch}\nIntegrated Commit: {commit}\n"
                f"Deployed Commit: {commit}\nArtifact Path: dist/artifact.bin\n"
                f"Artifact SHA256: {digest}\nTarget Environment: production\n"
                "Deployment Status: PASS\nSmoke Test: PASS\n"
                "Production Verification: PASS\nRollback Ready: YES\n"
                "Release Approval: APPROVED\n",
            )
            result = run_gate(
                root, "release", "--work-item", str(work),
                "--release-evidence", str(release),
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("RELEASE GATE: PASS", result.stdout)


if __name__ == "__main__":
    unittest.main()
