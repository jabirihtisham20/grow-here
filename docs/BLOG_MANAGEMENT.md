# Managing GrowHere articles with Codex and Git

The website uses MDX files only. There is no admin dashboard, authentication service, database content reader or browser upload workflow. Keep Neon and its existing data as an offline rollback source until the owner explicitly decides otherwise. The current migration records live under `reports/mdx-migration/`; previous editorial reports are historical.

## Source of truth and URLs

Keep the established collections: `content/grow/`, `content/space/`, `content/energy/`, `content/life/`. Their names map to Plants & Gardening, Home & Organization, Energy & Savings and Mindful Living. Featured and supporting media live in `public/images/posts/` and are referenced as `/images/posts/...`.

The filename is the permanent slug. A file `content/grow/example-topic.mdx` has canonical URL `https://growhere.online/blog/example-topic`. Existing `/<category>/<slug>` aliases continue rendering with that canonical. There is no trailing slash change. Never rename an existing filename just because its title changes. A frontmatter `slug`, if supplied, must exactly match the filename. Slugs must be unique across all categories and all statuses.

`lib/blog-content.js` is the shared validated file reader; `lib/posts.ts` supplies existing lists, search and related-post helpers. A build fails for invalid content instead of silently omitting a post. Public post/category JSON APIs use the same reader; their stable IDs are now slugs rather than database UUIDs.

## Research and write a new article

Read the full existing corpus, headings and keyword metadata before selecting a topic. Compare intent, not just wording. Research current UK sources, explain national differences where relevant and mark unavailable volume/difficulty/trend metrics unverified. Do not invent tests, interviews, prices or rankings. Use British English, GBP, metric units and realistic local conditions.

Choose a lowercase hyphenated filename. Start with explicit `status: draft`. Preserve one H1 supplied by the article template; begin the body at H2. Answer one clear intent and add a genuinely useful calculation, diagnostic or decision framework. Include contextual links to relevant published posts, meaningful authoritative references and accurate FAQs where useful. Do not claim FAQ rich-result eligibility. Avoid linking a published post to an unpublished target.

Example frontmatter (replace every example with real content and an existing image before validation):

```yaml
---
title: "A descriptive UK article title"
description: "A concise, specific opening benefit and accurate excerpt."
category: grow
subcategory: Container Care
status: draft
author:
  name: Grow Here Editorial
  role: Editorial Team
  avatar: /images/authors/editorial.webp
publishedAt: '2026-10-16'
image: /images/posts/example-topic.webp
imageAlt: "Describe the actual image, not a list of keywords"
readingTime: 5 min read
tags: [Container care]
seoTitle: "A distinct accurate search title | Grow Here"
metaDescription: "An accurate search preview that explains the article's practical benefit."
primaryKeyword: a distinct primary query
secondaryKeywords: [related theme, closely related long-tail query]
relatedPosts: [balcony-herb-garden]
noindex: false
---
```

The reader also accepts `datePublished` instead of `publishedAt`, `dateModified` instead of `updatedAt`, and `featuredImage` instead of `image`. Existing names remain preferred for consistency. Conflicting alias values fail validation. Dates must be real ISO dates. The date on a draft is a preparation placeholder: set the actual publication date when approving it. Preserve the original publication date on existing posts; set `updatedAt` only for a meaningful revision.

Required fields include title, description, date, a complete author object, featured image and alt text. Category comes from the collection; any frontmatter category must agree. Tags, secondary keywords and related posts are string arrays. Legacy files without status remain published for compatibility; always specify status in new files. Publication is a reviewed Git change, not an automatic result of creating a file.

## Images

Use owned, original or verifiably licensed assets and record provenance/attribution. Do not hotlink copyrighted stock or use temporary file URLs. Optimise to WebP/AVIF where appropriate, generally a 1200 × 675 hero, with descriptive alt text. The existing Next Image components handle responsive sizes and stable aspect ratios; supporting images use lazy loading by default. Preserve existing indexed asset URLs. If replacing a file at the same path, rebuild and verify cache behaviour; prefer a new descriptive filename when a genuinely different asset needs a new identity.

## Edit, relate or remove content

Change the existing MDX file in place to preserve its URL, title/date/author where unchanged, body links and media paths. `relatedPosts` lists explicit slug references; the existing related-post module fills remaining slots from published relevant content. Invalid, missing, self-referential or unpublished related targets on published pages fail validation.

