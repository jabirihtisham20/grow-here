# UK editorial work — 16 October 2026

## Actual delivery status

This is a partial delivery: **2 complete MDX drafts, 0 new published posts, 0 database writes, 0 deletions**. The requested batch of 20 complete researched articles is not delivered. Eighteen articles remain unwritten. No deployment was attempted or verified.

Database access first failed with sandbox EACCES; an authorised network retry reached PostgreSQL but authentication failed with code `28P01`. Credentials were neither printed nor changed. A database backup, comprehensive database inventory and database relationship verification were therefore impossible. Correct access is required to reconcile the PostgreSQL CMS with the file CMS before any import or deletion. A file backup is not a database backup.

## Test record

Exactly one local match: `content/grow/fkkj.mdx`, title `fkkj`, description `flqsnlsl`, published status, image `/images/posts/fkkj/image.png`. `test-record.json` preserves its details and backup location. No database UUID was obtained. The test article and assets remain intact because the requested unique database identification and backup prerequisites could not be met. No claim is made that its live URL now returns 404. Once safely removed from both content sources, the existing `notFound()` route should supply a real 404; verify HTTP status after deployment. Do not redirect it elsewhere.

## Inventory and duplication review

Run `node scripts/audit-editorial-content.js`. `inventory.json` contains every local post's full text, headings, metadata, tags, category and SHA-256. Immutable recoverable raw-file snapshots are stored in `data/editorial-backups/` and excluded from Git. Initial inventory: 22 files, of which 21 are legitimate. Existing content was not edited.

The peat-free draft answers moisture diagnosis rather than herb selection, small garden layout, microgreens or hydroponics. The condensation draft concerns recording building symptoms rather than storage layouts or broad energy-saving tips. Both link to relevant existing articles. These are editorial comparisons of the local full texts, not a completed comparison against inaccessible database drafts or live search queries. Provisional candidates must be rechecked against the database and Search Console before commissioning.

## Content and images

| Planned URL | Collection | Status |
| --- | --- | --- |
| /blog/peat-free-compost-watering-diagnosis | grow | Local MDX draft |
| /blog/winter-condensation-observation-checklist | space | Local MDX draft |

Review locally at `/preview/grow/peat-free-compost-watering-diagnosis` and `/preview/space/winter-condensation-observation-checklist`. Preview routes are noindex; public routes, feeds and sitemap exclude drafts. The frontmatter date is the editorial preparation date required by the file schema, not a claim of actual publication. Set the real publication date on approval. Attribution uses the existing editorial identity and claims no first-hand testing or expert review.

Original code-drawn SVG illustrations and 1200 × 675 WebP versions were created specifically for these drafts with `node scripts/prepare-editorial-assets.js`. No external photographs or copied reference artwork are used; no third-party attribution applies to these new drawings. Alt text is in frontmatter. The existing hero component supplies a stable 16:9 box, responsive sizes and image priority. These are schematic illustrations, not test photographs. Human visual checks on mobile and desktop remain required.

## Research limitations

`opportunities.json` records 50 candidate queries and exactly 20 provisional selections. These are a commissioning shortlist, **not 20 validated high-demand/low-competition opportunities**. Volume, difficulty, trend direction, SERP intent and commercial value are unverified unless explicitly described otherwise. No Google Trends, Search Console, Keyword Planner, Ahrefs or Semrush account was accessed. Search-tool results are not a measurement of Google UK rankings. Candidate-specific competitor evaluation remains unfinished for 48 topics; do not commission solely from the shortlist.

Primary sources opened successfully for the two drafts:

- https://www.rhs.org.uk/advice/peat/for-gardeners/peat-free-tips
- https://www.rhs.org.uk/container-gardening/how-to-water-containers
- https://energysavingtrust.org.uk/advice/ventilation/
- https://energysavingtrust.org.uk/advice/fixing-damp-and-condensation/

Observations: RHS already provides strong general peat-free and container watering guidance. Energy Saving Trust provides strong ventilation and damp guidance. Consequently neither topic is labelled low competition. The drafts offer a narrower observation workflow; whether searchers want it remains unverified. No source-backed legal deadlines, current tariffs or promised savings are asserted. Live `/blog` and `/blog/fkkj` were inaccessible through the web tool; this does not prove the site is offline.

## Architecture and publishing

The current public frontend uses `lib/posts.ts` and filesystem collections, not the PostgreSQL post table. `CONTENT-PUBLISHING.md` describes Keystatic/GitHub/Vercel publishing; the repository additionally has PostgreSQL admin routes and a separate additive MDX importer. Database-only edits must not be assumed to update frontend HTML. Existing `scripts/import-mdx-to-postgres.js` defaults to dry run but its apply mode upserts all files: do not run it blindly against production or existing independently edited records. These drafts are import-ready for the existing file CMS; PostgreSQL import is intentionally deferred.

Blog routes server-render MDX through `next-mdx-remote/rsc`, with published paths generated by `generateStaticParams`. Article metadata already supplies title, description, canonical, Open Graph and Twitter metadata. The article component renders one H1, BlogPosting and BreadcrumbList, and visible breadcrumbs. New bodies begin at H2. No FAQ rich-result markup was added. Sitemap, RSS, search and category modules use the shared published-post reader. Existing real URLs, authors and dates were preserved. No visual redesign or dependency installation was performed.

Before publication: verify source currency, full editorial review, author approval, image appearance, keyboard/mobile rendering, database reconciliation, functioning live links, and actual canonical/indexability on the deployed HTML. Public discoverability of these two drafts is intentionally deferred until publication. See `validation.json` for automated checks and remaining limitations.

Checks completed: both new MDX bodies compile; local internal-link destinations and featured images exist; each draft has five FAQs and no body H1; all 22 original file hashes match; `npx.cmd tsc --noEmit` passes. Both WebP illustrations were opened and visually inspected. `npm.cmd run build` failed because `next/font` could not fetch Inter and Playfair Display from Google Fonts (outbound HTTPS EACCES). A successful production build and browser viewport checks remain outstanding. PowerShell blocked the initial npm/npx script shims; the standard `.cmd` executables ran successfully without changing execution policy.

## 30/60/90-day measurement

At publication save the deployed URL list, sitemap submission date and a baseline Search Console Performance export filtered to United Kingdom, Web search, and the new URLs. Keep equivalent previous-period data and note seasonality. Do not treat a missing query row as proof of no searches: privacy thresholds affect exports.

At 30 days inspect URL Inspection and Page Indexing for discovery, canonical selection and exclusions; compare sitemap submitted URLs with indexed URLs. Record UK impressions, clicks and CTR by page and device. Fix indexing failures before changing titles for performance reasons.

At 60 days compare query intent with each article's answer, splitting branded and non-branded queries using a documented brand filter. Track distinct visible non-branded queries and position distributions alongside impressions; query counts depend on report limits. Check overlap between old and new URLs before merging or expanding anything.

At 90 days compare the same cohorts and seasonal context. Review high-impression/low-CTR pages for inaccurate previews, low-click pages for mismatched intent and competing URLs for cannibalisation. Track amendments and dates. No ranking, traffic or indexing improvement is guaranteed.
