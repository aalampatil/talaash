import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/landlord/landlord.service";


export const runtime = "nodejs";

export const PATCH = apiRoute(async ({ params, clerkId }) => {
  return ok("Visit approved", await service.ServiceHandleSetVisitStatus({ clerkId, visitId: params.visitId, status: "approved" }));
});
