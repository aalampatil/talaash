import ApiError from "@/server/http/api-error";
import "server-only";

export async function readPropertyUpload(request: Request) {
  let form: FormData;
  try { form = await request.formData(); }
  catch { throw ApiError.badRequest("Expected multipart form data"); }
  const body: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") body[key] = value;
  }
  const images = form.getAll("images");
  if (images.length > 10) throw ApiError.badRequest("Upload up to 10 images");
  let totalBytes = 0;
  for (const image of images) {
    if (!(image instanceof File) || !image.type.startsWith("image/")) throw ApiError.badRequest("Only image files are accepted");
    totalBytes += image.size;
    if (image.size > 10 * 1024 * 1024 || totalBytes > 25 * 1024 * 1024) {
      throw ApiError.badRequest("Images exceed the upload size limit");
    }
  }
  const files = await Promise.all((images as File[]).map(async image => ({ buffer: Buffer.from(await image.arrayBuffer()) })));
  return { body, files };
}
