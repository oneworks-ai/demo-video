# Architecture

The video system separates reusable production logic from product-specific control.

## This repository owns

- the capture engine and its integrity gates;
- reusable interaction scenarios;
- named synthetic fixture contracts;
- cursor and camera post-production semantics;
- branded intro and delivery assembly;
- creative intent, revision decisions, output identities, and display-surface history.

## The app repository owns

- One Works Electron lifecycle and workspace startup;
- Desktop Control and Chrome Driver bridges;
- local dev-service coordination;
- product fixture injection at the real data source;
- checked-in README and documentation-site derivatives.

`oneworks-ai/app` pins this repository at `assets/demo-video`. Its `pnpm tools` commands are stable integration surfaces and delegate reusable behavior into the submodule. This keeps application deployment independent while making every video build reproducible from an immutable pair of commits.

## Artifact boundary

Full-HD masters and raw captures are local release artifacts. Git stores source code, compact creative inputs, catalog records, posters, GIFs, and size-controlled documentation MP4 derivatives only where a public surface needs them. Catalog entries link those public derivatives back to their scenario, creative record, and intended presentation surface.
