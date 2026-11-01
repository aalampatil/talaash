export type Role = "tenant" | "landlord" | "admin";
export interface User { _id: string; clerkId: string; name: string; email: string; phone?: string; mobile?: string; profilePicture?: string; role: Role; verified: boolean; createdAt?: string }
export type PropertyImage = string | { url: string; publicId?: string };
export interface Landlord { _id: string; userId?: User | string; profile?: User; clerkId?: string; properties?: Property[] }
export interface Property { _id: string; title: string; description: string; rent: number; ratings?: number; propertyType: string; status: string; images: PropertyImage[]; amenities: string[]; location: { city: string; area: string; address: string; State?: string }; landlordId?: Landlord; createdAt?: string }
export interface Preferences { householdType: string; city: string; location: string; minBudget: number; maxBudget: number; propertyType: string }
export interface TenantProfile { id?: string; profile?: User; preferences?: Preferences; savedProperties?: Property[] }
export interface Visit { _id: string; propertyId?: Property; landlordId?: Landlord; visitDate: string; status: string; message?: string; tenantName?: string; tenantEmail?: string; propertyTitle?: string; date?: string; time?: string }
export interface ApiResponse<T> { success: boolean; message: string; data: T }
export interface SearchParams { city?: string; rent?: string | number; propertyType?: string }
