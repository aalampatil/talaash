# Contributing to Talaash

Contributions to documentation, accessibility, bug fixes, and features are welcome. Participation is covered by the [code of conduct](CODE_OF_CONDUCT.md).

## Before you start

Search existing issues and pull requests to avoid duplicate work. Use an issue template to describe a bug or propose a feature. For a large change, discuss the problem and proposed approach in an issue before implementing it. Small fixes and documentation improvements can go straight to a pull request.

Report suspected vulnerabilities privately as described in [SECURITY.md](SECURITY.md), rather than in a public issue or pull request.

## Local development

1. Fork the repository and clone your fork, or clone the repository if you have write access.
2. Use Node.js 20.9 or newer and run `npm ci` from the repository root.
3. Copy `.env.example` to `.env.local` and configure the values described in the [README](README.md#setup).
4. Use development Clerk, MongoDB, and Cloudinary resources with sample accounts and data. Never use someone else's personal data in a report, fixture, or screenshot.
5. Create a branch with a descriptive name, such as `fix/property-search`.
6. Run `npm run dev` and open `http://localhost:3000`.

The UI and API run in one Next.js process. Do not commit environment files, credentials, database exports, or generated build output. The seed command writes to the database configured by `MONGODB_URI`; use it only with a database intended for sample data.

## Project conventions

- Use TypeScript and follow the style of nearby code.
- Keep route handlers and page files focused on HTTP handling and page composition.
- Put client feature code in `src/features/` and database and business logic in `src/server/modules/`.
- Keep server-only modules out of client imports.
- Enforce authentication, roles, and resource ownership on the server, and validate incoming data.
- Preserve the API response shape `{ success, message, data }` and existing route compatibility unless a change is explicitly agreed upon.
- Keep changes focused. Include documentation for changes to setup, configuration, or behavior.
- Add or update regression checks when behavior changes, especially around authorization, validation, uploads, and visit handling.

## Verification

Run these checks before submitting a code change:

```sh
npm run lint
npm run typecheck
npm run test:server
npm run build
```

The production build requires the Clerk publishable key in the build environment. Server regression tests do not require a live database.

For API changes, also run the app and then run this in another terminal:

```sh
npm run test:api -- http://localhost:3000
```

Use a local development instance for smoke checks. For UI changes, verify the affected flow in a browser, including loading and error states, keyboard access, and a narrow viewport. Include screenshots when they help reviewers understand a visual change.

For documentation-only changes, check spelling, links, commands, and consistency with the project. Application builds are unnecessary unless the documentation change also modifies code or configuration.

For discovery, navigation, or authentication page changes, run the desktop and mobile browser checks with `npm run test:ui`. Install the browser once with `npx playwright install chromium`, or set `PLAYWRIGHT_CHANNEL=chrome` to use an installed Chrome browser. See [the interface guide](docs/design.md#verification) for test coverage and the limits of signed-out fixture checks.

## Pull requests

Open a pull request against the repository's default branch and complete the [pull request template](.github/pull_request_template.md). Describe the problem, the resulting behavior, and how you verified it. Link related issues and note any configuration changes, migrations, limitations, or checks you could not run.

Use a descriptive title, keep the diff focused, and respond to review feedback. Draft pull requests are welcome for work in progress. Maintainers may request revisions or decline changes that do not fit the project.

By submitting a contribution, you agree that it may be distributed under this repository's [MIT License](LICENSE). Only contribute material you have the right to share.
