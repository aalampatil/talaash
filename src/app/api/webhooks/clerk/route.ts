import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { apiRoute, ok } from "@/server/http/route";
import { connectDB } from "@/server/db/connect";
import { env } from "@/server/config/env";
import ApiError from "@/server/http/api-error";
import { handleClerkWebhookEvent } from "@/server/modules/user/user.service";

export const runtime = "nodejs";

export const POST = apiRoute(async ({ request }) => {
  // Verify the original request body before any database operation.
  const signingSecret = env.CLERK_WEBHOOK_SIGNING_SECRET;
  let event;
  try { event = await verifyWebhook(request, { signingSecret }); }
  catch { throw ApiError.badRequest("Invalid Clerk webhook"); }
  await connectDB();
  await handleClerkWebhookEvent(event);
  return ok("Webhook received");
}, { public: true, database: false });
