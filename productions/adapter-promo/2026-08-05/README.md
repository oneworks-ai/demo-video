# Adapter promo production — 2026-08-05

This directory is the portable production record for the approved four-variant Adapter promo.

- `manifest.json` binds each raw recording and reviewed 1080p master by SHA-256 and ffprobe metadata.
- `evidence/<variant>/cursor-timeline.json` preserves every composited pointer event.
- `evidence/<variant>/cursor-continuity.json` preserves the fail-closed motion report.
- `evidence/<variant>/stills.json` preserves the per-second review index with portable `process://` paths.
- `review/` contains the raw poster, per-variant contact sheet, matrix contact sheet, and representative camera transition.

Raw recordings and full-HD video bytes are intentionally not committed. Re-run the archive command against the retained local production directory to verify that its hashes still match:

```bash
pnpm demo-video archive-adapter-promo \
  --source-root /path/to/oneworks-adapter-promo-matrix \
  --output productions/adapter-promo/2026-08-05
```

The archive command normalizes source-root paths and rejects unresolved `/Users/<name>` paths before writing JSON.
