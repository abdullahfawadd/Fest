# FlowFest Shuffle

- **Target** — Shuffle interaction at the [FlowFest homepage](https://www.flowfest.co.uk/).
- **Destination** — React marketing page with GSAP animation at `/`.
- **Fidelity** — Pixel-faithful intent. Use matching capture inputs and record measurement deviations.

One click moves the front card to the back. The source uses a 200 ms exit to 115% of the card width, alternates the resting angle by three degrees, and returns the card with a one-second elastic tween. Use the same initial stack on the live and local routes. [Source interaction](https://slater.app/14984/39049.js)

## Capture setup

Reanimate upstream revision [3f7a55a](https://github.com/NiazMorshed2007/reanimate/tree/3f7a55a2986a84ca2173e86ee9127eefe31d046d) was run from a temporary checkout. It used its bundled script dependencies and Playwright Chromium. On Windows, the helper points to the installed `ffmpeg.exe`.

Both captures use a 1440 × 900 viewport, a 4,300 ms settle time, a click on `button[data-stacked-cards="next"]`, 120 ms of pre-roll, and 1,300 ms after activation. The virtual clock runs at 25 FPS with seed 42. The tracked nodes are `[data-stacked-cards-item]` and `[data-stacked-cards-card]`.
