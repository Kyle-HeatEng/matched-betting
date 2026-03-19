import { createHash, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function deriveKey(secret: string): Buffer {
  const raw = Buffer.from(secret, "base64");
  if (raw.length === 32) {
    return raw;
  }

  if (secret.length >= 32) {
    return createHash("sha256").update(secret).digest();
  }

  throw new Error("SECRET_ENCRYPTION_KEY must resolve to at least 32 bytes");
}

export function encryptSecret(secret: string, encryptionKey: string): string {
  if (!secret) {
    throw new Error("secret is required");
  }

  const key = deriveKey(encryptionKey);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    tag.toString("base64"),
    ciphertext.toString("base64")
  ].join(".");
}

export function decryptSecret(payload: string, encryptionKey: string): string {
  const parts = payload.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid secret payload");
  }

  const [ivRaw, tagRaw, ciphertextRaw] = parts;
  const key = deriveKey(encryptionKey);
  const iv = Buffer.from(ivRaw, "base64");
  const tag = Buffer.from(tagRaw, "base64");
  const ciphertext = Buffer.from(ciphertextRaw, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function redactToken(token: string | undefined): string {
  if (!token) {
    return "";
  }

  if (token.length <= 8) {
    return "***";
  }

  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}
