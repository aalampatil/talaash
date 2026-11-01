import "server-only";

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
}

// Read credentials at request time so builds do not need access to live services.
export const env = {
  get MONGODB_URI() { return requireEnv("MONGODB_URI"); },
  get ADMIN_EMAIL() { return requireEnv("ADMIN_EMAIL"); },
  get CLOUDINARY_CLOUD_NAME() { return requireEnv("CLOUDINARY_CLOUD_NAME"); },
  get CLOUDINARY_API_KEY() { return requireEnv("CLOUDINARY_API_KEY"); },
  get CLOUDINARY_API_SECRET() { return requireEnv("CLOUDINARY_API_SECRET"); },
  get CLERK_WEBHOOK_SIGNING_SECRET() { return requireEnv("CLERK_WEBHOOK_SIGNING_SECRET"); },
};
