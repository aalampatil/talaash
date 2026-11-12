import { expect, test, type Page } from "@playwright/test";

// Public discovery fixtures are isolated from the live database. Authentication
// remains real and signed out; these tests never create users or change records.
const homes = [
  {
    _id: "507f1f77bcf86cd799439011",
    title: "The sunlit Baner apartment",
    rent: 24000,
    propertyType: "2BHK",
    status: "available",
    description: "A bright corner to make your own.",
    location: { city: "Pune", area: "Baner", address: "Sample address" },
    images: [
      "/images/editorial/living-room.jpg",
      "/images/editorial/interior.jpg",
    ],
    amenities: ["WiFi", "Parking"],
    createdAt: "2026-10-12T00:00:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    title: "A quiet city retreat",
    rent: 12000,
    propertyType: "1BHK",
    status: "available",
    description: "A quiet home.",
    location: { city: "Pune", area: "Aundh", address: "Sample address" },
    images: ["/images/editorial/interior.jpg"],
    amenities: ["Furnished"],
    createdAt: "2026-10-13T00:00:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439013",
    title: "Room for a new beginning",
    rent: 8000,
    propertyType: "room",
    status: "available",
    description: "Your own room.",
    location: { city: "Mumbai", area: "Andheri", address: "Sample address" },
    images: [],
    amenities: [],
    createdAt: "2026-10-14T00:00:00Z",
  },
];

async function fixtures(page: Page) {
  await page.route(/\/api\/property(?:\/|$)/, async (route) => {
    const url = new URL(route.request().url());
    let data: unknown = homes;
    if (url.pathname.endsWith("/search")) {
      data = homes.filter(
        (home) =>
          (!url.searchParams.get("city") ||
            home.location.city
              .toLowerCase()
              .includes(url.searchParams.get("city")!.toLowerCase())) &&
          (!url.searchParams.get("rent") ||
            home.rent <= Number(url.searchParams.get("rent"))) &&
          (!url.searchParams.get("propertyType") ||
            home.propertyType === url.searchParams.get("propertyType")),
      );
    } else if (/\/property\/[a-f\d]{24}$/.test(url.pathname)) {
      data = homes.find((home) => url.pathname.endsWith(home._id));
    }
    await route.fulfill({
      json: { success: true, message: "Test fixture", data },
    });
  });
}

test.beforeEach(async ({ page }) => {
  await fixtures(page);
});

test("home discovery renders, filters cards, and fits the viewport", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "right at home",
  );
  await expect(page.locator("#discover article")).toHaveCount(3);
  await page.getByRole("button", { name: "1 BHK", exact: true }).click();
  await expect(page.locator("#discover article")).toHaveCount(1);
  await expect(page.locator("#discover article")).toContainText(
    "A quiet city retreat",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("search URL preserves filters after refresh", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const search = page.getByRole("form", { name: "Find a rental home" });
  await search.getByRole("combobox", { name: "Where to?" }).fill("Pune");
  await search
    .getByRole("combobox", { name: "Monthly budget" })
    .selectOption("20000");
  await search
    .getByRole("combobox", { name: "Your kind of space" })
    .selectOption("1BHK");
  await search.getByRole("button", { name: "Find a home" }).click();
  await expect(page).toHaveURL(
    /filter-properties\?city=Pune&rent=20000&propertyType=1BHK/,
  );
  await expect(page.locator("article")).toHaveCount(1);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("combobox", { name: "Where to?" })).toHaveValue(
    "Pune",
  );
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article")).toContainText("A quiet city retreat");
});

test("browse works signed out and sorts by monthly rent", async ({ page }) => {
  await page.goto("/filter-properties", { waitUntil: "domcontentloaded" });
  await expect(page.locator("article")).toHaveCount(3);
  await page
    .getByRole("combobox", { name: "Sort homes" })
    .selectOption("price-low");
  await expect(page.locator("article").first()).toContainText(
    "Room for a new beginning",
  );
  await page
    .getByRole("combobox", { name: "Sort homes" })
    .selectOption("price-high");
  await expect(page.locator("article").first()).toContainText(
    "The sunlit Baner apartment",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("empty search offers a way to clear filters", async ({ page }) => {
  await page.goto("/filter-properties?city=Nowhere", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByRole("heading", { name: "The right place is still out there." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Clear filters" }).click();
  await expect(page.locator("article")).toHaveCount(3);
});

test("property gallery changes the main photograph", async ({ page }) => {
  await page.goto(`/property/${homes[0]._id}`, {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByRole("heading", { name: homes[0].title, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: `Show another view of ${homes[0].title}` })
    .click();
  await expect(
    page.getByRole("img", { name: `${homes[0].title}, view 2` }),
  ).toHaveAttribute("src", "/images/editorial/interior.jpg");
  await expect(
    page.getByRole("button", { name: "Sign in to request a visit" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("API failures show recovery controls", async ({ page }) => {
  await page.route("**/api/property/search**", (route) =>
    route.fulfill({
      status: 503,
      json: { success: false, message: "Unavailable", data: null },
    }),
  );
  await page.goto("/filter-properties", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "We couldn’t load these homes",
  );
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});

for (const [path, role] of [
  ["/saved-properties", "tenant"],
  ["/dashboard/landlord", "landlord"],
  ["/dashboard/admin", "admin"],
]) {
  test(`signed-out ${role} workspace redirects to sign in`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(new RegExp(`/login/${role}`));
    await expect(
      page.getByRole("heading", { name: "Welcome home.", level: 1 }),
    ).toBeVisible();
  });
}

test("main navigation remains accessible on both viewport sizes", async ({
  page,
}, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  if (testInfo.project.name === "mobile") {
    const trigger = page.getByRole("button", { name: "Toggle Sidebar" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close navigation" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  } else {
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Find a home" }),
    ).toBeVisible();
  }
});
