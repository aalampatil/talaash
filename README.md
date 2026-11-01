# Talaash

Rental property discovery with tenant, landlord, and admin experiences. The web app uses Next.js App Router, React, Tailwind CSS, and Clerk. The separate Express API uses MongoDB and Cloudinary.

## Project structure

```text
frontend/
  public/images/            Logos and static assets
  src/
    app/                    Next.js routes, layouts, metadata, and error pages
      (site)/               Shared public and tenant site shell
        (tenant)/           Tenant-only routes and role guard
        property/[id]/      Public property details
      dashboard/
        admin/              Admin routes and scoped provider
        landlord/           Landlord routes and scoped provider
      login/[role]/         Tenant, landlord, and admin authentication
    features/
      auth/                 Clerk integration, role guard, user session state
      properties/           Discovery, search, cards, property details
      tenant/               Profile, saved properties, visit requests
      landlord/             Listings, uploads, visit management
      admin/                Dashboard, users, landlords, property overview
    components/
      layout/               Header, footer, sidebar, shared application shell
      feedback/             Shared loading UI
      ui/                   Reusable UI primitives
    providers/              Application provider composition
    lib/api/                Shared Axios client
    lib/utils.js            Shared CSS class utilities
    hooks/                  Shared React hooks
    data/                   Static reference data
    styles/                 Global styles and design tokens
    proxy.js                Clerk request/session integration
backend/
  src/
    modules/                Domain-specific routes, controllers, services, models
      admin/
      landlord/
      property/
      tenant/
      user/
      visit/
    common/
      db/                   Database connection
      middlewares/          Validation and upload middleware
      validations/          Request and model validation schemas
      utils/                API responses, errors, upload utilities
    app.ts                  Express application and route registration
    env.ts                  Server environment validation
    index.ts                API process entry point
    seed.ts                 Database seed entry point
render.yaml                 Existing backend Render deployment configuration
```

Within a frontend feature, `components/` contains UI, `context/` contains shared feature state, `services/` contains HTTP calls, and `utils/` contains feature helpers. Add only the folders a feature needs. Keep route files thin: compose layouts or render feature components. Next.js route groups in parentheses organize routes without changing URLs.

## Local setup

Use Node.js 20.9 or newer. From the repository root:

```sh
npm --prefix frontend ci
npm --prefix backend install
```

The backend also retains its existing Bun lockfile; `bun install --frozen-lockfile` inside `backend/` is an alternative to its npm install step.

Copy `frontend/.env.example` to `frontend/.env.local` and `backend/.env.example` to `backend/.env`. Fill in credentials before starting either service. Use the same Clerk instance in both applications.

Frontend configuration:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
API_URL=http://localhost:8080/api
```

Set the backend's `PORT=8080` and `CLIENT=http://localhost:3000`, along with its MongoDB, Cloudinary, Clerk, webhook signing secret, and admin email settings. Register Clerk webhooks against the backend's `/api/webhooks/clerk` URL. Do not expose server secrets through `NEXT_PUBLIC_` variables.

Start two terminals at the repository root:

```sh
# Terminal 1: API
npm run dev:api

# Terminal 2: Next.js, http://localhost:3000
npm run dev
```

The browser sends requests to `/api` on the Next.js origin. `next.config.mjs` forwards them to `API_URL`, including the `/api` prefix. Include `/api/v1` instead if using the API's versioned routes. For direct calls to an independently hosted backend, set `NEXT_PUBLIC_API_URL` to its full API base URL and configure the backend's `CLIENT` origin accordingly.

Existing local Vite environment names were migrated to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_URL`, and `NEXT_PUBLIC_APP_URL`. New environments should follow the example file. Next.js public variables are embedded during the build; rebuild after changing them or the rewrite destination.

## Commands

| Root command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development server |
| `npm run dev:api` | Watch, compile, and run the Express API |
| `npm run lint` | Check frontend code with Next.js ESLint rules |
| `npm run build` | Build frontend and backend |
| `npm run build:web` | Build only Next.js |
| `npm run build:api` | Compile only the backend |
| `npm start` | Run the built Next.js app |
| `npm run start:api` | Run the compiled API |

## Routes and authentication

Public pages: `/` and `/property/[id]`.

Tenant pages: `/filter-properties`, `/account`, `/my-visits`, `/saved-properties`.

Landlord pages: `/dashboard/landlord`, `/dashboard/landlord/properties`, `/dashboard/landlord/visits`, `/dashboard/landlord/add-new-property`.

Admin pages: `/dashboard/admin`, `/dashboard/admin/all-users`, `/dashboard/admin/all-landlords`, `/dashboard/admin/all-properties`.

Login pages: `/login/tenant`, `/login/landlord`, `/login/admin`. `/login` redirects to the tenant login; unsupported roles return 404. Clerk authentication components use hash routing for their multi-step flows.

`RoleGuard` waits for session verification before rendering protected UI. It redirects users to their role's home page or login. Backend authorization remains responsible for access to protected API data. Admin and landlord providers mount only inside their respective dashboard layouts.

## Deployment

Deploy `frontend/` as a Next.js Node application with `npm ci`, `npm run build`, and `npm start`. It requires a Node runtime for Clerk integration and API rewrites. Configure the frontend's Clerk variables and `API_URL` in the deployment environment before building. `API_URL` must point to a backend reachable from that server, not production localhost.

The existing `render.yaml` continues to deploy the backend separately. Set the backend's `CLIENT` to the deployed frontend origin and configure the Clerk instance for that origin. No deployment is performed by this migration.

## Verification

Frontend lint, the Next.js production build, and backend TypeScript compilation pass. A production-mode Chrome smoke check passed for homepage rendering, client navigation to a property, dynamic-route refresh, role login pages, login redirects, not-found pages, and unauthenticated tenant/landlord/admin guards, with no browser runtime errors. Property requests used an API fixture for this check.

Live database-backed workflows and authenticated role actions require a reachable MongoDB instance and valid service credentials. A MongoDB SRV DNS failure in the current environment prevented live API verification during migration.
