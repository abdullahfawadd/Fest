# FlowFest Shuffle

- **Target** — Shuffle interaction at the [FlowFest homepage](https://www.flowfest.co.uk/).
- **Destination** — React marketing page with GSAP animation at `/`.
- **Fidelity** — Pixel-faithful intent. Use matching capture inputs and record measurement deviations.

One click moves the front card to the back. The source uses a 200 ms exit to 115% of the card width, alternates the resting angle by three degrees, and returns the card with a one-second elastic tween. Use the same initial stack on the live and local routes. [Source interaction](https://slater.app/14984/39049.js)

## Capture setup

Reanimate upstream revision [3f7a55a](https://github.com/NiazMorshed2007/reanimate/tree/3f7a55a2986a84ca2173e86ee9127eefe31d046d) was run from a temporary checkout. It used its bundled script dependencies and Playwright Chromium. On Windows, the helper points to the installed `ffmpeg.exe`.

Both captures use a 1440 × 900 viewport, a 4,300 ms settle time, a click on `button[data-stacked-cards="next"]`, 120 ms of pre-roll, and 1,300 ms after activation. The virtual clock runs at 25 FPS with seed 42. The tracked nodes are `[data-stacked-cards-item]` and `[data-stacked-cards-card]`.

## Results

| Measurement | Result |
| --- | --- |
| Frames compared | 37 of 37 at 25 FPS with zero alignment offset |
| Mean pixel mismatch | 1.56% against a 2% target |
| Motion start, end, duration and peak offset | 0 ms at the capture's 40 ms frame interval |
| Highest single-frame mismatch | 8.1% at 0.28 and 0.32 seconds |

The timing measurement uses the change in pixels between successive viewport frames. It includes the click scroll and the animated marquee. The mean reflects the whole sequence, including the early transition frames with higher differences.

Local evidence is in `reference/`, `local/`, and `comparison/` beneath this directory. The comparison contains the per-frame report, diff PNGs, and two labeled side-by-side sheets.
