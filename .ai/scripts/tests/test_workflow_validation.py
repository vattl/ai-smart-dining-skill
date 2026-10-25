from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[3]


def run_python(root: Path, script: str, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, script, *args],
        cwd=root,
        text=True,
        capture_output=True,
        check=False,
    )


def refresh_manifest_entry(root: Path, relative_path: str) -> None:
    manifest_path = root / "MANIFEST.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    target = root / relative_path
    payload = target.read_bytes()
    entry = next(item for item in manifest["files"] if item["path"] == relative_path)
    entry["size"] = len(payload)
    entry["sha256"] = hashlib.sha256(payload).hexdigest()
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


class WorkflowValidationTests(unittest.TestCase):
    def test_policy_check_identifies_current_v43_workflow(self) -> None:
        result = run_python(ROOT, ".ai/scripts/validate.py")

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("AI Development OS v4.3 policy check", result.stdout)

    def test_runtime_state_drift_only_blocks_release_validation(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            copied_root = Path(temp_dir) / "package"
            shutil.copytree(ROOT, copied_root)
            registry = copied_root / ".ai-runtime" / "registry.json"
            registry.write_text('{"workstreams":{"WI-999":{}}}\n', encoding="utf-8")

            normal = run_python(copied_root, ".ai/scripts/validate.py")
            release = run_python(copied_root, ".ai/scripts/validate.py", "--release")

            self.assertEqual(normal.returncode, 0, normal.stdout + normal.stderr)
            self.assertNotEqual(release.returncode, 0, release.stdout + release.stderr)
            self.assertIn("hash mismatch", release.stdout.lower())
            self.assertIn(".ai-runtime/registry.json", release.stdout)

    def test_release_validation_requires_work_and_deployment_evidence(self) -> None:
        result = run_python(ROOT, ".ai/scripts/validate.py", "--release")

        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("--work-item", result.stdout)
        self.assertIn("package integrity alone", result.stdout)

    def test_package_validator_rejects_manifest_hash_drift(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            copied_root = Path(temp_dir) / "package"
            shutil.copytree(ROOT, copied_root)
            readme = copied_root / "README.md"
            readme.write_text(readme.read_text(encoding="utf-8") + "\ndrift\n", encoding="utf-8")

            result = run_python(
                copied_root, ".ai/scripts/validate_v43_package.py", str(copied_root)
            )

            self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("hash mismatch", result.stdout.lower())
            self.assertIn("README.md", result.stdout)

    def test_package_validator_rejects_missing_implementation_ready_semantics(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            copied_root = Path(temp_dir) / "package"
            shutil.copytree(ROOT, copied_root)
            workflow = copied_root / ".ai" / "commands" / "work.md"
            content = workflow.read_text(encoding="utf-8")
            workflow.write_text(
                content.replace("IMPLEMENTATION_READY — HARD GATE", "IMPLEMENTATION CHECK"),
                encoding="utf-8",
            )
            refresh_manifest_entry(copied_root, ".ai/commands/work.md")

            result = run_python(
                copied_root, ".ai/scripts/validate_v43_package.py", str(copied_root)
            )

            self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("IMPLEMENTATION_READY", result.stdout)
            self.assertIn(".ai/commands/work.md", result.stdout)

    def test_package_validator_rejects_unlisted_files(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            copied_root = Path(temp_dir) / "package"
            shutil.copytree(ROOT, copied_root)
            (copied_root / "unexpected.txt").write_text("unexpected", encoding="utf-8")

            result = run_python(
                copied_root, ".ai/scripts/validate_v43_package.py", str(copied_root)
            )

            self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("unlisted file", result.stdout.lower())
            self.assertIn("unexpected.txt", result.stdout)


if __name__ == "__main__":
    unittest.main()
