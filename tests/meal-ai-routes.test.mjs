import assert from "node:assert/strict";
import test from "node:test";
import { application } from "../functions/routes.mjs";

class BackendError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

class Query {
  constructor(db, table, operation = "select") {
    this.db = db;
    this.table = table;
    this.operation = operation;
    this.filters = [];
    this.columns = "*";
    this.limitCount = null;
    this.payload = null;
    this.options = null;
  }

  select(columns) {
    this.columns = columns;
    return this;
  }

  eq(column, value) {
    this.filters.push([column, value]);
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  insertIfAbsent(payload, options) {
    this.operation = "insertIfAbsent";
    this.payload = payload;
    this.options = options;
    return this;
  }

  update(payload) {
    this.operation = "update";
    this.payload = payload;
    return this;
  }

  project(row) {
    if (this.columns === "*") {
      return { ...row };
    }

    return Object.fromEntries(
      this.columns.split(",").map((column) => [
        column.trim(),
        row[column.trim()],
      ]),
    );
  }

  matches(row) {
    return this.filters.every(([column, value]) => row[column] === value);
  }

  execute() {
    const table = (this.db.tables[this.table] ??= []);

    if (this.operation === "select") {
      let matches = table.filter((row) => this.matches(row));
      if (this.limitCount !== null) {
        matches = matches.slice(0, this.limitCount);
      }
      return { data: matches.map((row) => this.project(row)) };
    }

    if (this.operation === "insertIfAbsent") {
      const conflictColumns = (this.options?.onConflict ?? "")
        .split(",")
        .map((column) => column.trim())
        .filter(Boolean);
      const exists = table.some((row) =>
        conflictColumns.every(
          (column) => row[column] === this.payload[column],
        ),
      );

      if (exists) {
        return { data: [] };
      }

      const row = { id: crypto.randomUUID(), ...this.payload };
      table.push(row);
      return { data: [this.project(row)] };
    }

    if (this.operation === "update") {
      const matches = table.filter((row) => this.matches(row));
      matches.forEach((row) => Object.assign(row, this.payload));
      return { data: matches.map((row) => this.project(row)) };
    }

    throw new Error(`Unsupported operation: ${this.operation}`);
  }

  then(resolve, reject) {
    try {
      resolve(this.execute());
    } catch (error) {
      reject(error);
    }
  }
}

class FakeDatabase {
  constructor() {
    this.tables = {};
  }

