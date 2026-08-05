# Demo Video Agent Guide

This repository owns reusable One Works video-production behavior and creative history.

## Module map

- Recording, cursor, camera, stills, and media validation: `src/recorder.ts`
- Reusable interaction journeys: `src/scenarios.ts`
- Safe synthetic Desktop demo data: `src/desktop-fixtures.ts`
- Intro and delivery assembly: `src/postproduction/`
- Machine-readable production inventory: `catalog/`
- Human creative rationale and revision decisions: `docs/creative/`
- Addition and publication process: `docs/workflow.md`

App-specific Electron process control, dev-service coordination, Desktop Control, workspace startup, and Chrome Driver integration remain in `oneworks-ai/app`. Keep those integrations thin and import the reusable implementation through the `assets/demo-video` submodule.

Every new public video needs all of the following in one change: a catalog entry, a creative record, executable scenario or post-production code, safe fixture policy, output/display-surface inventory, and validation evidence. Do not commit full-HD masters, personal paths, account data, or private recording artifacts.

Run `pnpm check` before delivery. Media-changing work also requires decoding every language/theme variant and visually reviewing representative desktop and mobile presentation surfaces.
