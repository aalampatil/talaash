import { apiRoute, ok, jsonBody } from "@/server/http/route";
import * as service from "@/server/modules/tenant/tenant.service";
import { tenantPreferencesUpdateSchema } from "@/server/validation/tenant.validation";

export const runtime = "nodejs";

export const PATCH = apiRoute(async ({ request, clerkId }) => {
  const body = await jsonBody(request);
  const data = tenantPreferencesUpdateSchema.parse({ preferences: body.preferences ?? body });
  const result = await service.ServiceHandleUpdateTenantPreferences({ clerkId, ...data });
  return ok(result.message);
});

export const PUT = PATCH;
