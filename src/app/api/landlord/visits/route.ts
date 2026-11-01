import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/landlord/landlord.service";


export const runtime = "nodejs";

export const GET = apiRoute(async ({ clerkId }) => {
  return ok("Visit requests fetched", await service.ServiceHandleGetVisitRequests(clerkId));
});
