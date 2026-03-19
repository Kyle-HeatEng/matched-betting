import { requestJson } from "./http";
import type { HttpClientOptions } from "./http";

export interface ConvexCallInput {
  functionName: string;
  args: Record<string, unknown>;
}

export interface ConvexWorkerClient {
  query<T>(call: ConvexCallInput): Promise<T>;
  mutation<T>(call: ConvexCallInput): Promise<T>;
  action<T>(call: ConvexCallInput): Promise<T>;
}

function callPath(kind: "query" | "mutation" | "action", name: string): string {
  return `/api/${kind}/${name}`;
}

export function createConvexWorkerClient(options: HttpClientOptions & { adminKey?: string }): ConvexWorkerClient {
  const headers: HeadersInit = options.adminKey
    ? {
        authorization: `Bearer ${options.adminKey}`
      }
    : {};

  const baseOptions: HttpClientOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  return {
    query: async <T>(call: ConvexCallInput) =>
      requestJson<T>(
        callPath("query", call.functionName),
        { method: "POST", body: JSON.stringify(call.args) },
        baseOptions,
      ),
    mutation: async <T>(call: ConvexCallInput) =>
      requestJson<T>(
        callPath("mutation", call.functionName),
        { method: "POST", body: JSON.stringify(call.args) },
        baseOptions,
      ),
    action: async <T>(call: ConvexCallInput) =>
      requestJson<T>(
        callPath("action", call.functionName),
        { method: "POST", body: JSON.stringify(call.args) },
        baseOptions,
      )
  };
}
