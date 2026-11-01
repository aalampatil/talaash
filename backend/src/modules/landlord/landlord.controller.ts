import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import ApiError from "../../common/utils/api-error.js";
import { ApiResponse } from "../../common/utils/api-response.js";
import { requireParam } from "../../common/utils/validate-params.js";
import { wrapAsync } from "../../common/utils/wrap-async.js";
import {
  ServiceHandleCreateProperty,
  ServiceHandleDeleteProperty,
  ServiceHandleGetLandlordProfile,
  ServiceHandleGetMyProperties,
  ServiceHandleGetVisitRequests,
  ServiceHandleSetVisitStatus,
} from "./landlord.service.js";

const requireClerkId = (req: Request) => {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) throw ApiError.unauthorised();
  return clerkId;
};

export class LandlordController {
  public handleGetLandlordProfile = wrapAsync(
    async (req: Request, res: Response) => {
      const response = await ServiceHandleGetLandlordProfile(
        requireClerkId(req),
      );
      return ApiResponse.ok(res, "Landlord profile fetched", response);
    },
  );

  public handleCreateProperty = wrapAsync(
    async (req: Request, res: Response) => {
      const files = Array.isArray(req.files) ? req.files : [];
      const response = await ServiceHandleCreateProperty({
        clerkId: requireClerkId(req),
        body: req.body,
        files,
      });

      return ApiResponse.created(
        res,
        "Property created successfully",
        response,
      );
    },
  );

  public handleDeleteProperty = wrapAsync(
    async (req: Request, res: Response) => {
      const propertyId = requireParam(req.params.propertyId, "propertyId");
      const response = await ServiceHandleDeleteProperty({
        clerkId: requireClerkId(req),
        propertyId,
      });

      return ApiResponse.ok(res, response.message, null);
    },
  );

  public handleGetMyProperties = wrapAsync(
    async (req: Request, res: Response) => {
      const response = await ServiceHandleGetMyProperties(requireClerkId(req));
      return ApiResponse.ok(res, "Properties fetched", response);
    },
  );

  public handleGetVisitRequests = wrapAsync(
    async (req: Request, res: Response) => {
      const response = await ServiceHandleGetVisitRequests(requireClerkId(req));
      return ApiResponse.ok(res, "Visit requests fetched", response);
    },
  );

  public handleApproveVisit = wrapAsync(async (req: Request, res: Response) => {
    const visitId = requireParam(req.params.visitId, "visitId");
    const response = await ServiceHandleSetVisitStatus({
      clerkId: requireClerkId(req),
      visitId,
      status: "approved",
    });

    return ApiResponse.ok(res, "Visit approved", response);
  });

  public handleRejectVisit = wrapAsync(async (req: Request, res: Response) => {
    const visitId = requireParam(req.params.visitId, "visitId");
    const response = await ServiceHandleSetVisitStatus({
      clerkId: requireClerkId(req),
      visitId,
      status: "rejected",
    });

    return ApiResponse.ok(res, "Visit rejected", response);
  });
}
