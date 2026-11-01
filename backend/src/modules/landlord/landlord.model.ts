import mongoose, { Schema, type InferSchemaType } from "mongoose";

const landlordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    properties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  { timestamps: true },
);

export type LandlordDocument = InferSchemaType<typeof landlordSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Landlord =
  (mongoose.models.Landlord as mongoose.Model<LandlordDocument>) ||
  mongoose.model<LandlordDocument>("Landlord", landlordSchema);
