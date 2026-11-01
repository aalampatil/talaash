import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
import mongoose from "mongoose";
import { connectDB } from "../src/server/db/connect";
import { Landlord } from "../src/server/modules/landlord/landlord.model";
import { PropertyModel } from "../src/server/modules/property/property.model";
import { Tenant } from "../src/server/modules/tenant/tenant.model";
import { User, type UserDocument } from "../src/server/modules/user/user.model";
import { Visit } from "../src/server/modules/visit/visit.model";

type AppRole = UserDocument["role"];
type HouseholdType = "family" | "single" | "room";
type TenantPropertyType = "1BHK" | "2BHK" | "3BHK";
type PropertyType = TenantPropertyType | "room";

type SeedUser = {
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  role: AppRole;
  verified: boolean;
};

const landlordCount = 100;
const tenantCount = 100;
const propertyCount = 100;

const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Arjun",
  "Sai",
  "Rohan",
  "Ishaan",
  "Kabir",
  "Priya",
  "Ananya",
  "Diya",
  "Neha",
  "Sara",
  "Meera",
  "Isha",
  "Kavya",
];

const lastNames = [
  "Patil",
  "Sharma",
  "Mehta",
  "Kulkarni",
  "Shah",
  "Deshmukh",
  "Joshi",
  "Khan",
  "Reddy",
  "Nair",
];

const areas = [
  "Kothrud",
  "Baner",
  "Viman Nagar",
  "Wakad",
  "Hinjewadi",
  "Shivajinagar",
  "Koregaon Park",
  "Aundh",
  "Hadapsar",
  "Kharadi",
];

const propertyTypes: PropertyType[] = ["1BHK", "2BHK", "3BHK", "room"];
const householdTypes: HouseholdType[] = ["family", "single", "room"];
const amenities = [
  "Parking",
  "Lift",
  "Security",
  "Balcony",
  "Gym",
  "WiFi",
  "Furnished",
  "Power Backup",
  "Water Supply",
  "Clubhouse",
];

const imageUrls = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=75",
];

const pick = <T>(items: T[], index: number) => items[index % items.length] as T;

const at = <T>(items: T[], index: number) => {
  const item = items[index % items.length];
  if (!item) throw new Error("Seed array unexpectedly empty");
  return item;
};

const pad = (value: number) => value.toString().padStart(3, "0");

const makeName = (index: number) =>
  `${pick(firstNames, index)} ${pick(lastNames, index * 3)}`;

const makeUsers = (): SeedUser[] => {
  const admin: SeedUser = {
    clerkId: "seed_admin",
    name: "Talaash Admin",
    email: "admin@talaash.local",
    phone: "9000000000",
    role: "admin",
    verified: true,
  };

  const landlords = Array.from({ length: landlordCount }, (_, index) => ({
    clerkId: `seed_landlord_${pad(index + 1)}`,
    name: makeName(index),
    email: `landlord.${pad(index + 1)}@talaash.local`,
    phone: `98${(76500000 + index).toString().padStart(8, "0")}`,
    role: "landlord" as AppRole,
    verified: true,
  }));

  const tenants = Array.from({ length: tenantCount }, (_, index) => ({
    clerkId: `seed_tenant_${pad(index + 1)}`,
    name: makeName(index + landlordCount),
    email: `tenant.${pad(index + 1)}@talaash.local`,
    phone: `97${(76500000 + index).toString().padStart(8, "0")}`,
    role: "tenant" as AppRole,
    verified: true,
  }));

  return [admin, ...landlords, ...tenants];
};

async function upsertUser(seedUser: SeedUser) {
  return User.findOneAndUpdate(
    { clerkId: seedUser.clerkId },
    { $set: seedUser },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
  );
}

async function main() {
  await connectDB();

  const users = await Promise.all(makeUsers().map(upsertUser));
  const landlords = await Promise.all(
    users
      .filter((user) => user.role === "landlord")
      .map((user) =>
        Landlord.findOneAndUpdate(
          { clerkId: user.clerkId },
          { $set: { userId: user._id, clerkId: user.clerkId } },
          { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
        ),
      ),
  );

  const tenants = await Promise.all(
    users
      .filter((user) => user.role === "tenant")
      .map((user, index) =>
        Tenant.findOneAndUpdate(
          { clerkId: user.clerkId },
          {
            $set: {
              userId: user._id,
              clerkId: user.clerkId,
              preferences: {
                householdType: pick(householdTypes, index),
                propertyType: pick(
                  propertyTypes.filter((type) => type !== "room"),
                  index,
                ) as TenantPropertyType,
                location: pick(areas, index),
                city: "Pune",
                minBudget: 8000 + (index % 10) * 1000,
                maxBudget: 25000 + (index % 12) * 2500,
              },
            },
          },
          { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
        ),
      ),
  );

  const properties = await Promise.all(
    Array.from({ length: propertyCount }, (_, index) => {
      const landlord = pick(landlords, index);
      const propertyType = pick(propertyTypes, index);
      const area = pick(areas, index);
      const bedrooms = propertyType === "room" ? "Private Room" : propertyType;
      const rent =
        propertyType === "room" ? 9000 + index * 75 : 15000 + index * 650;

      return PropertyModel.findOneAndUpdate(
        { landlordId: landlord._id, title: `Seed ${bedrooms} in ${area}` },
        {
          $set: {
            landlordId: landlord._id,
            title: `Seed ${bedrooms} in ${area}`,
            description: `Seeded ${bedrooms} rental in ${area}, Pune with practical amenities and good daily connectivity.`,
            rent,
            location: {
              area,
              city: "Pune",
              State: "Maharashtra",
              address: `${100 + index}, ${area}, Pune`,
            },
            propertyType,
            images: [
              {
                url: pick(imageUrls, index),
                publicId: `seed/property-${pad(index + 1)}`,
              },
            ],
            amenities: [
              pick(amenities, index),
              pick(amenities, index + 2),
              pick(amenities, index + 5),
            ],
            status: index % 9 === 0 ? "occupied" : "available",
            rating: 3.8 + (index % 12) / 10,
          },
        },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
      );
    }),
  );

  await Promise.all(
    landlords.map((landlord) =>
      Landlord.updateOne(
        { _id: landlord._id },
        {
          $set: {
            properties: properties
              .filter((property) => property.landlordId.equals(landlord._id))
              .map((property) => property._id),
          },
        },
      ),
    ),
  );

  await Promise.all(
    tenants.slice(0, 20).map((tenant, index) =>
      Tenant.updateOne(
        { _id: tenant._id },
        {
          $set: {
            savedProperties: [
              at(properties, index)._id,
              at(properties, index + 7)._id,
            ],
            shortListedProperties: [
              at(properties, index + 13)._id,
            ],
          },
        },
      ),
    ),
  );

  await Promise.all(
    tenants.slice(0, 20).map((tenant, index) => {
      const property = at(properties, index);
      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() + index + 1);
      visitDate.setHours(10 + (index % 6), 0, 0, 0);

      return Visit.findOneAndUpdate(
        {
          tenantId: tenant._id,
          propertyId: property._id,
          visitDate,
        },
        {
          $set: {
            tenantId: tenant._id,
            propertyId: property._id,
            landlordId: property.landlordId,
            visitDate,
            message: "Seed visit request for this property.",
            status: pick(["pending", "approved", "rejected"], index),
          },
        },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
      );
    }),
  );

  console.log(
    `Seed complete: ${users.length} users, ${landlords.length} landlords, ${tenants.length} tenants, ${properties.length} properties.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
