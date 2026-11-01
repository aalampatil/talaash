import { apiRoute, ok } from "@/server/http/route";
import * as service from "@/server/modules/property/property.service";


export const runtime = "nodejs";

export const GET = apiRoute(async () => {
  return ok("Properties fetched successfully", await service.ServiceHandleGetAllProperties());
}, { public: true });