  from(table) {
    return new Query(this, table);
  }
}

const VALID_IMAGE = "data:image/jpeg;base64,/9j/";
const BASE_TIME = Date.parse("2026-11-18T04:00:00.000Z");

function createHarness(options = {}) {
  const db = new FakeDatabase();
  let upstreamCalls = 0;
  let clock = options.clock ?? BASE_TIME;
  const upstreamContent =
    options.upstreamContent ?? '{"dish":"番茄炒蛋","confidence":0.93}';
  const upstreamStatus = options.upstreamStatus ?? 200;
  const modelsAvailable = options.modelsAvailable ?? ["test-model"];
  const handle = application({
    db,
    BackendError,
    env: {
      apiKey: options.apiKey ?? "test-key",
      model: "test-model",
    },
    fetchImpl: async (_url, init) => {
      upstreamCalls += 1;
      const body = JSON.parse(init.body);
      if (upstreamStatus !== 200) {
        return new Response("upstream error", { status: upstreamStatus });
      }
      if (!modelsAvailable.includes(body.model)) {
        return new Response(
          JSON.stringify({ error: { code: "ModelNotOpen" } }),
          { status: 404, headers: { "content-type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: upstreamContent } }],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    },
    now: () => clock,
  });

  return {
    db,
    handle,
    get upstreamCalls() {
      return upstreamCalls;
    },
    get clock() {
      return clock;
    },
    setClock(value) {
      clock = value;
    },
    advance(ms) {
      clock += ms;
    },
  };
}

const DEFAULT_VISITOR_ID = "11111111-1111-4111-8111-111111111111";

async function invoke(
  harness,
  {
    visitorId = DEFAULT_VISITOR_ID,
    ip = "203.0.113.10",
    image = VALID_IMAGE,
  } = {},
) {
  const headers = {
    "content-type": "application/json",
    "x-real-ip": ip,
  };

  if (visitorId) {
    headers["x-visitor-id"] = visitorId;
  }

  const request = new Request(
    "https://example.qoder.zone/functions/v1/app/api/meal-photo/recognize",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ image }),
    },
  );
  const response = await harness.handle({ request });
  return { response, payload: await response.json() };
}

test("allows ten daily attempts, serves the short cache, then blocks quota", async () => {
  const harness = createHarness();

  for (let index = 0; index < 10; index += 1) {
    harness.advance(2000);
    const { response, payload } = await invoke(harness);
    assert.equal(response.status, 200);
    assert.equal(payload.ok, true);
    assert.equal(payload.dish, "番茄炒蛋");
    assert.equal(payload.cached, index > 0);
  }

  assert.equal(harness.upstreamCalls, 1);
  harness.advance(2000);
  const { response, payload } = await invoke(harness);
  assert.equal(response.status, 429);
  assert.equal(payload.code, "quota_exhausted");
  assert.equal(payload.message, "今日识别次数已用完，请手动输入");
});

test("blocks five requests inside one second for three hours", async () => {
  const harness = createHarness();

  for (let index = 0; index < 4; index += 1) {
    const { response } = await invoke(harness);
    assert.equal(response.status, 200);
  }

  const fifth = await invoke(harness);
  assert.equal(fifth.response.status, 429);
  assert.equal(fifth.payload.code, "abuse_blocked");

  harness.advance(1000);
  const stillBlocked = await invoke(harness);
  assert.equal(stillBlocked.response.status, 429);
  assert.equal(stillBlocked.payload.code, "abuse_blocked");

  harness.advance(3 * 60 * 60 * 1000);
  const afterBlock = await invoke(harness);
  assert.equal(afterBlock.response.status, 200);
});

test("keeps the abuse block across Beijing midnight", async () => {
  const harness = createHarness({
    clock: Date.parse("2026-11-18T15:59:59.000Z"),
  });

  for (let index = 0; index < 4; index += 1) {
    const { response } = await invoke(harness);
    assert.equal(response.status, 200);
  }

  const fifth = await invoke(harness);
  assert.equal(fifth.response.status, 429);
  assert.equal(fifth.payload.code, "abuse_blocked");

  harness.advance(2000);
  const afterMidnight = await invoke(harness);
  assert.equal(afterMidnight.response.status, 429);
  assert.equal(afterMidnight.payload.code, "abuse_blocked");

  harness.advance(3 * 60 * 60 * 1000);
  const afterBlock = await invoke(harness);
  assert.equal(afterBlock.response.status, 200);
});

test("does not cache low-confidence recognition", async () => {
  const harness = createHarness({
    upstreamContent: '{"dish":"土豆丝","confidence":0.5}',
  });

  harness.advance(2000);
  const first = await invoke(harness);
  assert.equal(first.response.status, 200);
  assert.equal(first.payload.confidence, 0.5);
  assert.equal(first.payload.cached, false);

  harness.advance(2000);
  const second = await invoke(harness);
  assert.equal(second.response.status, 200);
  assert.equal(second.payload.cached, false);
  assert.equal(harness.upstreamCalls, 2);
});

test("rejects invalid images without consuming quota", async () => {
  const harness = createHarness();
  const { response, payload } = await invoke(harness, {
    image: "data:image/jpeg;base64,AAAA",
  });

  assert.equal(response.status, 400);
  assert.equal(payload.code, "invalid_input");
  assert.equal(harness.upstreamCalls, 0);
});

test("returns 503 until ARK_API_KEY is configured", async () => {
  const harness = createHarness({ apiKey: "" });
  const { response, payload } = await invoke(harness);

  assert.equal(response.status, 503);
  assert.equal(payload.code, "service_not_configured");
  assert.equal(harness.upstreamCalls, 0);
});

test("maps upstream failure to a fallback-safe 502", async () => {
  const harness = createHarness({ upstreamStatus: 500 });
  const { response, payload } = await invoke(harness);

  assert.equal(response.status, 502);
  assert.equal(payload.code, "recognition_unavailable");
  assert.equal(payload.remaining, 9);
});

test("falls back to another activated vision model", async () => {
  const harness = createHarness({
    modelsAvailable: ["doubao-seed-2-1-lite-260915"],
  });

  harness.advance(2000);
  const { response, payload } = await invoke(harness);
  assert.equal(response.status, 200);
  assert.equal(payload.dish, "番茄炒蛋");
  assert.equal(harness.upstreamCalls, 2);
});

test("reports missing configuration when no vision model is activated", async () => {
  const harness = createHarness({ modelsAvailable: [] });

  harness.advance(2000);
  const { response, payload } = await invoke(harness);
  assert.equal(response.status, 503);
  assert.equal(payload.code, "service_not_configured");
  assert.equal(harness.upstreamCalls, 4);
});

test("rejects requests without a valid visitor id before quota or upstream work", async () => {
  const harness = createHarness();

  const invalid = await invoke(harness, { visitorId: "not-a-uuid" });
  assert.equal(invalid.response.status, 400);
  assert.equal(invalid.payload.code, "invalid_visitor");

  const missing = await invoke(harness, { visitorId: null });
  assert.equal(missing.response.status, 400);
  assert.equal(missing.payload.code, "invalid_visitor");
  assert.equal(harness.upstreamCalls, 0);
});

test("limits one IP to thirty daily attempts across visitors", async () => {
  const harness = createHarness();
  const ip = "198.51.100.7";

  for (let index = 0; index < 30; index += 1) {
    harness.advance(2000);
    const { response } = await invoke(harness, {
      visitorId: crypto.randomUUID(),
      ip,
    });
    assert.equal(response.status, 200);
  }

  harness.advance(2000);
  const { response, payload } = await invoke(harness, {
    visitorId: crypto.randomUUID(),
    ip,
  });
  assert.equal(response.status, 429);
  assert.equal(payload.code, "quota_exhausted");
});
