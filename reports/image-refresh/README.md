# Editorial image refresh — 17 October 2026

Replaced the 20 new UK article schematic heroes with realistic AI-generated editorial photographs using the built-in image_gen tool. Each article has a distinct subject-specific scene, natural lighting and realistic materials. These are illustrative editorial assets, not photographs documenting first-hand tests or actual named events.

Final images are saved at the existing `/images/posts/<article-slug>.webp` URLs in `public/images/posts/`. Every file is 1600 × 900 WebP, quality 84, approximately 74–340 KiB. Alt text now describes the actual replacement scene. Article bodies, slugs, publication dates and the 21 original posts are preserved.

`generated-sources.json` records the final prompt set and original generated PNG paths; `assets.json` records final project paths, dimensions, sizes, hashes and alt text. Generated PNG originals remain in the Codex generated_images directory. Previous images and article files are backed up privately at `data/migration-backups/image-refresh-2026-10-17/` and remain recoverable in Git history.

The generated images and the final optimised contact sheet were visually reviewed. All 41 articles pass content, local image and internal-link validation, including the unchanged-source checks for the 21 originals. The Next.js production build passed, including lint and TypeScript checks, and generated 107 static pages. Live asset checks are recorded separately when completed. Historical editorial reports describe the previous schematic assets and should not be interpreted as the current image design.
