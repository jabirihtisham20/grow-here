# GrowHere UK editorial delivery — 16 October 2026

> This is the historical editorial-stage report. The subsequent [file-only migration report](../mdx-migration/README.md) supersedes the CMS/import and draft-status instructions below: the 20 articles are now in the validated local published release, the CMS runtime is retired, and Neon remains untouched. Consult that report's deployment ledger for actual live status.

**Exactly 20 complete articles exist as local review-ready MDX drafts: five in each existing pillar. Eighteen were added in this continuation. None was imported into PostgreSQL, deployed or published.** The first two drafts were retained; the peat-free draft received one necessary source-paragraph correction after a direct link check returned 404. Its remaining content, metadata and image were preserved. The condensation draft is unchanged.

All 22 original posts, including `fkkj`, are unchanged by SHA-256 comparison. The repository now has 42 content files. No database records or shared assets were changed. Existing media-upload edits, credentials and package changes were preserved.

## Articles and research

- [All 20 titles, target keywords, categories, slugs and statuses](article-list.md).
- [Final machine-readable manifest](final-manifest.json): includes excerpts' source files, planned URLs, preview paths, secondary phrases, sources, angles, competition observations, image/alt details and review status.
- [Research evidence and cannibalisation decisions](research-evidence.md).
- [Original 50-candidate opportunity file](opportunities.json), retained as discovery history; the final manifest takes precedence over provisional titles.
- [Current complete local inventory](inventory.json), [original hashes](original-hashes.json) and [initial progress report](INITIAL-PROGRESS.md).

Each draft contains an immediate answer, detailed H2/H3 sections, an original decision framework or calculation, five FAQs, two to four contextual links to original posts, relevant onward links where useful, at least two authoritative external references, distinct SEO metadata, an editorial attribution and a 1200 × 675 WebP hero with descriptive alt text. Article depth is approximately 747–903 words by the local whitespace counter; this is descriptive, not an SEO quality score. All remain subject to human editorial approval.

The sources include RHS, Garden Organic, Energy Saving Trust, FSA/Food Standards Scotland, WaterSafe, Ofgem, CSE, Electrical Safety First, ICO, NCSC, official energy-label documentation, Repair Café, lending services and platform documentation. All monetary examples are explicitly illustrative GBP inputs. No first-hand tests, interviews, current tariff claims or expert endorsements were invented.

**UK monthly volume, keyword difficulty, ranking positions and trend trajectory remain unverified for all 20.** Live searches and source reads establish relevant coverage and support the factual material; they do not establish high demand or low competition. Several topics face strong authoritative coverage. Exact-query demand is particularly uncertain for the household contact and eat-first-box workflows. Search Console and an authorised keyword tool are needed to quantify opportunity and check database-only content overlap. No organic growth is promised.

## Database, backup and test deletion

The [sanitised connection diagnosis](database-connection.json) confirms:

- `.env.local` supplies the effective `DATABASE_URL`; `.env` does not define a competing value, and no duplicate definition was found in the loaded files.
- The configured endpoint is Neon PostgreSQL on port 5432 with `sslmode=require`, a username and a non-placeholder password value.
- The reachable server rejects authentication with **`28P01`**. Credentials were not printed, guessed, reset or changed. Authentication was reached; this is not an absent-table error or a reason to disable certificate verification.
- Native `pg_dump`/`pg_restore` client tools are also unavailable on PATH. The backup attempt stopped with **ENOENT**. **No database backup exists from this run.** Recoverable file exports are not database backups.

Use the current connection string for the intended database role, branch and database from the owner's Neon project. Correct it privately in `.env.local` and in the relevant production environment if necessary; do not paste secrets into reports or commit them. A password cannot be repaired from the repository when its valid value is unavailable. Do not change the production database to match guessed local settings.

`fkkj` has one confirmed local file match: `content/grow/fkkj.mdx`, title `fkkj`, excerpt `flqsnlsl`, placeholder body, image `/images/posts/fkkj/image.png`. **It was not deleted.** No database UUID, complete database inventory or relationship verification could be obtained, so the deletion prerequisites remain unmet. No assets were removed.

