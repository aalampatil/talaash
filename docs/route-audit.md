# Route audit

Checked against the production Next.js application at `http://localhost:3100` on 2026-11-01.

**Not all linked destinations are implemented.** All 68 API method/prefix checks returned their expected response, and all 18 defined page cases rendered or redirected as expected. Two landlord links point to missing pages. See [route-audit.json](route-audit.json) for the machine-readable results.

## Property API error

The system resolver returned `ECONNREFUSED` for MongoDB SRV discovery. An optional `MONGODB_DNS_SERVERS` setting now allows the application to use a working resolver. The ignored local configuration uses `1.1.1.1,8.8.8.8`. A read-only database connection succeeded, and the live property API returned 88 available properties.

Property listing, search, and detail views now show clear errors; listings and property details support retry. Browser checks passed for invalid IDs, missing properties, failed listing recovery, search failure feedback, and failed detail recovery.

## Missing destinations

| Link | Missing route | Observed result | Source |
| --- | --- | --- | --- |
| Edit property | `/dashboard/landlord/properties/edit/[id]` | HTTP 404; not-found page visible | `src/features/landlord/components/LandlordProperties.jsx:71` |
| Property visits | `/dashboard/landlord/properties/[id]/visits` | HTTP 404; not-found page visible | `src/features/landlord/components/LandlordProperties.jsx:78` |

The edit destination needs an edit page and an authorized property-update endpoint. The visits destination needs a property-specific visits page or a link to the existing `/dashboard/landlord/visits` page.

## Coverage limits

Not verified: no authenticated tenant, landlord, or admin session was used. Protected page redirects and API authorization were checked while signed out.

A 401 verifies access enforcement, not the success path of the protected operation. No visit creation, property deletion, property update, user role change, or signed webhook was performed against live data.

## Pages

| Route | Result | Observed behavior |
| --- | --- | --- |
| `/account` | PASS | Redirects unauthenticated users to /login/tenant |
| `/filter-properties` | PASS | Redirects unauthenticated users to /login/tenant |
| `/my-visits` | PASS | Redirects unauthenticated users to /login/tenant |
| `/saved-properties` | PASS | Redirects unauthenticated users to /login/tenant |
| `/` | PASS | Live properties render |
| `/property/[id]` | PASS | Live property details render and survive refresh |
| `/dashboard/admin/all-landlords` | PASS | Redirects unauthenticated users to /login/admin |
| `/dashboard/admin/all-properties` | PASS | Redirects unauthenticated users to /login/admin |
| `/dashboard/admin/all-users` | PASS | Redirects unauthenticated users to /login/admin |
| `/dashboard/admin` | PASS | Redirects unauthenticated users to /login/admin |
| `/dashboard/landlord/add-new-property` | PASS | Redirects unauthenticated users to /login/landlord |
| `/dashboard/landlord` | PASS | Redirects unauthenticated users to /login/landlord |
| `/dashboard/landlord/properties` | PASS | Redirects unauthenticated users to /login/landlord |
| `/dashboard/landlord/visits` | PASS | Redirects unauthenticated users to /login/landlord |
| `/login` | PASS | Login UI renders |
| `/login/tenant` | PASS | Login UI renders |
| `/login/landlord` | PASS | Login UI renders |
| `/login/admin` | PASS | Login UI renders |

## API methods

Both canonical and versioned prefixes were requested independently. Public reads used live database data.

