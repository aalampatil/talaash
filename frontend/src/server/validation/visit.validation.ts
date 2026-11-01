import "server-only";

import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const visitValidatonSchema = z
  .object({
    tenantId: objectId,
    propertyId: objectId,
    landlordId: objectId,

    visitDate: z.coerce.date(), // accepts string → converts to Date

    message: z.string().optional(),

    status: z
      .enum(["pending", "approved", "rejected", "completed"])
      .default("pending"),
  })
  .strict();

export type VisitDTO = z.infer<typeof visitValidatonSchema>;
