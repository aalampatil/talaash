# Talaash

A full-stack Next.js application for rental property discovery, tenant visits, landlord listings, and administration. UI pages and API endpoints run together in one Next.js process. MongoDB stores application data, Clerk handles authentication, and Cloudinary stores property images.

## Folder structure

```text
src/
  app/
    (site)/                  Public and tenant pages
      (tenant)/              Tenant-only layout and pages
      property/[id]/         Public property details
    dashboard/
      admin/                 Admin pages and scoped provider
      landlord/              Landlord pages and scoped provider
    login/[role]/            Tenant, landlord, and admin login
    api/                     Native Next.js Route Handlers
      admin/                 Administrative queries
      landlord/              Listings, uploads, visit approvals
      property/              Discovery, search, availability
      tenant/                Profile, preferences, saved homes, visits
      user/                  Clerk user synchronization and role changes
      webhooks/clerk/        Signature-verified Clerk webhook
      health/                Application health check
  features/
    auth/                    Session state, login UI, role guard
    properties/              Search, cards, property detail UI
    tenant/                  Profile, saved homes, visit UI and state
    landlord/                Listing management and visit UI and state
    admin/                   Administrative UI and state
  server/                    Server-only code; never import into client UI
    modules/                 Domain-specific database models and services
      admin/
      landlord/
      property/
      tenant/
      user/
      visit/
    config/                  Server environment access
    db/                      Shared MongoDB connection and model registration
    http/                    API authentication, responses, error handling
    storage/                 Multipart parsing and Cloudinary streaming uploads
    validation/              Zod schemas
  components/
    layout/                  Header, footer, sidebar, shared shell
    feedback/                Shared loading UI
    ui/                      Reusable UI primitives
  providers/                 Application provider composition
  lib/                       Shared client HTTP configuration and utilities
  hooks/                     Shared React hooks
  data/                      Static reference data
  styles/                    Global styles and design tokens
  proxy.ts                   Clerk session integration
public/images/               Static assets
scripts/                     Database seed and API verification commands
tests/server/                Server migration regression checks
docs/                        Supporting project documentation
```

Route files handle HTTP requests or compose page layouts. Client feature folders contain `components/`, `context/`, `services/`, and `utils/` as needed. Feature `services/` are browser HTTP clients; `src/server/modules/` contains database and business logic. Server modules are protected with `server-only` imports.

## Setup

Use Node.js 20.9 or newer:

```sh
npm ci
```

Copy `.env.example` to `.env.local`, then fill in:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Browser Clerk configuration |
| `CLERK_SECRET_KEY` | Server Clerk API access; same Clerk instance as the public key |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Verify Clerk webhook signatures |
| `ADMIN_EMAIL` | Email allowed to receive the admin role |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DNS_SERVERS` | Optional comma-separated DNS servers for MongoDB SRV discovery when the system resolver fails |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account |
| `CLOUDINARY_API_KEY` | Cloudinary API access |
| `CLOUDINARY_API_SECRET` | Cloudinary server secret |

Only the publishable key belongs in a `NEXT_PUBLIC_` variable. API calls use the same origin at `/api`; no backend URL, CORS configuration, or second process is needed.

```sh
npm run dev
```

Open `http://localhost:3000`. Register Clerk webhooks at `https://your-domain/api/webhooks/clerk`, using the signing secret from that endpoint. Existing API URLs under `/api/v1/` are internally rewritten to the corresponding `/api/` handler.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the UI and API together in Next.js |
| `npm run build` | Build the complete application and check TypeScript |
| `npm start` | Run the production build |
| `npm run lint` | Check frontend and server code |
| `npm run typecheck` | Check server and route TypeScript |
| `npm run test:server` | Run server regression checks without a live database |
| `npm run test:api -- http://localhost:3000` | Check native routes against a running app |
| `npm run seed` | Populate the configured database with sample data |

The seed command writes sample records into the database specified by `MONGODB_URI`; run it only when sample data is wanted. Environment loading uses Next.js conventions. There is one root package manifest and npm lockfile.

## Authentication and API behavior

Clerk verifies the session in API handlers before protected database operations. Client role guards control page access; server services enforce administrative access and ownership. User-editable signup metadata cannot grant the admin role. Toggling property availability requires the property's landlord.

The API keeps the response shape `{ success, message, data }` used by the existing UI. Validation and authentication failures return JSON errors with appropriate HTTP status codes. Public property reads remain available without login. Database connections are established on demand and shared across requests.

Property uploads use `request.formData()` and stream image buffers to Cloudinary without temporary files or Multer. A request can contain up to 10 images, each up to 10 MiB, with a combined limit of 25 MiB. Your hosting provider may impose a smaller request limit.

The Clerk webhook verifies the original request body before connecting to the database or processing an event. It handles user creation, updates, and deletion through the same server services as the API.

## Deployment

Deploy the repository root as a Next.js Node application:

```sh
npm ci
npm run build
npm start
```

Configure all variables from `.env.example` on the host. The Clerk publishable key must be present when building. Set the Clerk application URLs and webhook destination to the deployed app's origin. Static export is unsuitable because API routes, database access, and Clerk run on the server.

`render.yaml` now builds and serves the entire application from the repository root and checks `/api/health`. The existing Render service name is retained to target the existing service. No remote deployment or Blueprint sync is performed by these changes.

## Migration verification

The separate Vite and Express applications have been replaced by one Next.js app. Existing page URLs and API aliases are preserved. The database seed entry point is now `scripts/seed.ts`; the original data-model notes are preserved in [docs/data-model.md](docs/data-model.md).

Verification passed for the production build, lint, TypeScript, six server regression checks, and native API smoke checks covering health, 30 protected requests, versioned aliases, invalid IDs, unsigned webhook rejection, and unsupported methods. Chrome checks passed for home and property navigation, dynamic-route refresh, and tenant/landlord/admin login guards without browser runtime errors. Property UI checks used an API fixture. The Render configuration matches the current official JSON schema.

The local system resolver refused MongoDB SRV queries. Setting `MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8` in the ignored `.env.local` resolved the connection; live property reads now succeed with 88 available properties. The setting affects DNS queries in the application process and does not change operating-system DNS settings. Other environments can use their normal resolver by omitting this variable.
