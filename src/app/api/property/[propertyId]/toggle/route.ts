import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/property/property.service";


export const runtime = "nodejs";

export const PATCH = apiRoute(async ({ params, clerkId }) => {
  const property = await service.ServiceHandleTogglePropertyAvailability(params.propertyId, clerkId);
  return ok(`Property marked as ${property.status}`, property);
});
