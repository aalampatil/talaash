import { apiRoute, ok } from "@/server/http/route";
import * as service from "@/server/modules/tenant/tenant.service";


export const runtime = "nodejs";

export const POST = apiRoute(async ({ params, clerkId }) => {
  const result = await service.ServiceHandleAddToShortListed({ clerkId, propertyId: params.propertyId });
  return ok(result.message);
});
