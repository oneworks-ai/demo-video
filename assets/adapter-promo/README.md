# Adapter promo inputs

The SVG files in `sources/` are synchronized from the canonical app adapter modules. The PNG files in `icons/` are transparent raster inputs for the reproducible ffmpeg compositor.

- `oneworks.png` is derived from `oneworks-ai/app/apps/desktop/build/icon.svg`.
- Adapter icons are derived from `oneworks-ai/app/assets/homepage/apps/homepage/src/assets/adapters/*.svg`.

The compositor preserves alpha and adds no card, tile, title, or background plate around an icon. An official logo may still contain its own intrinsic shape. Refresh these inputs from the canonical app assets when branding changes:

```bash
pnpm demo-video sync-adapter-icons --app-root /path/to/oneworks-ai/app
```

Then visually review both light and dark intro renders before updating the submodule pointer.
