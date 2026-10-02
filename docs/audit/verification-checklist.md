# Change summary and verification checklist

This release improves campaign creation usability, corrects client preview wiring, caches deterministic geometry, and removes verified unused files. It does not implement payment processing, new authorization rules, or campaign API schema changes.

## Implemented

- Responsive campaign form and summary layout; sticky desktop summary and collapsible mobile summary.
- Accessible step navigation, clearer next-step actions, larger controls and keyboard focus styles.
- Basic identity/schedule/budget validation with inline errors.
- Keyboard-operable objective cards and linked basic-detail field labels.
- Device-local draft status, debounced saves, navigation/page-hide flush and visible storage errors.
- On-demand loading for wizard steps 2–10.
- Correct preview population argument, objective/start-hour forwarding and preservation of zero interaction capacity.
- Explicit heuristic/low-confidence preview provenance and clearer planning-estimate copy.
- Bounded preview aggregate cache and shared H3 geometry cache with copied return values.
- Stable hook order for navigation and brand/vendor/partner dialogs; dialog names and close-button labels.
- Derived assigned-worker list instead of duplicated state; JSX escaping with unchanged visible text.
- Deleted 13 unused source files and 5 unreferenced starter SVGs; retained 9 test-dependent modules.
- Isolated test databases, explicit playbook fixtures, six suites in `npm test`, and reproducible audit/benchmark scripts.

## Automated checks completed locally

- [x] Production build passes (`npm run build`). Existing broad playbook-importer file-tracing warning remains.
- [x] Intelligence: 79/79; marketplace: 30/30; production: 58/58.
- [x] Playbook: 14 subtests plus parent (15 reported tests), passing from a fresh test database.
- [x] Preview: 3/3; geometry cache: 3/3.
- [x] Targeted ESLint for changed components/engine files passes.
- [x] Git whitespace check passes.
- [x] Import audit: 177 source files; 168 app-reachable, 9 test-reachable, zero unused across all inspected roots.
- [x] Production browser check: campaign screen, requirements step, vendor and partner dialogs; no browser errors in those checks.
- [ ] Full-repository lint is NOT clean: 18 errors and 5 warnings remain in existing state/effect code.

## Manual acceptance checklist

Use a disposable draft. Do not authorize funding or publish a real campaign merely to verify this cleanup.

- [ ] Open `/campaigns/new` on desktop and mobile: no page-wide horizontal overflow; fields and footer remain usable.
- [ ] Check all ten navigation labels; move forward/backward and confirm entered values remain.
- [ ] Leave campaign name, brand or product empty and continue: an inline error should keep you on Basics.
- [ ] Try reversed dates, an invalid shift or a zero budget: the form should explain the problem. Restore valid values and continue.
- [ ] Use Tab/Enter/Space on objective cards: selection should work and focus should be visible.
- [ ] Edit a draft, wait briefly, reload: values should be restored. Repeat with Save Progress and with immediate page navigation.
- [ ] On mobile, expand/collapse Campaign Summary; on desktop, scroll through the form and inspect the sticky summary.
- [ ] Open and close Brand Analysis, Existing Agency and Find a Partner dialogs: no hook-order errors; Cancel and the close icon remain distinguishable.
- [ ] Where partners exist, check that the first partner is selected initially and changing selection remains possible.
- [ ] In Location Hiring, change the active campaign: the assigned-worker list should reflect that campaign.
- [ ] Change audience, budget and schedule after a forecast: estimates should update; cached geometry must not freeze the whole forecast.
- [ ] Run `npm test`: output should identify a new database under `data/test-runs/`, not the application's database.
- [ ] Run `node scripts/audit-codebase.mjs`: `unusedByAppTestsAndScripts` should remain empty.
- [ ] Run `npm run build` with access to the configured Google fonts.

## Remaining work (not part of this release)

Server-side tenant authorization; real payment verification; campaign create/edit/status contract alignment; real-coordinate and multi-location population aggregation; evidence-based confidence; removal of invented venue approval/quote assumptions; remaining state/effect lint fixes. See `architecture-review.md` and `safe-cleanup.md` for details and limits of verification.
