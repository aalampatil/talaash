import "server-only";

import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { required } from "zod/mini";

const tenantSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one tenant per user
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    preferences: {
      householdType: {
        type: String,
        enum: ["family", "single", "room"],
        default: "single",
      },
      propertyType: {
        type: String,
        enum: ["1BHK", "2BHK", "3BHK"],
        default: "1BHK",
      },
      location: { type: String, default: "mars" },
      city: { type: String, default: "mars" },
      minBudget: { type: Number, default: 1000 },
      maxBudget: { type: Number, default: 100000 },
    },
    savedProperties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    shortListedProperties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  { timestamps: true },
);

export type TenantDocument = InferSchemaType<typeof tenantSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Tenant =
  (mongoose.models.Tenant as mongoose.Model<TenantDocument>) ||
  mongoose.model<TenantDocument>("Tenant", tenantSchema);
