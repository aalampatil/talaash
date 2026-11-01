import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/user/user.service";


export const runtime = "nodejs";

export const POST = apiRoute(async ({ clerkId }) => {
  return ok("Landlord account activated", await service.becomeLandlord(clerkId));
});
