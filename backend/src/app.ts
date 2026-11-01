import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import type { Response } from "express";
import { userRouter } from "./modules/user/user.routes.js";
import { tenantRouter } from "./modules/tenant/tenant.routes.js";
import { UserController } from "./modules/user/user.controller.js";
import { wrapAsync } from "./common/utils/wrap-async.js";
import { env } from "./env.js";
import { propertyRouter } from "./modules/property/property.routes.js";
import { landlordRouter } from "./modules/landlord/landlord.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";

export const createServerApplication = () => {
  const app = express();
  const userController = new UserController();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        env.CLIENT,
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );

  app.post(
    "/api/webhooks/clerk",
    express.raw({ type: "application/json" }),
    wrapAsync(userController.handleClerkWebhook.bind(userController)),
  );

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(clerkMiddleware());

  app.get("/", (_, res: Response) => {
    res.send("OK 200, check");
  });

  for (const prefix of ["/api", "/api/v1"]) {
    app.use(`${prefix}/user`, userRouter);
    app.use(`${prefix}/tenant`, tenantRouter);
    app.use(`${prefix}/property`, propertyRouter);
    app.use(`${prefix}/landlord`, landlordRouter);
    app.use(`${prefix}/admin`, adminRouter);
  }

  return app;
};
