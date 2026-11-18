# FlowFest ’25

A React and TypeScript reconstruction of the 2025 FlowFest marketing site and public event listing. The marketing site lives at `/`. Every Buy Tickets link opens `/tickets`, which shows the archived sold-out listing. Account and event actions open the official Luma service.

## Run locally

With Node.js 24 and npm installed:

```sh
npm ci
npm run dev
```

## Verify

```sh
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:visual
npm run visual:compare
```

Visual captures and diffs are written under `visual-qa/`. The public references must be reachable to regenerate them. See the [visual QA report](docs/visual-qa-report.md) for the viewports, method, and measurements.

## Project notes

- [Project audit](docs/project-audit.md) and [implementation plan](docs/implementation-plan.md)
- [FlowFest reference](docs/reference-audit.md) and [Luma reference](docs/luma-reference-audit.md)
- [Asset manifest](docs/asset-manifest.md) and [interaction inventory](docs/interaction-inventory.md)
- [Known limitations and continuation](docs/remaining-issues.md)

Vercel builds the project with the committed npm lockfile and serves `dist/`. The route rewrite in `vercel.json` resolves direct requests for `/tickets`.
