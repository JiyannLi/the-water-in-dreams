# The Water in Dreams / 梦的含水量
Dream 01 — The Drowned Town. Desktop Three.js exploration prototype.

## Run
Node 22+ recommended. `npm ci`, then `npm run dev`. `npm run build` checks TypeScript and builds production files in dist.

Click 进入梦境; WASD move, mouse look, Shift accelerate, Esc pause, P reference camera. Add `?debug` for atmosphere controls. Quality button reduces pixel ratio. Interior is closed.

## Structure
- src/main.ts: scene, official Water reflection, architecture prototype, input and collision
- src/style.css / index.html: minimal entry overlay
- artifacts/reference.png: actual browser capture
- RESOURCE_RESEARCH.md / ASSET_SOURCES.md: research and licensing
- HANDOFF.md: verification and remaining work

Native Three.js + TypeScript + Vite; lil-gui only exposes controls in debug mode. Architecture remains procedural placeholder art. This is not final high-fidelity visual acceptance.

## GitHub Pages preview
`.github/workflows/pages.yml` builds on pushes to main or manual dispatch, using the repository subpath `/the-water-in-dreams/`. Enable Settings → Pages → Source: GitHub Actions in the repository, then push the source and workflow to main. The successful deployment job reports the real preview URL. No deployment is confirmed until that job succeeds.