| Route | Method | Expected HTTP | Actual HTTP | Result |
| --- | --- | --- | --- | --- |
| `/api/admin/allLandlords` | GET | 401 | 401 | PASS |
| `/api/v1/admin/allLandlords` | GET | 401 | 401 | PASS |
| `/api/admin/allProperties` | GET | 401 | 401 | PASS |
| `/api/v1/admin/allProperties` | GET | 401 | 401 | PASS |
| `/api/admin/allUsers` | GET | 401 | 401 | PASS |
| `/api/v1/admin/allUsers` | GET | 401 | 401 | PASS |
| `/api/health` | GET | 200 | 200 | PASS |
| `/api/v1/health` | GET | 200 | 200 | PASS |
| `/api/landlord/profile` | GET | 401 | 401 | PASS |
| `/api/v1/landlord/profile` | GET | 401 | 401 | PASS |
| `/api/landlord/property` | GET | 401 | 401 | PASS |
| `/api/v1/landlord/property` | GET | 401 | 401 | PASS |
| `/api/landlord/property` | POST | 401 | 401 | PASS |
| `/api/v1/landlord/property` | POST | 401 | 401 | PASS |
| `/api/landlord/property/[propertyId]` | DELETE | 401 | 401 | PASS |
| `/api/v1/landlord/property/[propertyId]` | DELETE | 401 | 401 | PASS |
| `/api/landlord/visit/approve/[visitId]` | PATCH | 401 | 401 | PASS |
| `/api/v1/landlord/visit/approve/[visitId]` | PATCH | 401 | 401 | PASS |
| `/api/landlord/visit/reject/[visitId]` | PATCH | 401 | 401 | PASS |
| `/api/v1/landlord/visit/reject/[visitId]` | PATCH | 401 | 401 | PASS |
| `/api/landlord/visits` | GET | 401 | 401 | PASS |
| `/api/v1/landlord/visits` | GET | 401 | 401 | PASS |
| `/api/property` | GET | 200 | 200 | PASS |
| `/api/v1/property` | GET | 200 | 200 | PASS |
| `/api/property/search` | GET | 200 | 200 | PASS |
| `/api/v1/property/search` | GET | 200 | 200 | PASS |
| `/api/property/[propertyId]` | GET | 200 | 200 | PASS |
| `/api/v1/property/[propertyId]` | GET | 200 | 200 | PASS |
| `/api/property/[propertyId]/toggle` | PATCH | 401 | 401 | PASS |
| `/api/v1/property/[propertyId]/toggle` | PATCH | 401 | 401 | PASS |
| `/api/tenant/cancel-visit/[visitId]` | POST | 401 | 401 | PASS |
| `/api/v1/tenant/cancel-visit/[visitId]` | POST | 401 | 401 | PASS |
| `/api/tenant/cancel-visit/[visitId]` | DELETE | 401 | 401 | PASS |
| `/api/v1/tenant/cancel-visit/[visitId]` | DELETE | 401 | 401 | PASS |
| `/api/tenant/getTenant` | GET | 401 | 401 | PASS |
| `/api/v1/tenant/getTenant` | GET | 401 | 401 | PASS |
| `/api/tenant/preferences` | PATCH | 401 | 401 | PASS |
| `/api/v1/tenant/preferences` | PATCH | 401 | 401 | PASS |
| `/api/tenant/preferences` | PUT | 401 | 401 | PASS |
| `/api/v1/tenant/preferences` | PUT | 401 | 401 | PASS |
| `/api/tenant/profile` | GET | 401 | 401 | PASS |
| `/api/v1/tenant/profile` | GET | 401 | 401 | PASS |
| `/api/tenant/profile/update` | PATCH | 401 | 401 | PASS |
| `/api/v1/tenant/profile/update` | PATCH | 401 | 401 | PASS |
| `/api/tenant/recommended-properties` | GET | 401 | 401 | PASS |
| `/api/v1/tenant/recommended-properties` | GET | 401 | 401 | PASS |
| `/api/tenant/remove-property/[propertyId]` | POST | 401 | 401 | PASS |
| `/api/v1/tenant/remove-property/[propertyId]` | POST | 401 | 401 | PASS |
| `/api/tenant/remove-property/[propertyId]` | DELETE | 401 | 401 | PASS |
| `/api/v1/tenant/remove-property/[propertyId]` | DELETE | 401 | 401 | PASS |
| `/api/tenant/remove-shortlist/[propertyId]` | POST | 401 | 401 | PASS |
| `/api/v1/tenant/remove-shortlist/[propertyId]` | POST | 401 | 401 | PASS |
| `/api/tenant/request-visit` | POST | 401 | 401 | PASS |
| `/api/v1/tenant/request-visit` | POST | 401 | 401 | PASS |
| `/api/tenant/save-property/[propertyId]` | POST | 401 | 401 | PASS |
| `/api/v1/tenant/save-property/[propertyId]` | POST | 401 | 401 | PASS |
| `/api/tenant/shortlist-property/[propertyId]` | POST | 401 | 401 | PASS |
| `/api/v1/tenant/shortlist-property/[propertyId]` | POST | 401 | 401 | PASS |
| `/api/tenant/visits` | GET | 401 | 401 | PASS |
| `/api/v1/tenant/visits` | GET | 401 | 401 | PASS |
| `/api/user/become-landlord` | POST | 401 | 401 | PASS |
| `/api/v1/user/become-landlord` | POST | 401 | 401 | PASS |
| `/api/user/getUser` | GET | 401 | 401 | PASS |
| `/api/v1/user/getUser` | GET | 401 | 401 | PASS |
| `/api/user/me` | GET | 401 | 401 | PASS |
| `/api/v1/user/me` | GET | 401 | 401 | PASS |
| `/api/webhooks/clerk` | POST | 400 | 400 | PASS |
| `/api/v1/webhooks/clerk` | POST | 400 | 400 | PASS |
