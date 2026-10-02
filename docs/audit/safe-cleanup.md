# Verified cleanup — 2 October 2026

## Deleted: 18 files

These 13 source files had no path from a Next.js entrypoint, test, script or Supabase function, including transitive dependencies. Repository text searches also found no external references outside the disconnected group. All deletions were tracked Git files and remain recoverable from Git.

- `src/components/campaign-creator/ui/CapacityFunnel.jsx`
- `src/components/campaign-creator/ui/DataProvenanceModal.jsx`
- `src/components/campaign-creator/ui/IndiaMapPicker.jsx`
- `src/components/campaign-creator/ui/PlaceDiscoveryFilter.jsx`
- `src/services/apiClient.ts`
- `src/state/appContext.tsx`
- `src/ui/ActivationForm.tsx`
- `src/ui/App.tsx`
- `src/ui/AudienceSelector.tsx`
- `src/ui/BrandHeader.tsx`
- `src/ui/CampaignDetail.tsx`
- `src/ui/CampaignList.tsx`
- `src/ui/LocationSelector.tsx`

Also deleted five unreferenced starter assets: `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`. No repository-controlled functionality references them. Unknown external hotlinks cannot be audited from this checkout.

## Retained deliberately

Nine source files outside the active app graph are used directly or indirectly by tests: four domain modules (`audience`, `brand`, `campaign`, `location`), `campaignService`, `appStore`, and marketplace `logisticsEngine`, `manpowerEngine`, `settlementEngine`. They are not safe unused-file deletions.

After cleanup: **177 source files, 168 app-reachable, 9 test-reachable, zero source files unreachable from all inspected roots**. See `dependency-audit.json` and `dependency-audit-before-cleanup.json`. The scanner is static; dynamic references require the additional text review performed here. Tests/scripts/migrations were not deleted merely for being outside the app import graph.

## Behavior-preserving fixes

- Moved navigation authentication and dialog state hooks above early returns, preserving hook order when route/dialog visibility changes.
- Preserved the default first-partner selection with an effective selected ID, including when the requested category changes.
- Added dialog names, modal semantics and accessible close-button labels; visible Cancel labels remain intact.
- Escaped JSX quotation marks/apostrophes without changing the displayed copy.
- Derived the Location Hiring worker list directly from assigned staff instead of copying it through a state/effect cycle. The mapping and filters are unchanged.
- Added a bounded, 24-entry LRU cache for H3 geometry keyed by latitude, longitude, radius and resolution. Returned objects are copied so consumer mutations cannot corrupt future calculations. No tenant data, database results or full forecasts are cached; forecast persistence still runs on each invocation. Non-numeric inputs follow the original uncached path.
- Corrected the database module comment to describe its actual SQLite implementation.
- Playbook tests now establish their fixture explicitly before checking package completeness/idempotence.
- `npm test`, `npm run test:production` and `npm run test:playbook` now create a unique isolated SQLite database under ignored `data/test-runs/`. The runner preserves environment configuration and never uses the application's SQLite path. Test databases are retained for diagnosis.
- Included preview and geometry regressions in the normal test command; extended the import audit to include transitive test/script dependencies.

## Validation

- Production build passes, including all generated routes. The existing broad file-tracing warning from the playbook importer remains.
- Intelligence **79/79**, marketplace **30/30**, production **58/58**, playbook **14 subtests plus parent (15 reported tests)**, preview **3/3**, geometry **3/3** pass through `npm test` against a fresh isolated database.
- Geometry tests cover mutation isolation, distinct coordinates/radii/resolutions and recomputation after cache eviction.
- All files changed by this cleanup pass targeted ESLint. Repository-wide lint improves from **36 errors / 5 warnings to 18 errors / 5 warnings**; remaining findings are not suppressed.
- Import scan reports no source files unused by app plus tests/scripts. Git diff whitespace check passes.
- Browser verified the production campaign screen, requirements step, existing-vendor dialog and partner dialog. Opening/closing the dialogs produced no browser errors. No campaign was published and no partner/vendor was submitted.
- The verified production build runs at `http://localhost:3100`. Port 3000 was serving a different project at verification time and was left alone.

Local serial benchmark after geometry caching: server 3 km warm median **1.74 ms**, p95 **2.13 ms**, versus the previous uncached server run's 343.87 ms median. The first call remains expensive (201.68 ms in this run). These are 20-call, same-input, local synchronous measurements, not a production throughput claim. Forecast mathematics and data assumptions are unchanged by this cache. Raw results are in `engine-benchmark.json`; the preceding result was retained in `engine-benchmark-before-shared-cache.json`.

## Changes deliberately not mixed into cleanup

The architecture audit's tenant authorization, payment verification, campaign save/edit schema, Live/Draft semantics, real-coordinate population aggregation and venue approval concerns remain open. Those changes alter workflows or forecast outputs and require a separate implementation and integration-test pass. Remaining effect lifecycle/dependency lint issues also require targeted state-transition tests rather than mechanical dependency edits or disabling rules. No database schema, financial formula, API contract, migration or active feature was removed in this cleanup. No commit or push was made.
