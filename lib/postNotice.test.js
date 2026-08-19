import test from "node:test";
import assert from "node:assert/strict";

import { createPostNotice } from "./postNotice.js";
import { MAX_NOTICE_LENGTH } from "./noticeContract.js";

const quietLogger = { warn() {}, error() {} };

function form(text) {
  const data = new FormData();
  data.set("text", text);
  return data;
}

function setup(classify = async () => ({ mood: "good", urgency: "urgent" })) {
  const calls = { queries: [], paths: [] };
  const action = createPostNotice({
    classify,
    query: async (...args) => calls.queries.push(args),
    revalidate: (path) => calls.paths.push(path),
    logger: quietLogger,
  });
  return { action, calls };
}

test("stores normalized text with a successful mixed classification", async () => {
  const { action, calls } = setup();
  assert.deepEqual(await action(null, form("  Great work—reply today  ")), {
    status: "success",
    message: "",
  });
  assert.deepEqual(calls.queries[0][1], ["Great work—reply today", "good", "urgent"]);
  assert.deepEqual(calls.paths, ["/"]);
});

test("stores fallback values for invalid or unavailable classification", async () => {
  for (const classify of [
    async () => ({ mood: "unsupported", urgency: "urgent" }),
    async () => {
      throw new Error("service unavailable");
    },
  ]) {
    const { action, calls } = setup(classify);
    assert.equal((await action(null, form("Routine update"))).status, "success");
    assert.deepEqual(calls.queries[0][1], ["Routine update", "normal", "no rush"]);
  }
});

test("rejects empty, whitespace-only, and oversized notices before side effects", async () => {
  for (const text of ["", "   ", "x".repeat(MAX_NOTICE_LENGTH + 1)]) {
    const { action, calls } = setup();
    const result = await action(null, form(text));
    assert.equal(result.status, "error");
    assert.equal(calls.queries.length, 0);
    assert.equal(calls.paths.length, 0);
  }
});

test("reports database failure and does not revalidate", async () => {
  const errors = [];
  const action = createPostNotice({
    classify: async () => ({ mood: "bad", urgency: "emergency" }),
    query: async () => {
      throw new Error("database detail must not reach the user");
    },
    revalidate: () => assert.fail("must not revalidate a failed insert"),
    logger: { warn() {}, error: (...args) => errors.push(args) },
  });
  const result = await action(null, form("Evacuate now"));
  assert.equal(result.status, "error");
  assert.match(result.message, /couldn't post/i);
  assert.doesNotMatch(result.message, /database detail/i);
  assert.equal(errors.length, 1);
});
