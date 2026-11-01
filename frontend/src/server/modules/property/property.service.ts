import "server-only";

import ApiError from "@/server/http/api-error";
import { PropertyModel } from "./property.model";
import { Landlord } from "../landlord/landlord.model";

const ServiceHandleGetAllProperties = async () => {
  return PropertyModel.find({ status: "available" }).populate(
    "landlordId",
    "userId clerkId",
  );
};

const ServiceHandleGetProperty = async (propertyId: string) => {
  const property = await PropertyModel.findById(propertyId).populate(
    "landlordId",
  );
  if (!property) throw ApiError.notfound("Property not found");
  return property;
};

const ServiceHandleSearchProperties = async ({
  city,
  rent,
  propertyType,
}: {
  city?: string;
  rent?: string;
  propertyType?: string;
}) => {
  const filter: Record<string, unknown> = { status: "available" };

  if (city) filter["location.city"] = { $regex: city, $options: "i" };
  if (propertyType) filter.propertyType = propertyType;
  if (rent) filter.rent = { $lte: Number(rent) };

  return PropertyModel.find(filter);
};

const ServiceHandleTogglePropertyAvailability = async (propertyId: string, clerkId: string) => {
  const landlord = await Landlord.findOne({ clerkId });
  if (!landlord) throw ApiError.forbidden("Landlord access required");
  const property = await PropertyModel.findOne({ _id: propertyId, landlordId: landlord._id });
  if (!property) throw ApiError.notfound("Property not found");

  property.status = property.status === "available" ? "occupied" : "available";
  await property.save();

  return property;
};

export {
  ServiceHandleGetAllProperties,
  ServiceHandleGetProperty,
  ServiceHandleSearchProperties,
  ServiceHandleTogglePropertyAvailability,
};
