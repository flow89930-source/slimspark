import {
  createDatabaseClient,
  createSiteContext,
  errorResponse,
  BackendError,
} from "./_qoder/backend.mjs";
import { application } from "./routes.mjs";

const handle = application({
  db: createDatabaseClient(),
  BackendError,
  env: {
    apiKey: Deno.env.get("ARK_API_KEY") ?? "",
    model: Deno.env.get("ARK_VISION_MODEL") ?? "",
  },
  fetchImpl: fetch,
});

Deno.serve(async (request) => {
  let context;
  try {
    context = createSiteContext(request);
    return await handle(context);
  } catch (error) {
    return errorResponse(error, context?.requestId);
  }
});
