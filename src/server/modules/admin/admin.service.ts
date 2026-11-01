import "server-only";

import { env } from "@/server/config/env";
import ApiError from "@/server/http/api-error";
import { PropertyModel } from "../property/property.model";
import { User } from "../user/user.model";

const assertAdmin = async (clerkId: string) => {
  const user = await User.findOne({ clerkId });
  if (!user) throw ApiError.unauthorised();

  const isAdmin =
    user.role === "admin" ||
    user.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();

  if (!isAdmin) throw ApiError.forbidden("Admin access required");
};

const ServiceHandleGetAllProperties = async (clerkId: string) => {
  await assertAdmin(clerkId);
  return PropertyModel.find().populate("landlordId");
};

const ServiceHandleGetAllLandlords = async (clerkId: string) => {
  await assertAdmin(clerkId);
  return User.find({ role: "landlord" });
};

const ServiceHandleGetAllUsers = async (clerkId: string) => {
  await assertAdmin(clerkId);
  return User.find({ role: "tenant" });
};

export {
ServiceHandleGetAllLandlords,
ServiceHandleGetAllProperties,
ServiceHandleGetAllUsers
};
