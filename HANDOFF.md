# Dream 01 — Phase 1.5 handoff

## Delivered
Preserved native Three.js / Vite / TypeScript, official Water and PointerLockControls, bounded walking, reference view and Pages workflow. Neutral hemisphere fill + warm directional sun, PCF soft shadows cached for static geometry; gray plaster with seeded grain/weathering/water stains. Added side facade windows, cornice/dentils, attic oculi and entrance arch. More irregular island outline. Replaced periodic sine normal map with seamless multiscale seeded noise. Sky horizon uses fog color in the same output color space. Revised reference framing; H / ?capture hide all UI. Removed peaceful wording without adding reactive events, life or future-phase features.

Static meshes merged by material with official MIT BufferGeometryUtils: last-pass draw calls reduced from recorded 626 to 26. Full multi-pass GPU cost is not captured by that last-pass count.

## Validation
- TypeScript and GitHub Pages subpath production build pass. Bundle warning remains (~540 kB minified).
- Actual system Chromium 1554×1080 capture, no console/page errors.
- Pointer lock succeeded; W changed position; P returned exactly [23,13.5,108]; high/low quality toggles work. Fixed async pointer-unlock reference-height drift.
- Cloud headless software renderer measured ~4 FPS high / ~5 FPS low. No 60 FPS claim. Previous 20 FPS measurement used clamped delta and was misleading; now uses actual elapsed time. Hardware GPU testing remains required. High draw-call reduction does not prove frame-rate improvement.
- Interactive long-distance collision, mouse latency and 1080p desktop GPU profiling remain manual checks. No claim of complete movement acceptance.

## Art review and evidence
artifacts/before-phase-1-5.png is the previous real screenshot. phase-1-5-clean.png and phase-1-5-ui.png are new real screenshots. comparison.html places before/after side by side; camera framing changed intentionally. User's original reference image is accessible visually in the chat but no local source file was available for inclusion; no fake original generated.

Gray facade, readable direction/shadows and seamless horizon are improved; original photo-level realism is NOT met. Geometry remains visibly procedural, roof cupola and dead trees need richer modelling, distant buildings are still simplistic, material weathering needs authored PBR assets. No licensed matching building could be acquired from the restricted asset endpoints. No new third-party model imported. Prioritize authorized classical facade/roof assets and distant silhouette variety next; do not expand to Phase 2/3.

## Deployment
Existing GitHub Actions Pages workflow builds main. Prior deployment API and public site checks were blocked by network policy. Pushing source is not proof that Pages published successfully.
