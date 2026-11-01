# Production hosting after the Next.js migration

The repository now contains one Next.js application. Deploying its root to Vercel can host both the web pages and the API routes. Vercel builds the repository and packages the server code imported by the API routes into server functions.

| Code or data | Runtime or service |
| --- | --- |
| Client components and browser JavaScript | User's browser; assets served by Vercel |
| Page rendering and `src/app/api/**/route.ts` | Next.js on Vercel |
| `src/server/` models, services, validation, uploads | Server code imported by those routes on Vercel |
| Database records | MongoDB Atlas |
| Property image files | Cloudinary |
| Accounts and sessions | Clerk |

For example, the browser calls `/api/property` on the website's own domain. The Next.js handler imports the property service, which connects to MongoDB using server environment variables and returns JSON. The browser never receives the database credentials or server modules.

## Move the existing Vercel project

1. Set the Vercel project's Root Directory to the repository root, replacing the old `frontend` setting.
2. Select the Next.js framework preset, replacing Vite. Use `npm run build` and the default Next.js output settings, replacing any old `dist` output override.
3. Configure the production variables listed in the root `.env.example` in Vercel. The server secrets currently configured on Render do not automatically transfer. Local `.env.local` is ignored by Git and is not deployed.
4. Configure MongoDB Atlas network access for the deployment's runtime.
5. Update Clerk's application URLs to the website's production origin and its webhook endpoint to `https://your-domain/api/webhooks/clerk`. Use that endpoint's signing secret on Vercel.
6. Deploy and verify the new Vercel application before retiring the old Render backend.

Only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is public browser configuration. Keep the database URI, Clerk secret, webhook secret, and Cloudinary secret as server environment variables.

The repository migration has not changed either remote hosting service or deployed this code. The live websites run whichever revisions were last successfully deployed. Connected Git deployment triggers still need the updated root and build settings.

## Render alternative

The existing `render.yaml` now builds the repository root and starts the complete Next.js application. If applied, the service named `talaash-backend` would serve both UI and API despite retaining its old name. This is an alternative to hosting the entire application on Vercel; the current code does not send API requests to a separate Render server.

## Image upload limit

The current API accepts multipart image uploads and allows larger batches than Vercel's 4.5 MB function payload limit. On Vercel, larger batches require a change such as direct browser uploads to Cloudinary with server-issued signatures, or a smaller total upload limit including multipart overhead. The current upload implementation should be adjusted before treating the Vercel cutover as complete.

References: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [environment variables](https://vercel.com/docs/environment-variables), [function payload limits](https://vercel.com/docs/functions/limitations#request-body-size).
