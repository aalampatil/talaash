import { env } from "@/server/config/env";
import { v2 as cloudinary,type UploadApiResponse } from "cloudinary";
import "server-only";

function configure() {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadOnCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  configure();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
      if (error || !result) reject(error || new Error("Image upload failed"));
      else resolve(result);
    });
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  if (!publicId) return null;
  configure();
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
