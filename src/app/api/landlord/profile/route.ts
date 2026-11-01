import { apiRoute, ok } from "@/server/http/route";
import * as service from "@/server/modules/landlord/landlord.service";


export const runtime = "nodejs";

export const GET = apiRoute(async ({ clerkId }) => {
  return ok("Landlord profile fetched", await service.ServiceHandleGetLandlordProfile(clerkId));
});
