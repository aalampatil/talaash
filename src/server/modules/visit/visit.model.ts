import "server-only";

import mongoose,{ Schema,type InferSchemaType } from "mongoose";

const visitSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "Landlord",
      required: true,
      index: true,
    },

    visitDate: {
      type: Date,
      required: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Optional: prevent duplicate booking for same slot
visitSchema.index(
  { tenantId: 1, propertyId: 1, visitDate: 1 },
  { unique: true },
);

export type VisitDocument = InferSchemaType<typeof visitSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Visit =
  (mongoose.models.Visit as mongoose.Model<VisitDocument>) ||
  mongoose.model<VisitDocument>("Visit", visitSchema);
