import "server-only";

import ApiError from "@/server/http/api-error";
import { PropertyModel } from "../property/property.model";
import { Tenant, type TenantDocument } from "./tenant.model";
import { Visit } from "../visit/visit.model";
import { User } from "../user/user.model";

// ── Shared helper ─────────────────────────────────────────────────────────────

const getVerifiedTenant = async (clerkId: string) => {
  const tenant = await Tenant.findOne({ clerkId });
  if (!tenant) throw ApiError.notfound("Tenant not found");
  return tenant;
};

// ── Profile ───────────────────────────────────────────────────────────────────

const ServiceHandleGetTenantProfile = async (clerkId: string) => {
  const tenant = await Tenant.findOne({ clerkId })
    .populate("userId")
    .populate("savedProperties")
    .populate("shortListedProperties");
  if (!tenant) throw ApiError.notfound("Tenant not found");

  return {
    id: tenant._id,
    profile: tenant.userId,
    preferences: tenant.preferences,
    savedProperties: tenant.savedProperties,
    shortListedProperties: tenant.shortListedProperties,
  };
};

// ── Preferences ───────────────────────────────────────────────────────────────

const ServiceHandleUpdateTenantPreferences = async (
  data: { clerkId: string; preferences?: Partial<NonNullable<TenantDocument["preferences"]>> },
) => {
  const { clerkId, preferences } = data;
  if (!clerkId) throw ApiError.badRequest("clerkId is required");

  const tenant = await getVerifiedTenant(clerkId);

  if (preferences) {
    tenant.set("preferences", {
      ...(tenant.preferences || {}),
      ...preferences,
    });
  }

  await tenant.save({ validateBeforeSave: false });
  return { message: "preference updated" };
};

