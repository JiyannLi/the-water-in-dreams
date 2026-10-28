# Resource research

2026-10-29. Native Three.js selected to avoid framework overhead.

| Candidate / original source | License | Decision / compatibility / cost |
|---|---|---|
| https://github.com/mrdoob/three.js — Water addon | MIT (package LICENSE retained) | Adopt: animated normals, real planar reflection; one extra scene pass. |
| Same repository — Sky | MIT | Atmospheric scattering candidate; use a restrained custom gradient for reference palette in prototype. |
| Same repository — FogExp2 | MIT | Adopt: cheap consistent distance haze, no volumetric pass. |
| Same repository — PointerLockControls | MIT | Adopt: mature desktop look control. Add bounded movement and solid building collision. |
| Same repository — UnrealBloomPass | MIT | Deferred: preserve facade detail and avoid unnecessary render passes. |
| https://kenney.nl/assets/city-kit-suburban | CC0 advertised by Kenney; download/license not verified here | Platform request returned proxy 403. Suburban silhouettes also differ from classical reference. Not imported. |
| https://polyhaven.com/models | CC0 platform candidate; individual assets not verified | No verified close classical mansion selected; no binary imported. |
| https://sketchfab.com/search?type=models&q=classical%20mansion | Per-model licensing | No authorized downloadable matching asset established; not imported. |

Official Three.js LICENSE endpoint successfully reached. Installed package implementation is the authoritative code examined. Architectural placeholder is original procedural geometry and remains a fidelity limitation, not a substitute for final art approval. No unknown-license assets used. A matching licensed mansion remains required for the high-fidelity milestone.

## Phase 1.5 review
- Poly Haven model API (`https://api.polyhaven.com/assets?t=models`): CONNECT denied by proxy (403). No model listing or license verified, no model imported.
- Three.js LittlestTokyo candidate: guessed model README URL returned 404; no license inferred from parent repository. Stylized commercial-city subject would also require extensive remodelling, so not selected.
- Existing building: zero external license uncertainty, compatible with existing collision and composition. Selected local refinement (weathered plaster, side windows, attic oculi, cornice and shadows). Lower integration cost, but still less realistic than a scanned/modelled historic building; high-fidelity asset milestone remains open.
- Three.js BufferGeometryUtils.mergeGeometries: MIT, installed official addon. Adopt to combine static geometry by material. Retains shadow and reflection compatibility; sacrifices per-object culling, acceptable for this bounded scene.
