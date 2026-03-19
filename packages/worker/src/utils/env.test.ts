import { describe, expect, test } from "bun:test";
import { loadWorkerEnv } from "../env";

describe("loadWorkerEnv", () => {
  test("applies safe defaults", () => {
    const env = loadWorkerEnv({
      NODE_ENV: "development",
      VIRGIN_BASE_URL: "https://example.com",
      SMARKETS_BASE_URL: "https://api.example.com"
    });

    expect(env.POLL_INTERVAL_MS).toBe(120_000);
    expect(env.LOG_LEVEL).toBe("info");
    expect(env.VIRGIN_BASE_URL).toBe("https://example.com/");
  });
});
