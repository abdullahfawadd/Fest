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

## Verified results

Playwright passed all 32 end-to-end tests against the local production build. The responsive checks cover both routes at all 10 sizes and verify visible content, page width, and uncaught browser errors. The interaction tests cover the ticket links, FAQ, Shuffle, external destinations and Mailchimp form validation. Playwright intercepted the newsletter submission.

Playwright captured 20 reference and 20 local route and viewport combinations. The desktop Luma reference was recaptured successfully after the first attempt timed out looking up a section. Each side produced 94 PNGs, including the viewport, full-page and section files.

| Final viewport | FlowFest mismatch | Luma mismatch |
|---|---:|---:|
| 390 × 844 | 0.0000% | 18.8237% |
| 1440 × 900 | 0.0000% | 9.3619% |

The two FlowFest viewport pairs have exact RGBA equality. The Luma comparisons include separately timed confetti frames and the live map where it is visible. Both participate in the reported mismatch. See the complete report for full-page and section results.

## Refinement

The first Luma render used default font and text colours and let a decorative SVG widen the document. At 320, 360, 375 and 390 px, the extra scroll width measured 262, 222, 207 and 192 px, respectively. Restoring the reference theme and limiting the SVG fixed the overflow. Against the same 390 × 844 reference viewport frame, Pixelmatch dropped from 47.6048% before these changes to 22.9533% after the theme and SVG fixes. Matching the scrollbar colour and date formatting brought the final capture to 18.8237%. Animation frame timing also varies between captures.
