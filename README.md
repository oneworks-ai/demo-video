# One Works Demo Video

[简体中文](./README.zh-Hans.md)

This repository is the source of truth for One Works product-video production. It keeps the reusable recorder, post-production code, safe demo fixtures, creative records, distribution inventory, and validation tests together so every published video can be traced back to its intent and implementation.

The repository is consumed by [`oneworks-ai/app`](https://github.com/oneworks-ai/app) as the `assets/demo-video` submodule. Product-specific launch, workspace, and Desktop Control integration remains in the app repository; reusable video behavior lives here.

## What is recorded

- `src/recorder.ts`: CDP and macOS system-capture recorder, cursor composition, camera focus, stills, and integrity checks.
- `src/scenarios.ts`: reusable user-journey scenarios.
- `src/desktop-fixtures.ts`: synthetic, identity-safe demo data contracts.
- `src/postproduction/`: reproducible intros, transitions, and delivery assembly.
- `catalog/`: machine-readable video identity, source, output, and display-surface records.
- `docs/creative/`: human-readable design rationale, storyboard, revision decisions, and validation evidence.

Start with the [video catalog](./docs/catalog.md), then read the creative record for the video you want to reproduce. The reusable capture contract is in [Recording standards](./docs/recording-standards.md).

## Development

```bash
corepack pnpm install
pnpm check
```

Render the Adapter promo intro and prepend it to a clean real-window recording:

```bash
pnpm demo-video render-adapter-promo \
  --recording /path/to/adapter-promo-recording.mp4 \
  --output /path/to/adapter-promo-final.mp4 \
  --theme dark
```

The full-HD masters are intentionally not committed. Published web derivatives remain in the app documentation tree, while their exact roles and locations are recorded here.
