import { apiRoute,jsonBody,ok } from "@/server/http/route";
import * as service from "@/server/modules/tenant/tenant.service";
import { visitRequestSchema } from "@/server/validation/requests";

export const runtime = "nodejs";

export const POST = apiRoute(async ({ request, clerkId }) => {
  const data = visitRequestSchema.parse(await jsonBody(request));
  return ok("Visit requested successfully", await service.ServiceHandleRequestVisit({ clerkId, ...data }), 201);
});
