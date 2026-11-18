# Luma reference audit

Inspected the public listing in Chromium at 1440 × 900, 768 × 1024, and 390 × 844. The listing was served publicly with HTTP 200 and rendered in its dark orange confetti theme. [Official listing](https://luma.com/aq1a429h)

## Layout and event state

- The global header contains Luma’s mark, local time on wider screens, Discover Events, and Sign In.
- At 1440 px the content is centred in a 960 px wrapper with 16 px side padding, a 330 px left rail, and a 32 px gap. At 768 px the cover is 280 px wide and the gap is 24 px. At 390 px the cover and content stack with 16 px gutters.
- Desktop places host profiles, attendance, and event actions below the cover. The responsive copy appears below Location on mobile. The reference keeps both groups in the DOM and uses breakpoint styling to show one group at a time.
- The visible host list is Isabel, Benn Raistrick, Rachael Ward, Joshua Fry, and Scott Humphrey. The attendee preview says 120 Went and names Dennis Snellenberg and Lizzie Curtis.
- The event took place on Friday, 8 August 2025, from 9:00 AM to 4:30 PM GMT+1. The sole ticket state is Sold Out. The listing displays the message “This event is sold out and no longer taking registrations.”
- About Event preserves the short paragraphs, recap, and organiser email. The Location card displays Blue Peter Garden, Salford, Manchester M50 2HF, UK and a map preview.
- The footer includes Discover, Pricing, Help, social links, the support email action, and Get the App.

## Reproduction details

- The layout uses the observed responsive arrangement, source visual styles, native event content, and locally hosted original cover and portrait variants. Individual image and font sources are recorded in [Luma asset provenance](./luma-assets.md).
- The background uses original frames sampled from the source confetti canvas for mobile, tablet, and desktop. The archived frame remains still, while the reference particles move.
- Runtime account links point to the official destinations. Sign In uses [Luma’s sign-in page](https://luma.com/signin). The contact, report, and attendee controls open the [official event listing](https://luma.com/aq1a429h).
- The map preview uses Google Maps’ keyless public embed for the event coordinates. Both location links use the original place ID. Map imagery depends on the third-party embed’s availability.
- The local sold-out panel is static status information. Tickets, accounts, and payment are handled by the official service.
