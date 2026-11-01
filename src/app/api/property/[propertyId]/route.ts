import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/property/property.service";


export const runtime = "nodejs";

export const GET = apiRoute(async ({ params }) => {
  return ok("Property fetched successfully", await service.ServiceHandleGetProperty(params.propertyId));
}, { public: true });
