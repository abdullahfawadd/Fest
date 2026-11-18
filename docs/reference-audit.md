# FlowFest reference audit

The public website was inspected for the original section order, accessible text, assets, CSS breakpoints, DOM structure, and GSAP behavior. The source was published through Webflow and uses custom Slater CSS and motion code. Site-owner permission to reproduce the references and reuse the assets was confirmed by the requester. [FlowFest reference](https://www.flowfest.co.uk/)

| Order | Section | Verified content and behavior |
| --- | --- | --- |
| 1 | Header | FlowFest logo, About, Speakers, Activities, and Buy Tickets. Section navigation moves to the corresponding page anchor. The original mobile layout shows the logo and ticket link. |
| 2 | Welcome | Friday 8 August in Manchester, original stacked event photography, rainbow illustrations, animated Sunny mascot, introductory message, and Shuffle. The stack also supports horizontal dragging. |
| 3 | Sponsors | Repeating sponsor strips with original logo vectors and outbound links. |
| 4 | About | Web designers and developers heading, original text, rounded photographic tiles, and a modal to watch the 2024 recap. |
| 5 | Speakers | Vlad Magdalin, Ilja van Eck, Cassie Evans, Stephanie Bruce, and Ross Plaskow. The original cards include portraits, discipline tags, bios, and desktop hover treatment. |
| 6 | Activities | Expert Talks, Fun + Games, Food + Drink, Live Music, and Community. The activities reuse images from the introductory stack. |
| 7 | Community and organisers | Community-led nonprofit event description, ticket link, and portraits and names of Isabel Edwards, Josh Fry, Benn Raistrick, Scott Humphrey, Rachael Ward, and John Ostler. |
| 8 | Testimonials | Five original testimonial graphics in the Flowfest Love section. |
| 9 | FAQ | Five accordion questions covering discounts, travel, food, what to bring, and the afterparty. The accordion closes an open item when a different item opens. The discount answer contains the fourth ticket link. |
| 10 | Final ticket section | Original photo, campaign heading, event text, and fifth ticket link. |
| 11 | Contact and newsletter | Isabel's contact address, original first-name and email fields, and newsletter artwork. The original reference has no visible social-link row in this footer. |

The reference uses viewport-based typography with breakpoint changes at 991, 767, and 479 CSS pixels. The original shared CSS, custom CSS, responsive image candidates, and original font files are included locally. Inline SVGs preserve the original layer order and are animated through their original element selectors. [Webflow styles](https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/css/flowfest-2025.webflow.shared.d5970e214.css) · [Custom styles](https://slater.app/14984/39050.css) · [Asset origins](flowfest-asset-sources.tsv)

Shuffle moves the lead photograph out of the stack over 0.2 seconds at 1.15 times its width, moves the photo to the back, alternates the rotation between plus and minus three degrees, and settles the photo for one second with an elastic easing. A short drag snaps back. A drag exceeding ten percent of the card width advances the stack. The photographs cycle in sequence. [Original motion reference](https://slater.app/14984/39049.js)

All five ticket links render the original button artwork, point to `/tickets`, and use client-side navigation when activated normally. The recap loads YouTube on request and unloads when closed. Newsletter submissions use the original hosted form provider and receive their result directly from the provider. The published markup and assets are local. React and npm GSAP own interaction state, movement and route lifecycle. The page uses native scrolling with GSAP ScrollTrigger in place of Lenis and respects reduced-motion preferences for the introduction and artwork.
