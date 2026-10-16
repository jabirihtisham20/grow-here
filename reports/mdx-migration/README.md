# File-based MDX migration — 16 October 2026

## Release result

- **21 genuine original published articles** recovered and retained, verified against every live original page. The old 22-post inventory included exactly one test article.
- **20 completed UK articles** included without regenerating their content. Only their status changed from draft to published for the validated local release; publication dates remain 16 October 2026.
- **41 public articles in the built release**, with canonical `/blog/<slug>` routes and the existing `/<category>/<slug>` aliases. Local release status is not a claim of live deployment. See `deployment.json` for any later remote verification.
- `fkkj` is excluded from the active collection; `/blog/fkkj` and `/grow/fkkj` return genuine 404s in the built release. Its Neon record and image are retained.
- Custom admin, authentication/session/user management, Keystatic and upload APIs/components are retired. All removed source, including pre-existing uncommitted upload work, is recoverable from the private snapshot.
- **No application runtime dependency on Neon** remains. Existing public read APIs now use files. Contact/newsletter SMTP functionality and site design are retained.

## Recovery and rollback evidence

`backup.json` identifies the independent recoverable source/media snapshot. It contains 292 verified copied files, a full 42-article raw export with metadata and media references, original CMS/auth/upload code, dependency manifests and configuration examples. It excludes secrets, `.git`, build/dependency output and database data. Public live/local HTML captures are stored inside that ignored private snapshot directory.

`preflight.json` records all 22 original live blog URLs. `recovery-validation.json` compares live and pre-migration local production HTML: complete visible prose, body links/inline images, H1, SEO title/description, canonical, image references, author names, publication/modification dates and social metadata all matched for the **21 genuine** articles. This recovery passed before CMS retirement. Original article files retain their SHA-256 hashes. `pre-removal-http.json` records the independent file-reader build's route, metadata, sitemap and functionality checks before the retirement script was allowed to run.

Neon was never written to, reset, truncated or deleted. Its project, credentials in local `.env` files and production data remain untouched. No database backup is claimed: authentication previously failed and native backup tools were unavailable. The verified public/file recovery allowed this migration without changing database state; database-only unpublished drafts remain in Neon and were not enumerated or deleted.

## Content architecture

The established `content/grow`, `content/space`, `content/energy`, `content/life` layout and `/images/posts/` paths are preserved. `lib/blog-content.js` validates the actual files for both Next.js and the CLI; `lib/posts.ts` retains the existing public helper interfaces.

The reader supports required title/description/author/date/image/alt fields, filenames as permanent slugs, optional matching frontmatter slugs, category/tag/keyword fields, explicit related slugs and draft/published status. It accepts `datePublished`, `dateModified` and `featuredImage` aliases without requiring changes to original metadata names. Conflicting aliases, invalid dates, missing required data, unsafe slugs, duplicate slugs across all statuses and invalid explicit related references fail validation. `content/removed-posts.json` prevents accidental reintroduction of retired slugs.

The 20 articles retain their original bodies, UK keywords, FAQs, references and WebP illustrations. `editorial-status-changes.json` records before/after hashes and status-only changes; `editorial-release-review.md` records review scope and limitations. The [article list](../uk-editorial/article-list.md) and [final editorial manifest](../uk-editorial/final-manifest.json) contain titles, categories, keywords, paths and images. Search volume, keyword difficulty and trend metrics remain unverified.

## Routes, SEO and discovery

All 41 canonical pages and all 41 legacy aliases were tested through the local production server. All 21 original visible bodies match the live pre-migration hashes. The sitemap contains exactly the published indexable article set and excludes `fkkj`. Robots allow public crawling; sitemap, RSS, search, categories and related-post logic share the file reader.

Article titles/descriptions, canonicals, BlogPosting and BreadcrumbList are verified against actual server-rendered HTML. Existing Open Graph/Twitter generation and accurate editorial-organisation author markup remain. No FAQ rich-result promises were introduced. Original authors, dates, titles, URLs and content were not rewritten.

