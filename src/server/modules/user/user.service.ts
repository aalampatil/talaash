import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import type { WebhookEvent } from "@clerk/nextjs/webhooks";
import { Landlord } from "../landlord/landlord.model";
import { Tenant } from "../tenant/tenant.model";
import { User, type UserDocument } from "./user.model";
import { env } from "@/server/config/env";
import ApiError from "@/server/http/api-error";

type AppRole = "tenant" | "landlord" | "admin";

type ClerkEmail = {
  id: string;
  email_address: string;
  verification?: {
    status?: string;
  } | null | undefined;
};

type ClerkUserLike = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmail[];
  phone_numbers?: Array<{ phone_number?: string | null }>;
  unsafe_metadata?: Record<string, unknown>;
  public_metadata?: Record<string, unknown>;
  private_metadata?: Record<string, unknown>;
};

const isAppRole = (role: unknown): role is AppRole =>
  role === "tenant" || role === "landlord" || role === "admin";

const getRoleFromClerkUser = (user: ClerkUserLike, email: string): AppRole => {
  const role =
    user.unsafe_metadata?.role ??
    user.public_metadata?.role ??
    user.private_metadata?.role;

  if (email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase()) return "admin";
  // Signup metadata is user-editable and must never grant admin access.
  if (role === "admin") {
    return user.private_metadata?.role === "admin" || user.public_metadata?.role === "admin" ? "admin" : "tenant";
  }
  return isAppRole(role) ? role : "tenant";
};

const getPrimaryEmail = (user: ClerkUserLike) => {
  return (
    user.email_addresses?.find(
      (email) => email.id === user.primary_email_address_id,
    ) ?? user.email_addresses?.[0]
  );
};

const getDisplayName = (user: ClerkUserLike, email: string) => {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || user.username || email.split("@")[0] || "User";
};

const ensureRoleProfile = async (user: UserDocument) => {
  if (user.role === "admin") return;

  if (user.role === "tenant") {
    await Tenant.updateOne(
      { clerkId: user.clerkId },
      { $setOnInsert: { userId: user._id, clerkId: user.clerkId } },
      { upsert: true },
    );
    return;
  }

  await Landlord.updateOne(
    { clerkId: user.clerkId },
    { $setOnInsert: { userId: user._id, clerkId: user.clerkId } },
    { upsert: true },
  );
};

const becomeLandlord = async (clerkId: string) => {
  const clerkUser = await (await clerkClient()).users.getUser(clerkId);
  const email = clerkUser.emailAddresses.find(
    (item) => item.id === clerkUser.primaryEmailAddressId,
  );

  if (email?.emailAddress.toLowerCase() === env.ADMIN_EMAIL.toLowerCase()) {
    throw ApiError.badRequest("Admin users cannot become landlords");
  }

  await (await clerkClient()).users.updateUserMetadata(clerkId, {
    unsafeMetadata: {
      ...clerkUser.unsafeMetadata,
      role: "landlord",
    },
  });

  const user = await User.findOneAndUpdate(
    { clerkId },
    { $set: { role: "landlord" } },
    { new: true },
  );

  if (!user) throw ApiError.notfound("User not found");

  await ensureRoleProfile(user);
  return user;
};

const syncUserFromClerkUser = async (clerkUser: ClerkUserLike) => {
  const email = getPrimaryEmail(clerkUser);
  if (!email?.email_address) return null;

  const role = getRoleFromClerkUser(clerkUser, email.email_address);
  const user = await User.findOneAndUpdate(
    { clerkId: clerkUser.id },
    {
      $set: {
        name: getDisplayName(clerkUser, email.email_address),
        email: email.email_address,
        phone: clerkUser.phone_numbers?.[0]?.phone_number ?? "",
        role,
        verified: email.verification?.status === "verified",
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await ensureRoleProfile(user);
  return user;
};

const syncUserFromClerkId = async (clerkId: string) => {
  const clerkUser = await (await clerkClient()).users.getUser(clerkId);
  return syncUserFromClerkUser({
    id: clerkUser.id,
    first_name: clerkUser.firstName,
    last_name: clerkUser.lastName,
    username: clerkUser.username,
    primary_email_address_id: clerkUser.primaryEmailAddressId,
    email_addresses: clerkUser.emailAddresses.map((email) => ({
      id: email.id,
      email_address: email.emailAddress,
      verification: email.verification?.status
        ? { status: email.verification.status }
        : undefined,
    })),
    phone_numbers: clerkUser.phoneNumbers.map((phone) => ({
      phone_number: phone.phoneNumber,
    })),
    unsafe_metadata: clerkUser.unsafeMetadata,
    public_metadata: clerkUser.publicMetadata,
    private_metadata: clerkUser.privateMetadata,
  });
};

const deleteUserFromClerkId = async (clerkId: string) => {
  const user = await User.findOneAndDelete({ clerkId });
  await Promise.all([
    Tenant.deleteOne({ clerkId }),
    Landlord.deleteOne({ clerkId }),
  ]);
  return user;
};

const handleClerkWebhookEvent = async (event: WebhookEvent) => {
  if (event.type === "user.created" || event.type === "user.updated") {
    return syncUserFromClerkUser(event.data as ClerkUserLike);
  }

  if (event.type === "user.deleted" && event.data.id) {
    return deleteUserFromClerkId(event.data.id);
  }

  return null;
};

export {
  deleteUserFromClerkId,
  becomeLandlord,
  handleClerkWebhookEvent,
  syncUserFromClerkId,
  syncUserFromClerkUser,
};
