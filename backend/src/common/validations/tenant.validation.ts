import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// ── Internal DTO (not for req.body validation) ────────────────────────────────

export const tenantValidationSchema = z.object({
  userId: objectId,
  clerkId: z.string(),
  preferences: z
    .object({
      householdType: z.enum(["family", "single", "room"]).optional(),
      propertyType: z.enum(["1BHK", "2BHK", "3BHK"]).optional(),
      location: z.string().optional(),
      city: z.string().optional(),
      minBudget: z.number().optional(),
      maxBudget: z.number().optional(),
    })
    .optional(),
  savedProperties: z.array(objectId).optional(),
  shortListedProperties: z.array(objectId).optional(),
});

export type TenantDTO = z.infer<typeof tenantValidationSchema>;

// ── PATCH /preferences ────────────────────────────────────────────────────────

export const tenantPreferencesUpdateSchema = z.object({
  preferences: z
    .object({
      householdType: z.enum(["family", "single", "room"]).optional(),
      propertyType: z.enum(["1BHK", "2BHK", "3BHK"]).optional(),
      location: z.string().min(1, "Location cannot be empty").optional(),
      city: z.string().min(1, "City cannot be empty").optional(),
      minBudget: z.number().nonnegative("minBudget must be >= 0").optional(),
      maxBudget: z.number().positive("maxBudget must be > 0").optional(),
    })
    .refine(
      (data) => {
        if (data.minBudget !== undefined && data.maxBudget !== undefined) {
          return data.maxBudget > data.minBudget;
        }
        return true;
      },
      { message: "maxBudget must be greater than minBudget" },
    )
    .optional(),
});

export type TenantPreferencesUpdateDTO = z.infer<
  typeof tenantPreferencesUpdateSchema
>;

// ── POST /save/:propertyId  &  DELETE /save/:propertyId ───────────────────────

export const propertyIdParamSchema = z.object({
  propertyId: objectId,
});

export type PropertyIdParamDTO = z.infer<typeof propertyIdParamSchema>;
