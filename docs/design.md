# Talaash interface

The interface uses a warm, editorial direction: cream surfaces, forest-green actions, restrained terracotta details, serif display typography, and generous space around photography. The wordmark keeps the Talaash name and adds a simple house symbol.

## Design system

The shared tokens and component classes live in `src/styles/globals.css`. Display text uses the system Georgia family; interface text uses Aptos, Segoe UI, or Arial. Fonts work without a remote font request. Shared primitives include the brand, page headings, empty states, loading indicators, resource errors, buttons, fields, status labels, and tables.

Use green for primary actions, neutral surfaces for supporting content, and distinct text labels alongside status colours. Controls have visible keyboard focus. Transitions respect reduced-motion preferences. Layouts adapt to narrow screens, while administration tables scroll within their own containers.

## Page coverage

- Home: property search, live listing cards, home-type filters, city entry points, an explanation of the rental flow, and a landlord invitation.
- Browse: public search, URL-based filters, rent sorting, loading skeletons, and recoverable empty and error states. Search links survive refresh and can be shared.
- Property: interactive photographs, amenities, owner details, save controls, and a date-based visit request card. Saving and requesting visits require a tenant account.
- Authentication: consistent Clerk styling, role-specific introductions, and an explicit account transition for existing tenants who want to become landlords. Returning users are routed to their actual account role.
- Tenant: saved homes, visit status, and editable rental preferences.
- Landlord: a dedicated overview, property cards, visit approvals and declines, and a labelled publishing form with image previews and upload limits.
- Admin: community totals, searchable people and property tables, and availability filters.
- Shared navigation, footer, missing pages, loading states, and request failures follow the same design language.

City imagery is presented as interior inspiration, not as an actual property in that city. Listings are provided by owners and are not independently verified. The interface does not claim otherwise.

## Assets

Editorial photographs are stored locally so the homepage does not depend on an image host at runtime:

- [Living room source](https://images.unsplash.com/photo-1600210492486-724fe5c67fb0), from Unsplash.
- [Interior source](https://images.unsplash.com/photo-1600607687939-ce8a6c25118c), from Unsplash.

Listing photography continues to use the images supplied with each property. A local illustrated placeholder handles missing images. The brand and placeholder are SVG assets, not external icon or image requests.

## Verification

```sh
npm run lint
npm run typecheck
npm run test:server
npm run build
```

Browser regression tests use Playwright at desktop and mobile viewport sizes:

```sh
npx playwright install chromium
npm run test:ui
```

To use an installed Chrome browser instead, set `PLAYWRIGHT_CHANNEL=chrome` in the test process environment. The test configuration starts a development server if one is not already available at `http://localhost:3000`.

Browser tests cover public discovery, filtering, URL persistence, sorting, galleries, recovery states, navigation, and signed-out role guards. Public listing responses use test fixtures; tests never create accounts or modify property, visit, or user records. Live health and API authorization checks remain available through `npm run test:api -- http://localhost:3000` against a running development server.

Signed-in saves, visit mutations, property publishing, and administrative data require development accounts for each role and should be exercised separately with development data. These are not bypassed or enabled through a preview-only authentication path.

The redesign adds Clerk's supported UI theme package, Playwright, and Prettier. Compatible dependency security updates are recorded in the npm lockfile. Review development-tool audit findings separately from the production dependency audit (`npm audit --omit=dev`).
