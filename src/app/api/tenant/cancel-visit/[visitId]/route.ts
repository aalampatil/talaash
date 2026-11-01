import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/tenant/tenant.service";


export const runtime = "nodejs";

export const POST = apiRoute(async ({ params, clerkId }) => {
  const result = await service.ServiceHandleCancelVisit({ clerkId, visitId: params.visitId });
  return ok(result.message, { visitId: result.visitId });
});

export const DELETE = POST;
