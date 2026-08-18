import test from "node:test";
import assert from "node:assert/strict";

import { classificationWithDefaults } from "./classificationContract.js";

test("preserves supported UI classification values", () => {
  assert.deepEqual(
    classificationWithDefaults({ mood: "good", urgency: "urgent" }),
    { mood: "good", urgency: "urgent" }
  );
});

test("uses neutral UI defaults for missing classification values", () => {
  assert.deepEqual(classificationWithDefaults(null), {
    mood: "normal",
    urgency: "no rush",
  });
});

test("defaults unexpected fields independently", () => {
  assert.deepEqual(
    classificationWithDefaults({ mood: "unknown", urgency: "emergency" }),
    { mood: "normal", urgency: "emergency" }
  );
  assert.deepEqual(
    classificationWithDefaults({ mood: "bad", urgency: "later" }),
    { mood: "bad", urgency: "no rush" }
  );
});
