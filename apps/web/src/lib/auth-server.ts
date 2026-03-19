import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";
import { ConvexHttpClient } from "convex/browser";
import type { FunctionReference, FunctionReturnType, OptionalRestArgs } from "convex/server";

function requireEnv(name: "VITE_CONVEX_URL") {
  const value = import.meta.env.VITE_CONVEX_URL;
  if (!value) {
    throw new Error(`${name} is not set.`);
  }
  return value;
}

export async function getServerClerkUserId() {
  const request = getWebRequest();
  const clerkAuth = await getAuth(request);
  return clerkAuth.userId ?? null;
}

async function getServerConvexClient() {
  return new ConvexHttpClient(requireEnv("VITE_CONVEX_URL"));
}

export async function fetchAuthQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgs<Query>
) {
  const client = await getServerConvexClient();
  const [queryArgs] = args as [Record<string, unknown>?];
  return client.query(query, (queryArgs ?? {}) as never) as Promise<FunctionReturnType<Query>>;
}

export async function fetchAuthMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
  ...args: OptionalRestArgs<Mutation>
) {
  const client = await getServerConvexClient();
  const [mutationArgs] = args as [Record<string, unknown>?];
  return client.mutation(mutation, (mutationArgs ?? {}) as never) as Promise<
    FunctionReturnType<Mutation>
  >;
}
