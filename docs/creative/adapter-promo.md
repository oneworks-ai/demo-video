# Adapter promo creative record

## Intent

Show that One Works is a single workspace for multiple AI coding adapters, then immediately support the abstract claim with a real product journey. The video is designed for GitHub README, the One Works documentation site, and short-form social reuse.

## Visual grammar

The opening uses the One Works icon as the visual origin. It moves toward the viewer and grows continuously. Claude Code, Codex, Copilot, Gemini, Kimi, and OpenCode emerge from behind it, spread in depth, scale with the main icon, and fade to zero as the group passes the camera plane. The compositor adds no cards, titles, or icon background plates.

The abstract sequence hands off to real pixels: first the One Works launcher, then the workspace window at matching geometry, then the real Adapter selector. The application window rises into view rather than being redrawn in post-production.

## Storyboard and timing

1. `0.0–3.8s`: One Works and adapter depth intro. Adapter icons remain behind the One Works mark, scale together, and fade while approaching the viewer.
2. Launcher: a centered real Electron launcher is already stable before the cursor begins its journey.
3. Workspace transition: the selected workspace opens in a real BrowserWindow with the same visual bounds as the launcher.
4. Adapter reveal: the cursor leads the action, the camera begins moving before input, and the real Adapter selector opens only after the click animation is visible.
5. Final hold: keep the selector readable for 4.5 seconds.

The Adapter reveal uses a `1.55×` camera push over `1300ms`, focused near the actual selector with narrow scene offsets (`x=70`, `y=55`). Camera motion applies to the already captured system window and composited cursor; it never replaces the product UI.

The real launcher begins sliding upward at `3.0s` and settles over `800ms`, overlapping the fading intro instead of appearing on a hard cut.

## Real-window and cursor contract

- Record from a dedicated macOS display after proving the launcher/workspace pixels are present.
- Keep launcher and workspace bounds consistent; center the initial window on the target display.
- Convert AppKit bottom-origin display coordinates to Electron and capture top-origin coordinates.
- Start cursor movement before the input event. Complete pointer press/release feedback, leave a short visual-to-input buffer, then send the real event.
- Compensate system-capture startup latency before compositing cursor events.
- Begin the camera push as the pointer approaches the Adapter control, not after the selector has opened.

## Locale and theme matrix

The approved matrix is `light-en`, `dark-en`, `light-zh`, and `dark-zh`. Visible launcher, workspace, loading, and selector text must match the variant language. All four variants use the same app build, fixture, geometry, storyboard, and post-production timing.

README presentation uses locale-specific `<picture>` sources so GitHub selects only the matching light or dark GIF. The docs site mounts one locale/theme MP4 at a time; its explicit theme selector is authoritative and must not be inferred only from the OS color preference.

## Safe demo data

The named fixture is `adapter-promo`. It exposes the synthetic path `/Users/oneworks/Projects/oneworks-demo` and identity `demo@oneworks.ai`, while mapping the action to an isolated local workspace. Private configuration layers are disabled. Data replacement happens at the Launcher/Workspace source and a narrow page projection, never as a privacy mask over real pixels.

No output may contain a real account, home path, directory list, email, token, login state, or temporary machine path.

## Outputs and display surfaces

Full-HD masters are 1920×1080, 30fps, about 21 seconds, and stay in the local release archive. Documentation derivatives are H.264 `yuv420p`, 1280×720, 24fps, about 21 seconds, no audio, fast-start, and approximately 1.0–1.1MB.

Current public destinations are:

- `oneworks-ai/app/README.md`: English theme-aware GIF.
- `oneworks-ai/app/README.zh-Hans.md`: Chinese theme-aware GIF.
- `oneworks-ai/app/.oo/docs/index.md` and `.oo/docs/en/index.md`: locale/theme-aware playable MP4 with GIF fallback.
- `oneworks-ai/app/.oo/docs/usage/desktop.md` and `.oo/docs/en/usage/desktop.md`: locale/theme posters.
- Live routes `/docs/` and `/docs/en/` on `oneworks.cloud`.

The exact media directories are `.oo/docs/images/adapter-promo/`, `.oo/docs/images/adapter-promo/posters/`, and `.oo/docs/videos/adapter-promo/` in the app repository.

## Revision decisions and reusable lessons

- Prototype one representative variant; generating four variants before approval multiplies the same defect.
- Use real application windows and overlays. A simulated launcher, workspace, or selector is not acceptable evidence.
- A dedicated display existing and being authorized does not prove it is visible in the active Space; verify captured pixels.
- Recording permissions belong to the process that captures the display. Reopening or moving the window may be necessary after macOS privacy changes.
- UI state must follow cursor motion. System capture starts later than the process call, so uncorrected timestamps make clicks appear to happen after the UI response.
- Protect privacy by preparing synthetic data, not by adding a mask. A mask also hides useful product behavior and can miss brief exposed frames.
- GitHub README theme selection and the docs site's explicit theme picker are different systems. The docs page must mount and play only the selected video.
- Raw HTML links are not always transformed by a documentation bundler. Media must use a verified asset path or a component that participates in the build.
- Commit compact web derivatives, not full-HD masters. Keep the master archive local but record its specification and lineage here.
- The first approved intro was assembled during iterative local composition and its exact exploratory one-off command was not preserved. `src/postproduction/adapter-intro.ts` formalizes the accepted motion from the reviewed master and contact sheets. Future production must start from a committed script revision so this gap cannot recur.

## Archived production evidence

The sanitized 2026-08-05 production record is under `productions/adapter-promo/2026-08-05/`. It contains all four cursor timelines and continuity reports, portable still manifests, raw posters, contact sheets, video hashes, and ffprobe metadata. It intentionally excludes the raw and full-HD video bytes; the hashes bind the archive to those reviewed local masters without placing large binaries or private paths in Git.