const ServiceHandleUpdateTenantProfile = async ({
  clerkId,
  name,
  email,
  phone,
}: {
  clerkId: string;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  const update: Record<string, string> = {};
  if (name) update.name = name;
  if (email) update.email = email;
  if (phone) update.phone = phone;

  const user = await User.findOneAndUpdate(
    { clerkId },
    { $set: update },
    { new: true },
  );

  if (!user) throw ApiError.notfound("User not found");
  return user;
};

// ── Saved Properties ──────────────────────────────────────────────────────────

const ServiceHandleSaveProperty = async ({
  clerkId,
  propertyId,
}: {
  clerkId: string;
  propertyId: string;
}) => {
  const result = await Tenant.updateOne(
    { clerkId },
    { $addToSet: { savedProperties: propertyId } },
  );

  if (result.matchedCount === 0) throw ApiError.notfound("User not found");

  return { message: "property saved" };
};

const ServiceHandleRemoveSavedProperty = async ({
  clerkId,
  propertyId,
}: {
  clerkId: string;
  propertyId: string;
}) => {
  const result = await Tenant.updateOne(
    { clerkId },
    { $pull: { savedProperties: propertyId } },
  );

  if (result.matchedCount === 0) throw ApiError.notfound("User not found");
  if (result.modifiedCount === 0)
    throw ApiError.notfound("Property not found in saved list");

  return { message: "property removed from saved" };
};

// ── Shortlisted Properties ────────────────────────────────────────────────────

const ServiceHandleAddToShortListed = async ({
  clerkId,
  propertyId,
}: {
  clerkId: string;
  propertyId: string;
}) => {
  const result = await Tenant.updateOne(
    { clerkId },
    { $addToSet: { shortListedProperties: propertyId } },
  );

  if (result.matchedCount === 0) throw ApiError.notfound("User not found");

  return { message: "property added to shortlisted" };
};

const ServiceHandleRemoveFromShortListed = async ({
  clerkId,
  propertyId,
}: {
  clerkId: string;
  propertyId: string;
}) => {
  const result = await Tenant.updateOne(
    { clerkId },
    { $pull: { shortListedProperties: propertyId } },
  );

  if (result.matchedCount === 0) throw ApiError.notfound("User not found");
  if (result.modifiedCount === 0)
    throw ApiError.notfound("Property not in shortlisted");

  return { message: "property removed from shortlisted" };
};

// ── Stubs ─────────────────────────────────────────────────────────────────────

// services/visit.service.ts

const ServiceHandleRequestVisit = async ({
  clerkId,
  propertyId,
  visitDate,
  message,
}: {
  clerkId: string;
  propertyId: string;
  landlordId?: string;
  visitDate: Date | string;
  message?: string;
}) => {
  const tenant = await Tenant.findOne({ clerkId });
  if (!tenant) throw ApiError.notfound("Tenant profile not found");

  const property = await PropertyModel.findById(propertyId);
  if (!property) throw ApiError.notfound("Property not found");

  const parsedDate = new Date(visitDate);
  if (Number.isNaN(parsedDate.getTime())) {
    throw ApiError.badRequest("Invalid visit date");
  }

  if (parsedDate <= new Date()) {
    throw ApiError.badRequest("Visit date must be in the future");
  }

  const existingVisit = await Visit.findOne({
    tenantId: tenant._id,
    propertyId,
    visitDate: parsedDate,
  });

  if (existingVisit) {
    throw ApiError.conflict(
      "You already have a visit booked for this property at this time",
    );
  }

  const visit = await Visit.create({
    tenantId: tenant._id,
    propertyId,
    landlordId: property.landlordId,
    visitDate: parsedDate,
    message: message ?? "",
    status: "pending",
  });

  return visit;
};

const ServiceHandleCancelVisit = async ({
  clerkId,
  visitId,
}: {
  clerkId: string;
  visitId: string;
}) => {
  const tenant = await Tenant.findOne({ clerkId });
  if (!tenant) throw ApiError.notfound("Tenant profile not found");

  const visit = await Visit.findById(visitId);

  if (!visit) {
    throw ApiError.notfound("Visit not found");
  }

  if (visit.tenantId.toString() !== tenant._id.toString()) {
    throw ApiError.forbidden("You are not authorized to cancel this visit");
  }

  // Only pending or approved visits can be cancelled
  if (visit.status === "completed") {
    throw ApiError.badRequest("Cannot cancel a visit that has been completed");
  }

  if (visit.status === "rejected") {
    throw ApiError.badRequest("Visit has already been rejected");
  }

  await Visit.findByIdAndDelete(visitId);

  return { message: "Visit cancelled successfully", visitId };
};

const ServiceHandleGetTenantVisits = async (clerkId: string) => {
  const tenant = await Tenant.findOne({ clerkId });
  if (!tenant) throw ApiError.notfound("Tenant profile not found");

  return Visit.find({ tenantId: tenant._id })
    .populate("propertyId")
    .populate("landlordId")
    .sort({ visitDate: 1 });
};

const ServiceHandleGetRecommendedProperties = async (clerkId: string) => {
  const tenant = await Tenant.findOne({ clerkId });
  if (!tenant) throw ApiError.notfound("Tenant profile not found");

  return PropertyModel.find({
    status: "available",
    "location.city": {
      $regex: tenant.preferences?.city ?? tenant.preferences?.location ?? "",
      $options: "i",
    },
    rent: { $lte: tenant.preferences?.maxBudget ?? 100000 },
  }).limit(5);
};

export {
  ServiceHandleGetTenantProfile,
  ServiceHandleUpdateTenantProfile,
  ServiceHandleUpdateTenantPreferences,
  ServiceHandleSaveProperty,
  ServiceHandleRemoveSavedProperty,
  ServiceHandleAddToShortListed,
  ServiceHandleRemoveFromShortListed,
  ServiceHandleRequestVisit,
  ServiceHandleCancelVisit,
  ServiceHandleGetTenantVisits,
  ServiceHandleGetRecommendedProperties,
};
