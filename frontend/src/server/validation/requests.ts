import "server-only";
import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
});

export const visitRequestSchema = z.object({
  propertyId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid propertyId"),
  visitDate: z.string().min(1).refine(value => !Number.isNaN(Date.parse(value)), "Invalid visit date"),
  message: z.string().optional(),
});
