import { describe, expect, test } from "bun:test";
import { decryptSecret, encryptSecret, redactToken } from "../security";

describe("security helpers", () => {
  test("encrypts and decrypts secrets", () => {
    const key = Buffer.from("0123456789abcdef0123456789abcdef").toString("base64");
    const payload = encryptSecret("super-secret-token", key);
    expect(decryptSecret(payload, key)).toBe("super-secret-token");
  });

  test("redacts tokens safely", () => {
    expect(redactToken("abcdefghijk")).toBe("abcd...hijk");
  });
});
