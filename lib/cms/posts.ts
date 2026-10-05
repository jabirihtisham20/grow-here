import 'server-only';
import type { PoolClient } from 'pg';

export async function replacePostTags(client: PoolClient, postId: string, names: string[]) {
  await client.query('DELETE FROM cms_post_tags WHERE post_id = $1', [postId]);
  for (const name of names) {
    const normalized = name.trim();
    const slug = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) continue;
    const tag = await client.query<{ id: string }>(
      'INSERT INTO cms_tags (name, slug) VALUES ($1,$2) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id',
      [normalized, slug]
    );
    await client.query('INSERT INTO cms_post_tags (post_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [postId, tag.rows[0].id]);
  }
}