The existing Load More controls retain their styling and JavaScript behaviour but now have real `?page=` fallback links. Archives server-render the requested count, so bots/users without JavaScript can reach older cards. Category archives expose all posts over two pages each; blog/latest expose all 41 over six pages each. Query pages retain the established archive canonical to avoid competing canonical variants. HTML checks inspect actual anchor elements rather than strings hidden in client data.

## Runtime retirement and preservation

`retired-files.json` lists the 18 scoped paths retired after recovery and pre-removal HTTP validation. This includes the custom admin/Keystatic trees, auth/admin APIs, obsolete database page API, CMS helpers/components, root Keystatic config and database-only import/migration/admin scripts. Public posts/categories APIs are replaced with file readers rather than removed. SQL migration files remain as historical rollback material, not executable application setup.

Removed packages: `pg`, `@types/pg`, `bcryptjs`, `@keystatic/core`, `@keystatic/next`, `@vercel/blob`. The scoped npm uninstall removed 150 packages; no new package was added. Nodemailer and unrelated functionality remain. `file-only-runtime.json` verifies no CMS/Neon imports or environment-variable dependencies in active app/components/lib source, and no database packages in the sampled Vercel function traces. Those traces include all 42 content files (41 MDX plus retirement manifest) and 75 public assets needed for filesystem/media checks on Vercel.

Actual `.env`/`.env.local` and all external Vercel/Neon settings were left untouched. `.env.example` now documents only the site URL and existing SMTP variables. Existing uncommitted CMS/media changes were exported before retirement rather than discarded. The typography, main header/footer, colours, cards, animations, image aspect ratios and optimisation pipeline are preserved; only obsolete preview-admin links and crawler fallback behaviour changed.

## Validation evidence

- `content-validation.json`: 41 files/public articles, 21 original source hashes retained, MDX compilation, metadata uniqueness, safe/unique slugs, local image decode/dimensions and internal article links pass.
- `loader-tests.json`: legacy/alias parsing, invalid metadata/date rejection, silent URL drift rejection, invalid related references and duplicate draft/published slug checks pass.
- `final-http.json`: 41 canonical routes, 41 legacy aliases, original body hashes, one H1, metadata/schema/alt, exact sitemap set, archives/real pagination anchors, static pages, robots, file APIs and removed admin/test 404s pass.
- `file-only-runtime.json`: active source and function-trace checks pass without database/CMS packages.
- ESLint completed with **0 errors and 0 warnings**. TypeScript and the production build passed; Next generated **107 static pages** plus the appropriate server-rendered listings/APIs. Content validation also runs automatically before future builds.
- All featured and author images referenced by the 41 posts decode locally. Existing indexed paths remain. The 20 new original WebP schematics were visually inspected in the earlier editorial stage. No image/store was deleted.

**Browser viewport, keyboard and interaction QA was not executed:** Browser discovery returned no browsers. HTTP/HTML and image checks are not represented as browser tests or measured Core Web Vitals. Five Energy Saving Trust references reject the standalone direct checker with 403 while remaining readable through web research; that limitation remains recorded. No forms were submitted or messages sent.

## Git/Vercel and remaining work

The migration is isolated on `chore/file-based-mdx-migration`. A non-interactive GitHub push dry run succeeded without uploading refs/code. The repository remote is unchanged. No Vercel CLI/project link or Vercel token was available locally; Git-based preview deployment is being checked through the existing integration where possible. See `deployment.json` for the final verified remote status; do not infer production publication from this document's local counts.

No Vercel environment variables, Blob stores, Neon projects or database records were removed. After a verified deployment, the owner can follow the exact environment-cleanup steps in [docs/BLOG_MANAGEMENT.md](../../docs/BLOG_MANAGEMENT.md). Keep Neon and its backups as the temporary rollback source. No unrelated redirect rule was changed.

The complete future Codex/Git publishing workflow, frontmatter example, image rules, safe updates/removals, validation commands, deployment steps and rollback instructions are in [docs/BLOG_MANAGEMENT.md](../../docs/BLOG_MANAGEMENT.md). Historical CMS/import instructions have been labelled superseded. This report's deployment ledger takes precedence over earlier draft-stage reports.