A [public read-only live check](live-readonly-check.json) succeeded independently of the web search tool: `/blog` and `/sitemap.xml` return 200; the sitemap's 22 blog URLs match the 22 original local slugs. `/blog/fkkj` still returns **200 with placeholder content**. The public database-backed posts API returns 500. That API response does not reveal its underlying production configuration. No new article was published or represented as live.

After credentials and backup are resolved, enumerate all database posts/drafts/tags/categories and reconcile them with the file inventory. Identify exactly one test record by UUID and confirmed placeholder content, inspect its relationships and asset references, then remove only that record and corresponding file. Retain shared media. Build and deploy through the existing workflow, then verify the old URL returns a genuine 404/410 and is absent from the live sitemap. Do not redirect it to an unrelated page.

## CMS preparation and exact commands

The public frontend still reads the repository collections through `lib/posts.ts`; PostgreSQL powers a separate admin/API layer. Importing database drafts alone does not publish frontend pages. No CMS was replaced and no migration/schema changes were introduced.

The new importer uses the existing `cms_posts`, `cms_categories`, `cms_tags`, `cms_post_tags`, `cms_media` and `cms_activity_logs` tables. It has an explicit 20-file allowlist, validates media, requires a fresh matching backup, uses a transaction and advisory lock, inserts `DRAFT` records with `published_at=NULL`, and never updates existing posts. Exact reruns skip records. A slug, source-path, metadata, tag or media conflict stops the transaction for manual reconciliation. The scripts do not upload assets to Vercel Blob: these local `/images/posts/` files must be deployed with the site source so the database references resolve. They follow the existing repository-media model.

Run the independent checks now:

```powershell
node scripts/diagnose-cms-connection.js
node scripts/validate-editorial-drafts.js
node scripts/test-editorial-import.js
node scripts/import-editorial-drafts.js
npx.cmd tsc --noEmit
npm.cmd run build
```

To review the built previews locally, run `npm.cmd run start -- --hostname 127.0.0.1 --port 3007`, then open a manifest preview path on `http://127.0.0.1:3007`. `node scripts/check-editorial-http.js` checks that running server. This workflow does not publish drafts.

After installing compatible PostgreSQL client tools and supplying valid credentials privately:

```powershell
node scripts/editorial-db-backup.js
```

The helper creates a private custom-format dump under ignored `data/editorial-backups/database/`, verifies its checksum and archive listing, and writes a companion identity manifest. It does **not** claim a restore test. For stronger assurance restore into a separately provisioned disposable database using a qualified operator; never restore over production. Retain a backup outside this workspace securely as well.

Then reconcile database content and deploy the source/media through the established Git/Vercel workflow before executing the scoped draft import:

```powershell
node scripts/import-editorial-drafts.js --apply --backup "data/editorial-backups/database/<actual-archive-name>.dump"
```

Replace the placeholder with the actual helper output. The archive must be under 24 hours old and match the database identity and checksum. Do not run the older all-content importer as a shortcut: it can update other existing entries. The new apply path has only been exercised with an in-memory adapter, not a real PostgreSQL integration; review it and verify imported counts/statuses after restoring access.

Publication remains a separate reviewed action. Set real publication dates in the appropriate source of truth, preserve old URLs and attribution, build, deploy, and verify actual live URLs. Draft-to-draft links are valid planned targets but return 404 publicly until their targets are approved and published; publish linked groups together or remove those links during selective release.

## Build, SEO and QA

The Google Fonts failure was a blocked outbound request, not an MDX compile error. The same Inter and Playfair Display families/weights are now served locally with `next/font/local`, the existing CSS variables, Latin WOFF2 files and included SIL Open Font Licences. No substitute typeface, dependency installation or visual redesign was introduced. Fonts were downloaded once with provenance recorded in `app/fonts/sources.json`; ordinary builds no longer fetch them externally.

Existing canonical metadata, Open Graph, Twitter, BlogPosting, breadcrumbs and server-rendered MDX were reused. Editorial-team authors are now correctly represented as `Organization` in BlogPosting rather than pretending the editorial desk is a person; named individuals retain `Person`. Attribution strings, dates and URLs are unchanged. No FAQ rich-result markup or claim was added. Drafts remain excluded from public routes, sitemap, category listings, feed and search.

