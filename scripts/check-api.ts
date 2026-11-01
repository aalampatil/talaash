import assert from "node:assert/strict";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const protectedRoutes = [
  [
    "GET",
    "/api/user/me"
  ],
  [
    "POST",
    "/api/user/become-landlord"
  ],
  [
    "PATCH",
    "/api/property/507f1f77bcf86cd799439011/toggle"
  ],
  [
    "GET",
    "/api/tenant/profile"
  ],
  [
    "PATCH",
    "/api/tenant/profile/update"
  ],
  [
    "PATCH",
    "/api/tenant/preferences"
  ],
  [
    "PUT",
    "/api/tenant/preferences"
  ],
  [
    "POST",
    "/api/tenant/save-property/507f1f77bcf86cd799439011"
  ],
  [
    "POST",
    "/api/tenant/remove-property/507f1f77bcf86cd799439011"
  ],
  [
    "DELETE",
    "/api/tenant/remove-property/507f1f77bcf86cd799439011"
  ],
  [
    "POST",
    "/api/tenant/shortlist-property/507f1f77bcf86cd799439011"
  ],
  [
    "POST",
    "/api/tenant/remove-shortlist/507f1f77bcf86cd799439011"
  ],
  [
    "GET",
    "/api/tenant/visits"
  ],
  [
    "GET",
    "/api/tenant/recommended-properties"
  ],
  [
    "POST",
    "/api/tenant/request-visit"
  ],
  [
    "POST",
    "/api/tenant/cancel-visit/507f1f77bcf86cd799439011"
  ],
  [
    "DELETE",
    "/api/tenant/cancel-visit/507f1f77bcf86cd799439011"
  ],
  [
    "GET",
    "/api/landlord/profile"
  ],
  [
    "GET",
    "/api/landlord/property"
  ],
  [
    "POST",
    "/api/landlord/property"
  ],
  [
    "DELETE",
    "/api/landlord/property/507f1f77bcf86cd799439011"
  ],
  [
    "GET",
    "/api/landlord/visits"
  ],
  [
    "PATCH",
    "/api/landlord/visit/approve/507f1f77bcf86cd799439011"
  ],
  [
    "PATCH",
    "/api/landlord/visit/reject/507f1f77bcf86cd799439011"
  ],
  [
    "GET",
    "/api/admin/allProperties"
  ],
  [
    "GET",
    "/api/admin/allUsers"
  ],
  [
    "GET",
    "/api/admin/allLandlords"
  ]
];

async function expectJson(path: string, status: number, options: RequestInit = {}) {
  const response = await fetch(base + path, { redirect: "manual", ...options });
  assert.equal(response.status, status, `${options.method || "GET"} ${path}`);
  assert.match(response.headers.get("content-type") || "", /application\/json/);
  return response.json();
}

for (const path of ["/api/health", "/api/v1/health"]) {
  const result = await expectJson(path, 200);
  assert.equal(result.success, true);
}
for (const [method, path] of protectedRoutes) {
  const result = await expectJson(path, 401, { method });
  assert.equal(result.success, false);
}
await expectJson("/api/user/getUser", 401);
await expectJson("/api/tenant/getTenant", 401);
await expectJson("/api/v1/user/me", 401);
await expectJson("/api/property/not-an-id", 400);
await expectJson("/api/v1/property/not-an-id", 400);
await expectJson("/api/webhooks/clerk", 400, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
assert.equal((await fetch(base + "/api/property", { method: "POST" })).status, 405);
console.log(`PASS: native health, ${protectedRoutes.length + 3} protected API requests, versioned aliases, invalid IDs, unsigned webhook, unsupported method`);
