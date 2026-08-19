import test from "node:test";
import assert from "node:assert/strict";

import {
  MOOD_PRESENTATIONS,
  URGENCY_PRESENTATIONS,
  noticePresentation,
} from "./noticePresentation.js";

test("defines distinct, explicit labels and colors for all three moods", () => {
  assert.deepEqual(Object.keys(MOOD_PRESENTATIONS), ["bad", "normal", "good"]);
  assert.deepEqual(
    Object.values(MOOD_PRESENTATIONS).map(({ label }) => label),
    ["bad", "normal", "good"]
  );
  assert.equal(new Set(Object.values(MOOD_PRESENTATIONS).map((value) => value.borderColor)).size, 3);
});

test("defines still, one-second, and half-second urgency behavior", () => {
  assert.equal(URGENCY_PRESENTATIONS["no rush"].animationDuration, null);
  assert.equal(URGENCY_PRESENTATIONS.urgent.animationDuration, "1s");
  assert.equal(URGENCY_PRESENTATIONS.emergency.animationDuration, "0.5s");
  for (const value of Object.values(URGENCY_PRESENTATIONS)) assert.ok(value.label);
});

test("uses normal and no-rush presentation for unknown values", () => {
  const result = noticePresentation({ mood: "mystery", urgency: "later" });
  assert.equal(result.mood, MOOD_PRESENTATIONS.normal);
  assert.equal(result.urgency, URGENCY_PRESENTATIONS["no rush"]);
});
