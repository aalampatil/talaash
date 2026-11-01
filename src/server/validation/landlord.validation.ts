import "server-only";

import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const landlordValidationSchema = z
  .object({
    userId: objectId,
    clerkId: z.string(),

    properties: z.array(objectId).default([]),
  })
  .strict();

export type LandlordDTO = z.infer<typeof landlordValidationSchema>;
