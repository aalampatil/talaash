import { Router } from "express";
import { upload } from "../../common/middlewares/multer.middleware.js";
import { LandlordController } from "./landlord.controller.js";

export const landlordRouter = Router();

const controller = new LandlordController();

landlordRouter.get("/profile", controller.handleGetLandlordProfile);
landlordRouter.get("/property", controller.handleGetMyProperties);
landlordRouter.get("/visits", controller.handleGetVisitRequests);
landlordRouter.post(
  "/property",
  upload.array("images"),
  controller.handleCreateProperty,
);
landlordRouter.patch("/visit/approve/:visitId", controller.handleApproveVisit);
landlordRouter.patch("/visit/reject/:visitId", controller.handleRejectVisit);
landlordRouter.delete("/property/:propertyId", controller.handleDeleteProperty);
