# Known limitations and continuation

See the [visual QA report](visual-qa-report.md) for measured fidelity by route, viewport, and section. The scope of each capture matters when judging pixel parity.

- The marketing page uses native scrolling with the original visual states and GSAP interactions. The source uses Lenis for scroll smoothing.
- The newsletter hands submissions to the original Mailchimp provider. Browser tests intercept the request and verify the submitted fields without enrolling an address.
- The Luma page displays captured original confetti frames by breakpoint. The live listing animates those particles with WebGL.
- The venue uses a keyless Google Maps embed and the verified original map link. Map rendering depends on Google's availability and can differ from the original keyed embed.
