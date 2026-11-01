import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/tenant/tenant.service";


export const runtime = "nodejs";

export const GET = apiRoute(async ({ clerkId }) => {
  return ok("Visits fetched successfully", await service.ServiceHandleGetTenantVisits(clerkId));
});
