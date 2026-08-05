# Production workflow

## 1. Prototype one representative variant

Build one language/theme variant first. Confirm the interaction path, real-window behavior, composition, cursor timing, camera motion, intro, and privacy treatment before multiplying the work.

## 2. Record real product behavior

Electron product footage must show the real launcher, the real workspace BrowserWindow, and the real product overlay. CDP drives actions and readiness; macOS system display capture supplies the pixels. Use a dedicated recording display and fail if the expected window is not visible there.

## 3. Use named safe fixtures

Prepare demo data at the product data source. Do not mask a real account after capture. A fixture may expose only synthetic values that cannot identify a person or machine, and it must map visible virtual paths to an isolated real workspace.

## 4. Generate the full matrix

After the representative variant is accepted, render `light/dark × zh/en` from the same app build, scenario, workspace geometry, fixture, and post-production timing.

## 5. Produce derivatives

- Keep 1920×1080 masters in the bounded local release archive.
- Generate language/theme GIFs for GitHub README theme selection.
- Generate H.264, `yuv420p`, fast-start, no-audio, size-controlled MP4s for the docs site.
- Generate posters for non-playing and low-bandwidth contexts.

## 6. Validate and register

Decode every variant, verify dimensions/duration/frame rate, check hashes and posters, inspect desktop/mobile display, audit visible text for private data, and update the catalog with every consuming surface. No video is complete if its creative intent or destination is undocumented.

## 7. Archive production evidence

Commit sanitized timelines, still manifests, probes, hashes, contact sheets, and representative posters under `productions/<video-id>/<date>/`. Never copy a local absolute path directly. Raw capture and full-HD video bytes stay outside Git unless the catalog explicitly adopts a Git LFS retention policy; the archive must still contain hashes that bind those bytes to the recorded production.
