import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/tenant/tenant.service";


export const runtime = "nodejs";

export const GET = apiRoute(async ({ clerkId }) => {
  return ok("Recommended properties fetched successfully", await service.ServiceHandleGetRecommendedProperties(clerkId));
});
