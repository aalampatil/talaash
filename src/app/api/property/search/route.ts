import ApiError from "@/server/http/api-error";
import { apiRoute,ok } from "@/server/http/route";
import * as service from "@/server/modules/property/property.service";

export const runtime = "nodejs";

export const GET = apiRoute(async ({ request }) => {
  const query = new URL(request.url).searchParams;
  const search = { city: query.get("city") || undefined, rent: query.get("rent") || undefined, propertyType: query.get("propertyType") || undefined };
  if (search.rent && (!Number.isFinite(Number(search.rent)) || Number(search.rent) < 0)) throw ApiError.badRequest("Invalid rent");
  return ok("Search results", await service.ServiceHandleSearchProperties(search));
}, { public: true });
