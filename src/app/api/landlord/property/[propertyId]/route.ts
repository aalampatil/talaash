import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/landlord/landlord.service";


export const runtime = "nodejs";

export const DELETE = apiRoute(async ({ params, clerkId }) => {
  const result = await service.ServiceHandleDeleteProperty({ clerkId, propertyId: params.propertyId });
  return ok(result.message);
});
