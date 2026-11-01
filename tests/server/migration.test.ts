import assert from "node:assert/strict";
import { test } from "node:test";
import { readPropertyUpload } from "../../src/server/storage/property-upload";
import { Landlord } from "../../src/server/modules/landlord/landlord.model";
import { PropertyModel } from "../../src/server/modules/property/property.model";
import { ServiceHandleTogglePropertyAvailability } from "../../src/server/modules/property/property.service";

const propertyId = "507f1f77bcf86cd799439011";

test("multipart uploads retain fields and image bytes without temporary files", async () => {
  const data = new FormData();
  data.set("title", "A home");
  data.set("amenities", JSON.stringify(["WiFi"]));
  data.append("images", new File([new Uint8Array([1, 2, 3])], "home.png", { type: "image/png" }));
  const result = await readPropertyUpload(new Request("http://localhost/api/landlord/property", { method: "POST", body: data }));
  assert.equal(result.body.title, "A home");
  assert.equal(result.body.amenities, '["WiFi"]');
  assert.deepEqual(result.files[0].buffer, Buffer.from([1, 2, 3]));
});

test("multipart uploads reject non-images before Cloudinary is called", async () => {
  const data = new FormData();
  data.append("images", new File(["plain text"], "test.txt", { type: "text/plain" }));
  await assert.rejects(
    readPropertyUpload(new Request("http://localhost/api/landlord/property", { method: "POST", body: data })),
    { statusCode: 400 },
  );
});

test("multipart uploads reject more than ten images", async () => {
  const data = new FormData();
  for (let i = 0; i < 11; i++) data.append("images", new File(["x"], "home.png", { type: "image/png" }));
  await assert.rejects(
    readPropertyUpload(new Request("http://localhost/api/landlord/property", { method: "POST", body: data })),
    { statusCode: 400 },
  );
});

test("availability changes require a landlord profile", async (t) => {
  t.mock.method(Landlord, "findOne", async () => null);
  await assert.rejects(ServiceHandleTogglePropertyAvailability(propertyId, "user_tenant"), { statusCode: 403 });
});

test("availability changes restrict the query to the authenticated landlord", async (t) => {
  t.mock.method(Landlord, "findOne", async () => ({ _id: "owner-id" }));
  const query = t.mock.method(PropertyModel, "findOne", async () => null);
  await assert.rejects(ServiceHandleTogglePropertyAvailability(propertyId, "user_owner"), { statusCode: 404 });
  assert.deepEqual(query.mock.calls[0].arguments[0], { _id: propertyId, landlordId: "owner-id" });
});

test("an owned property's availability is saved", async (t) => {
  t.mock.method(Landlord, "findOne", async () => ({ _id: "owner-id" }));
  let saves = 0;
  const property = { status: "available", save: async () => { saves++; } };
  t.mock.method(PropertyModel, "findOne", async () => property);
  const result = await ServiceHandleTogglePropertyAvailability(propertyId, "user_owner");
  assert.equal(result.status, "occupied");
  assert.equal(saves, 1);
});
