import "server-only";

import { z } from "zod";

export const userValidationSchema = z
  .object({
    clerkId: z.string().describe("clerk id"),

    name: z.string().min(1, "Name is required"),

    email: z.string().email("Invalid email"),

    phone: z.string().optional(), // or validate below

    role: z.enum(["tenant", "landlord", "admin"]),

    verified: z.boolean().default(false).describe("isVerified?"),
  })
  .strict();

export type UserDTO = z.infer<typeof userValidationSchema>;
