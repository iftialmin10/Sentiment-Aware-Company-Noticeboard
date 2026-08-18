import test from "node:test";
import assert from "node:assert/strict";

import {
  MAX_NOTICE_LENGTH,
  normalizeNoticeText,
} from "./noticeContract.js";

test("normalizes valid notice text", () => {
  assert.equal(normalizeNoticeText("  Team update  "), "Team update");
});

test("rejects non-string notice text", () => {
  assert.throws(() => normalizeNoticeText(null), /must be a string/i);
  assert.throws(() => normalizeNoticeText({}), /must be a string/i);
});

test("rejects empty and whitespace-only notice text", () => {
  assert.throws(() => normalizeNoticeText(""), /required/i);
  assert.throws(() => normalizeNoticeText("   "), /required/i);
});

test("accepts the maximum length and rejects longer text", () => {
  assert.equal(
    normalizeNoticeText("a".repeat(MAX_NOTICE_LENGTH)).length,
    MAX_NOTICE_LENGTH
  );
  assert.throws(
    () => normalizeNoticeText("a".repeat(MAX_NOTICE_LENGTH + 1)),
    /characters or fewer/i
  );
});
