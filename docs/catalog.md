# Video catalog

The canonical machine-readable index is [`catalog/videos.json`](../catalog/videos.json). Each entry points to its detailed creative record and describes where the current derivatives are displayed.

The cross-video capture and validation contract lives in [Recording standards](./recording-standards.md).

## Adapter promo

[`adapter-promo`](./creative/adapter-promo.md) introduces One Works as the front door to multiple AI coding adapters, then proves the claim using the real Desktop launcher, workspace window, and Adapter selector.

## Adding a video

Add one coherent change containing:

1. A stable video ID and entry in `catalog/videos.json`.
2. A `docs/creative/<id>.md` record with goal, audience, visual grammar, storyboard, safe-data policy, and revision decisions.
3. An executable scenario, post-production module, or both.
4. Named fixture data when the real UI could expose personal or machine identity.
5. A language/theme matrix and deterministic output naming.
6. Every README, documentation, social, store, or campaign surface that consumes the output.
7. Decode, duration, dimensions, integrity, privacy, and representative visual-review evidence.

Update the existing entry instead of creating an unlinked replacement when a video is revised. Preserve material design decisions in the creative record so later work can explain why the current form exists.