Before removal, export the file and all unique assets to a private backup and record the URL. Check inbound internal links, indexed status and shared media. Remove the file from its collection and add its slug and reason to `content/removed-posts.json`. Retired slugs cannot accidentally be reused. Missing posts return a real 404 through the existing routes; only add a redirect when a genuinely equivalent replacement warrants one. Never redirect an unrelated removed article to the homepage. `fkkj` is retired; its database record and image were deliberately retained.

## Validate and preview

Use the installed npm version and lockfile. On PowerShell with restricted script execution, use `npm.cmd` / `npx.cmd`; no execution-policy change is needed.

```powershell
npm.cmd run blog:validate
npm.cmd run blog:test
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run start -- --hostname 127.0.0.1 --port 3007
```

Open `/preview/<category>/<slug>` on that local server to review drafts. Preview pages are noindex and excluded from the sitemap. Review at mobile and desktop widths and check keyboard navigation where a browser is available. Never describe HTTP checks as browser visual QA.

`npm.cmd run blog:qa` checks a running local production server at port 3007. Override `MIGRATION_QA_ORIGIN` for an explicitly selected trusted test deployment. It checks published/legacy routes, SSR bodies, metadata, schema, images, archives, sitemap, draft exclusion and retired-route 404s. Add `-- --preserve-originals` for the strict migration body-preservation gate. Likewise `node scripts/validate-blog.js --preserve-originals` enforces the original source hashes. Ordinary validation permits reviewed future edits while reporting changed baselines; do not silently rewrite historical recovery evidence. `npm run build` automatically runs content validation first.

The public APIs remain read-only: `/api/posts`, `/api/posts/<slug>`, `/api/categories`, `/api/search-index`. Contact and newsletter routes retain SMTP delivery. Do not replace them with database dependencies. Never submit production forms as a test without authorisation to send messages.

## Commit and deploy through the existing workflow

Review `git status --short`, relevant diffs and the validation reports. Stage only reviewed content, required images and related code/docs. Do not use `git add .` in a workspace containing unrelated edits. Never commit `.env`, `.env.local`, private rollback exports, database credentials or submission data.

The existing remote is `https://github.com/jabirihtisham20/grow-here.git`. Verify Vercel's connected repository and production branch in its project settings rather than assuming access or auto-deployment. Recommended sequence:

```powershell
git switch -c chore/file-based-blog
# Stage the explicitly reviewed paths listed in the migration report.
git diff --cached --check
git commit -m "Move blog management to validated MDX files"
git push -u origin chore/file-based-blog
```

Wait for the connected Vercel preview deployment, then run the HTTP checks against its URL and perform browser review. Merge the reviewed change into the configured production branch only after those checks. Verify production URL counts, every original URL, new URLs, sitemap, canonical tags, image outputs and removed-route statuses after successful deployment. A local `published` status does not prove live publication.

If the Git integration is unavailable but an authorised Vercel CLI is installed, link the correct project and use `vercel deploy` for a preview; use `vercel deploy --prod` only after preview verification. Do not install or authenticate tooling with someone else's account. No deployment or environment mutation is implied by these instructions.

## Vercel environment cleanup and rollback

After the deployed file-only build is verified, the owner may remove the following obsolete application variables from the Vercel project's **Preview and Production** environments: `DATABASE_URL`, `DATABASE_POOL_SIZE`, `SESSION_SECRET`, `ADMIN_URL`, CMS-only `WEBSITE_URL`/`API_URL`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME`, `NEXT_PUBLIC_KEYSTATIC_STORAGE`, and CMS upload-only `BLOB_READ_WRITE_TOKEN`, `BLOB_WEBHOOK_PUBLIC_KEY`, `BLOB_STORE_ID`. Confirm no other deployment or application uses them first. Keep `NEXT_PUBLIC_SITE_URL`, `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `RECIPIENT_EMAIL` for the site/forms. Do not remove Vercel-managed OIDC variables or delete Blob stores/assets.

Use Vercel Project → Settings → Environment Variables; choose only the confirmed obsolete keys, record the scope and redeploy. Automated removal was not performed. Preserve the Neon project, its data, credentials in the owner's secret manager and existing backups. A repository backup is not a database backup. Local `.env` files were deliberately left untouched.

Rollback uses the prior Git/Vercel deployment plus the verified private source/media snapshot recorded in `reports/mdx-migration/backup.json`. That snapshot includes uncommitted CMS/upload changes. Restore individual reviewed files or use the prior deployment; do not overwrite the whole working tree or restore a database over production. Database-only drafts remain in Neon; their existence was not verified because authentication is unavailable, and they were not deleted.
