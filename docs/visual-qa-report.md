# Visual QA

The Playwright suite tests both routes using Chromium at device scale factor 1, in light mode, with British English formatting and the Europe/London time zone. Pixelmatch compares the reference and local PNGs with the same viewport and browser settings.

## Coverage

| Viewport | Dimensions |
|---|---:|
| Small mobile | 320 × 700 |
| Mobile | 360 × 800 |
| Mobile | 375 × 812 |
| Mobile | 390 × 844 |
| Large mobile | 430 × 932 |
| Tablet portrait | 768 × 1024 |
| Tablet landscape | 1024 × 768 |
| Laptop | 1280 × 800 |
| Desktop | 1440 × 900 |
| Large desktop | 1920 × 1080 |

Every viewport has an initial screenshot and a full-page screenshot. The 390, 768 and 1440 px widths also capture individual sections. Playwright lets the FlowFest opening animation settle before the initial screenshot, then scrolls through the page before the full-page capture so lazy-loaded content can render. Both Luma captures use the same fixed clock for the header time. FlowFest uses a running clock so GSAP timing can advance. There are no masks.

## Reproduction

```sh
npm ci
npx playwright install chromium
npm run test:e2e
npm run test:visual
npm run visual:compare
```

`PLAYWRIGHT_BASE_URL` runs the local-side tests against a deployed build. Set `PLAYWRIGHT_VISUAL_TARGET` to `reference`, `local`, or `both` to control which screenshots to capture. Capture directories are keyed by site and viewport under `visual-qa/reference`, `visual-qa/local`, and `visual-qa/diff`.

The [Pixelmatch table](../visual-qa/reports/pixelmatch.md) and [JSON measurements](../visual-qa/reports/pixelmatch.json) are written by the comparison script. The target is less than 2% mismatch per pair. Antialiasing differences count and pixels outside the shared image dimensions count as mismatches. Set `STRICT_VISUAL_QA=1` to fail the command when any pair is missing or misses the target.
