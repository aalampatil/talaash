import "server-only";

import mongoose,{ Schema,type InferSchemaType } from "mongoose";

const propertySchema = new Schema(
  {
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "Landlord",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    rent: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      State: { type: String, required: true },
      address: { type: String, required: true },
    },

    propertyType: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK", "room"],
      required: true,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    amenities: [String],

    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

export type PropertyDocument = InferSchemaType<typeof propertySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PropertyModel =
  (mongoose.models.Property as mongoose.Model<PropertyDocument>) ||
  mongoose.model<PropertyDocument>("Property", propertySchema);
