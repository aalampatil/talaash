import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/admin/admin.service";


export const runtime = "nodejs";

export const GET = apiRoute(async ({ clerkId }) => {
  return ok("All users fetched", await service.ServiceHandleGetAllUsers(clerkId));
});
