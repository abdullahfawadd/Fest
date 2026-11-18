# Implementation plan

1. Inspect the live FlowFest and Luma pages, verify event facts, and capture desktop, tablet, and mobile states.
2. Catalog original assets and credentials-free destinations. Save approved public assets locally and preserve their intrinsic proportions.
3. Build the marketing and ticket pages within one React Router app. Implement marketing motion and controls, including Shuffle. Route all buy links through the shared ticket URL.
4. Keep the event registration closed and hand real Luma actions off to the official service.
5. Verify deep links, history, external destinations, keyboard controls, layout, and responsiveness in Chromium. Record frame and screenshot comparisons against live references, then repeat comparisons after fixes.
6. Build with the npm lockfile, push the verified source to GitHub, and verify both routes on Vercel.
