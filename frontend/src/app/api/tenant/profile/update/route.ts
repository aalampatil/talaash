import { apiRoute, ok, jsonBody } from "@/server/http/route";
import * as service from "@/server/modules/tenant/tenant.service";
import { profileUpdateSchema } from "@/server/validation/requests";

export const runtime = "nodejs";

export const PATCH = apiRoute(async ({ request, clerkId }) => {
  const data = profileUpdateSchema.parse(await jsonBody(request));
  const profile = await service.ServiceHandleUpdateTenantProfile({ clerkId, ...data, phone: data.phone ?? data.mobile });
  return ok("Profile updated successfully", profile);
});
