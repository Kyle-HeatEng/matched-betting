export interface HttpClientOptions {
  baseUrl: string;
  timeoutMs: number;
  headers?: HeadersInit;
  logger?: { debug(message: string, context?: Record<string, unknown>): void };
}

export class HttpError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function requestJson<T>(path: string, init: RequestInit, options: HttpClientOptions): Promise<T> {
  const url = new URL(path, options.baseUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);
  const hasBody = init.body !== undefined && init.body !== null;

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        accept: "application/json",
        ...(hasBody ? { "content-type": "application/json" } : {}),
        ...options.headers,
        ...init.headers
      },
      signal: controller.signal
    });

    const text = await response.text();
    options.logger?.debug("http.response", {
      url: url.toString(),
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      throw new HttpError(`Request failed with status ${response.status}`, response.status, text);
    }

    return (text ? JSON.parse(text) : {}) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function requestText(path: string, init: RequestInit, options: HttpClientOptions): Promise<string> {
  const url = new URL(path, options.baseUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...options.headers,
        ...init.headers
      },
      signal: controller.signal
    });
    const text = await response.text();
    if (!response.ok) {
      throw new HttpError(`Request failed with status ${response.status}`, response.status, text);
    }
    return text;
  } finally {
    clearTimeout(timeout);
  }
}
