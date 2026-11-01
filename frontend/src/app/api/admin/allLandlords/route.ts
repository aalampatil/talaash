import { apiRoute, ok } from "@/server/http/route";
import * as service from "@/server/modules/admin/admin.service";


export const runtime = "nodejs";

export const GET = apiRoute(async ({ clerkId }) => {
  return ok("All landlords fetched", await service.ServiceHandleGetAllLandlords(clerkId));
});
