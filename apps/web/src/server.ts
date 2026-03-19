import { createClerkHandler } from "@clerk/tanstack-react-start/server";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { isServerClerkConfigured } from "@/lib/clerk-env";
import { createRouter } from "@/router";

const startHandler = createStartHandler({ createRouter });
const clerkOptions = {
  signInUrl: "/login",
};

export default async function handleStart({ request }: { request: Request }) {
  const handler = isServerClerkConfigured()
    ? await createClerkHandler(startHandler, clerkOptions)(defaultStreamHandler)
    : startHandler(defaultStreamHandler);

  return handler({ request });
}