Evidence files:

- [Content/schema/sitemap validation](validation.json): 20 drafts compile; unique batch slugs/keywords/SEO titles; five FAQs each; all local links resolve; image decode/dimensions and proposed canonical/schema values pass; 22 original file hashes match. The initial two drafts are verified unchanged apart from the one documented source correction.
- [Production-server HTTP checks](http-validation.json): all 20 previews serve article sections without client execution, one H1, noindex, hero alt and responsive image sizes; all 20 public draft URLs return 404. Existing public routes, canonical/schema, sitemap/feed/search exclusions, protected admin API responses and two optimised image sizes were checked.
- [External links](external-links.json): **32 of 37** distinct supporting URLs returned 2xx directly. Two initial RHS 404s were replaced with verified primary sources. Five Energy Saving Trust URLs returned 403 to the direct checker while their pages were readable through the web research tool. Human browser verification remains required for those five; they are not counted as direct passes.
- [Importer simulation](import-tests.json): first run inserts 20 drafts and media records; exact rerun leaves state unchanged; a collision encountered after earlier inserts rolls back and preserves the legitimate record. This is not a live-database test. A dry run validates all 20 current files without connecting.
- [Image overview](image-contact-sheet.png) and [new illustration provenance](new-image-provenance.json). All 20 original schematics were visually inspected as images; combined WebP payload is approximately 171 KB. They depict concepts, not purported real-world tests.
- `npx.cmd tsc --noEmit` passed. The network-independent production build passed compilation, type/lint stage and generation of 81 pages. See `tool-checks.json` for final command outcomes.

**Browser viewport/accessibility interaction QA was not executed:** Browser runtime setup succeeded but discovery returned no browsers. Responsive `sizes` attributes and image outputs were tested, not visual mobile/desktop layout. Human layout, keyboard and screen-reader checks remain a release task. Login screens and unauthenticated API protection were checked without altering users or sessions; successful authenticated CMS operations remain blocked by database access. Contact/newsletter forms were not submitted.

## Files changed and preservation

[files-changed.json](files-changed.json) lists the scoped content, media, font, script and report files. Principal application changes are `app/layout.tsx` for local fonts and `lib/seo.ts` for accurate editorial-organisation schema. The previous `.gitignore` backup exclusion remains. Existing upload-related changes in `.env.example`, admin media routes/components, `next.config.mjs`, `package.json`, `package-lock.json` and `lib/cms/media.ts` were not overwritten.

Original raw-file snapshots remain under ignored `data/editorial-backups/`. The initial 22-file snapshot is `9c68613d4b5bdfe1.json`; the preserved initial 24-file state including the two earlier drafts is `072415148fadeddf.json`. Later snapshots include the new batch. Keep backups private and available before any later deletion.

## Remaining release requirements

Valid database credentials, PostgreSQL client tools, a verified database backup and database-only content inventory are required before database import or deletion. Human editorial approval, the five directly blocked source checks and browser visual/accessibility review are required before publication. Search-volume, competition and trend metrics remain unavailable. No deployment, live publication, database backup, database import or test-article deletion is claimed.

## 30/60/90-day measurement

At publication save the actual deployed URL cohort and a Search Console baseline filtered to United Kingdom and Web search, with equal comparison periods and seasonal context. Record sitemap submission and selected canonical/indexing status. Privacy thresholds mean missing query rows do not prove no demand.

At 30 days check discovery, indexing exclusions, canonical selection, UK impressions, clicks and CTR by page/device. Fix indexing problems before treating low clicks as a title problem.

At 60 days compare intent against visible queries, split branded/non-branded queries with a documented filter, track visible non-branded query counts and position distributions, and check whether multiple URLs compete for the same intent. Record export limits.

At 90 days review high-impression/low-CTR previews, low-click intent mismatches and overlapping URL/query pairs. Log content changes and dates. Interpret changes against seasonality and the same cohorts; no ranking, indexing or traffic increase is guaranteed.
