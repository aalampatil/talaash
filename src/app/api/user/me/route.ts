import ApiError from "@/server/http/api-error";
import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/user/user.service";

export const runtime = "nodejs";

export const GET = apiRoute(async ({ clerkId }) => {
  const user = await service.syncUserFromClerkId(clerkId);
  if (!user) throw ApiError.notfound("User has no primary email in Clerk");
  return ok("User fetched successfully", user);
});
