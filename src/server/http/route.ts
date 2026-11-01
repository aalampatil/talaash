import { connectDB } from "@/server/db/connect";
import ApiError from "@/server/http/api-error";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import "server-only";
import { ZodError } from "zod";

type Context = { params: Promise<Record<string, string>> };
type ApiContext = { request: NextRequest; params: Record<string, string>; clerkId: string };
type Handler = (context: ApiContext) => Promise<Response>;

export function ok(message: string, data: unknown = null, status = 200) {
  return Response.json({ success: true, message, data }, { status });
}

export function apiRoute(handler: Handler, options: { public?: boolean; database?: boolean } = {}) {
  return async (request: NextRequest, context: Context) => {
    try {
      let clerkId = "";
      if (!options.public) {
        const session = await auth();
        if (!session.userId) throw ApiError.unauthorised("Authentication required");
        clerkId = session.userId;
      }
      // Static routes receive an empty context without a params promise.
      const params = (await context.params) ?? {};
      for (const [key, value] of Object.entries(params)) {
        if (key.endsWith("Id") && !/^[a-f0-9]{24}$/i.test(value)) {
          throw ApiError.badRequest(`Invalid ${key}`);
        }
      }
      if (options.database !== false) await connectDB();
      return await handler({ request, params, clerkId });
    } catch (error) {
      if (error instanceof ApiError) {
        return Response.json({ success: false, message: error.message }, { status: error.statusCode });
      }
      if (error instanceof ZodError) {
        return Response.json({ success: false, message: "Validation failed", errors: error.flatten().fieldErrors }, { status: 400 });
      }
      if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError || error instanceof SyntaxError) {
        return Response.json({ success: false, message: "Invalid request data" }, { status: 400 });
      }
      console.error("API request failed:", error);
      return Response.json({ success: false, message: "Unable to complete request" }, { status: 500 });
    }
  };
}

export async function jsonBody(request: Request): Promise<Record<string, unknown>> {
  let body: unknown;
  try { body = await request.json(); }
  catch { throw ApiError.badRequest("Invalid JSON body"); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw ApiError.badRequest("Expected a JSON object");
  return body as Record<string, unknown>;
}
