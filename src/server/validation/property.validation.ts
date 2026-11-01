import "server-only";

import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const propertyValidationSchema = z
  .object({
    landlordId: objectId,

    title: z.string().min(1, "Title is required"),

    description: z.string().optional(),

    rent: z.number().min(0, "Rent must be positive"),

    location: z.object({
      area: z.string().min(1),
      city: z.string().min(1),
      State: z.string().min(1),
      address: z.string().min(1),
    }),

    propertyType: z.enum(["1BHK", "2BHK", "3BHK", "room"]),

    images: z
      .array(
        z.object({
          url: z.string().url("Invalid image URL"),
          publicId: z.string(),
        }),
      )
      .optional(),

    amenities: z.array(z.string()).optional(),

    status: z.enum(["available", "occupied"]).default("available"),

    rating: z.number().min(1).max(5).optional(),
  })
  .strict();

export type PropertyDTO = z.infer<typeof propertyValidationSchema>;
