# Talaash web

Next.js App Router frontend for Talaash. See the [project README](../README.md) for full setup, architecture, API configuration, authentication, and deployment instructions.

```sh
npm ci
# Copy .env.example to .env.local and fill in Clerk keys and API_URL.
npm run dev
```

The development server runs at `http://localhost:3000`. Run the backend separately. Other commands: `npm run lint`, `npm run build`, and `npm start`.

`src/app/` owns routing and layouts. Domain UI, context, and HTTP services live together under `src/features/`. Shared UI lives in `src/components/`, shared HTTP configuration in `src/lib/api/`, and global styles in `src/styles/`. Static assets are served from `public/`.
