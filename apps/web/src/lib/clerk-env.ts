const PLACEHOLDER_VALUES = ["replace_me", "your-instance.clerk.accounts.dev"] as const;

function hasRealValue(value: string | undefined | null) {
  if (!value) {
    return false;
  }

  return !PLACEHOLDER_VALUES.some((placeholder) => value.includes(placeholder));
}

export function isValidClerkPublishableKey(value: string | undefined | null) {
  if (typeof value !== "string" || !hasRealValue(value)) {
    return false;
  }

  return /^(pk_test_|pk_live_)/.test(value);
}

export function isValidClerkSecretKey(value: string | undefined | null) {
  if (typeof value !== "string" || !hasRealValue(value)) {
    return false;
  }

  return /^(sk_test_|sk_live_)/.test(value);
}

export function isValidClerkIssuerDomain(value: string | undefined | null) {
  if (typeof value !== "string" || !hasRealValue(value)) {
    return false;
  }

  return /^https:\/\/.+/.test(value);
}

export function getClientClerkPublishableKey() {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return isValidClerkPublishableKey(key) ? key : null;
}

export function getServerClerkPublishableKey() {
  const key = process.env.CLERK_PUBLISHABLE_KEY ?? process.env.VITE_CLERK_PUBLISHABLE_KEY;

  return isValidClerkPublishableKey(key) ? key : null;
}

export function isServerClerkConfigured() {
  return (
    Boolean(getServerClerkPublishableKey()) &&
    isValidClerkSecretKey(process.env.CLERK_SECRET_KEY) &&
    isValidClerkIssuerDomain(process.env.CLERK_JWT_ISSUER_DOMAIN)
  );
}
