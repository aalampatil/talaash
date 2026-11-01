import { apiRoute, ok } from "@/server/http/route";
import * as service from "@/server/modules/landlord/landlord.service";
import { readPropertyUpload } from "@/server/storage/property-upload";

export const runtime = "nodejs";

export const GET = apiRoute(async ({ clerkId }) => {
  return ok("Properties fetched", await service.ServiceHandleGetMyProperties(clerkId));
});
export const POST = apiRoute(async ({ request, clerkId }) => {
  const upload = await readPropertyUpload(request);
  return ok("Property created successfully", await service.ServiceHandleCreateProperty({ clerkId, ...upload }), 201);
});
