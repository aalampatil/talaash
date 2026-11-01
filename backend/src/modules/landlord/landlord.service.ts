import ApiError from "../../common/utils/api-error.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../common/utils/cloudinary.js";
import { PropertyModel } from "../property/property.model.js";
import { Visit } from "../visit/visit.model.js";
import { Landlord } from "./landlord.model.js";

type UploadedFile = {
  path: string;
};

type PopulatedProperty = {
  title?: string;
};

type PopulatedTenant = {
  userId?: {
    name?: string;
    email?: string;
  };
};

const asString = (value: unknown, fallback = "") => {
  return typeof value === "string" ? value : fallback;
};

const parseAmenities = (value: unknown) => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value ? [value] : [];
  }
};

const getVerifiedLandlord = async (clerkId: string) => {
  const landlord = await Landlord.findOne({ clerkId });
  if (!landlord) throw ApiError.notfound("Landlord not found");
  return landlord;
};

const ServiceHandleGetLandlordProfile = async (clerkId: string) => {
  return getVerifiedLandlord(clerkId);
};

const ServiceHandleCreateProperty = async ({
  clerkId,
  body,
  files,
}: {
  clerkId: string;
  body: Record<string, unknown>;
  files: UploadedFile[];
}) => {
  const landlord = await getVerifiedLandlord(clerkId);
  const uploadedImages = [];

  for (const file of files) {
    const result = await uploadOnCloudinary(file.path);
    if (result) {
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
  }

  const property = new PropertyModel({
    landlordId: landlord._id,
    title: asString(body.title),
    description: asString(body.description),
    rent: Number(body.rent ?? 0),
    location: {
      city: asString(body.city),
      area: asString(body.area),
      address: asString(body.address),
      State: asString(body.State, asString(body.state, asString(body.city))),
    },
    propertyType: asString(body.propertyType, "1BHK"),
    status: asString(body.status, "available"),
    amenities: parseAmenities(body.amenities),
    images: uploadedImages,
  });
  await property.save();

  await Landlord.updateOne(
    { _id: landlord._id },
    { $addToSet: { properties: property._id } },
  );

  return property;
};

const ServiceHandleDeleteProperty = async ({
  clerkId,
  propertyId,
}: {
  clerkId: string;
  propertyId: string;
}) => {
  const landlord = await getVerifiedLandlord(clerkId);
  const property = await PropertyModel.findOne({
    _id: propertyId,
    landlordId: landlord._id,
  });

  if (!property) throw ApiError.notfound("Property not found");

  await Promise.all(
    (property.images ?? []).map((image) =>
      image.publicId ? deleteFromCloudinary(image.publicId) : null,
    ),
  );

  await PropertyModel.findByIdAndDelete(propertyId);
  await Landlord.updateOne(
    { _id: landlord._id },
    { $pull: { properties: propertyId } },
  );

  return { message: "Property deleted successfully" };
};

const ServiceHandleGetMyProperties = async (clerkId: string) => {
  const landlord = await Landlord.findOne({ clerkId }).populate("properties");
  if (!landlord) throw ApiError.notfound("Landlord not found");
  return landlord.properties;
};

const ServiceHandleGetVisitRequests = async (clerkId: string) => {
  const landlord = await getVerifiedLandlord(clerkId);
  const visits = await Visit.find({ landlordId: landlord._id })
    .populate("propertyId")
    .populate({
      path: "tenantId",
      populate: { path: "userId", select: "name email" },
    })
    .sort({ visitDate: 1 });

  return visits.map((visit) => {
    const property = visit.propertyId as unknown as PopulatedProperty;
    const tenant = visit.tenantId as unknown as PopulatedTenant;
    const user = tenant?.userId;

    return {
      ...visit.toObject(),
      propertyTitle: property?.title,
      tenantName: user?.name,
      tenantEmail: user?.email,
      date: visit.visitDate.toISOString().slice(0, 10),
      time: visit.visitDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });
};

const ServiceHandleSetVisitStatus = async ({
  clerkId,
  visitId,
  status,
}: {
  clerkId: string;
  visitId: string;
  status: "approved" | "rejected";
}) => {
  const landlord = await getVerifiedLandlord(clerkId);
  const visit = await Visit.findOne({ _id: visitId, landlordId: landlord._id });

  if (!visit) throw ApiError.notfound("Visit request not found");

  visit.status = status;
  await visit.save();

  return visit;
};

export {
  ServiceHandleCreateProperty,
  ServiceHandleDeleteProperty,
  ServiceHandleGetLandlordProfile,
  ServiceHandleGetMyProperties,
  ServiceHandleGetVisitRequests,
  ServiceHandleSetVisitStatus,
};
