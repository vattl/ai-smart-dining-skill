#!/usr/bin/env python3
"""Automated regression and functional tests for H5 LLM list beautification (WI-006)."""
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[3]


class TestH5ListBeautify(unittest.TestCase):
    def test_app_js_syntax(self):
        res = subprocess.run(["node", "--check", str(ROOT / "app.js")], capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(res.returncode, 0, f"app.js syntax error: {res.stderr}")

    def test_format_assistant_reply_logic(self):
        node_script = """
        const fs = require('fs');
        const code = fs.readFileSync('app.js', 'utf8');
        const match = code.match(/function formatAssistantReply\\([\\s\\S]*?\\n\\}/);
        if (!match) process.exit(1);
        eval('const escapeHtml = value => String(value ?? "").replace(/[&<>"\\']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", \\'"\\':"&quot;", "\\'":"&#39;" }[c]));\\n' + match[0]);

        // 1. Numbered list with price and tag
        const sample1 = "为您推荐：\\n1. 招牌牛肉串 (10串) - ¥35 [招牌]：黄牛肉现烤\\n2. 蜜汁鸡翅 (4串) - 24元 [免辣]：完全不辣";
        const res1 = formatAssistantReply(sample1);
        if (!res1.includes('ai-list-card') || !res1.includes('¥35') || !res1.includes('tag-mint') || !res1.includes('招牌牛肉串')) {
            console.error('Failed sample1:', res1);
            process.exit(2);
        }

        // 2. Plain text
        const sample2 = "你好，请问一共几个人用餐？";
        const res2 = formatAssistantReply(sample2);
        if (res2.includes('ai-list-card') || res2 !== '你好，请问一共几个人用餐？') {
            console.error('Failed sample2:', res2);
            process.exit(3);
        }

        // 3. XSS injection: ensure tags are safely escaped
        const sample3 = "<script>alert(1)</script>\\n1. 菜品 <img src=x onerror=alert(2)> ¥10";
        const res3 = formatAssistantReply(sample3);
        if (res3.includes('<script>') || res3.includes('<img') || !res3.includes('&lt;script&gt;') || !res3.includes('&lt;img')) {
            console.error('Failed sample3 XSS:', res3);
            process.exit(4);
        }

        process.exit(0);
        """
        res = subprocess.run(["node", "-e", node_script], cwd=str(ROOT), capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(res.returncode, 0, f"Parser unit tests failed: {res.stderr}")

    def test_styles_contains_list_classes(self):
        css = (ROOT / "styles.css").read_text(encoding="utf-8", errors="replace")
        self.assertIn(".ai-list-card", css)
        self.assertIn(".ai-list-item", css)
        self.assertIn(".ai-tag-pill", css)
        self.assertIn(".ai-list-price", css)


if __name__ == "__main__":
    unittest.main()
