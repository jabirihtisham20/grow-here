import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery, withCmsTransaction } from '@/lib/cms/db';
import { assertSameOrigin, boundedString, cmsErrorResponse, parseJsonObject, slugValue } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireCmsUser();
    const result = await cmsQuery(`SELECT c.id,c.name,c.slug,c.description,c.created_at,c.updated_at,COUNT(p.id)::int AS post_count
      FROM cms_categories c LEFT JOIN cms_posts p ON p.category_id=c.id
      GROUP BY c.id ORDER BY c.name`);
    return NextResponse.json({ categories: result.rows }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const user = await requireCmsUser(['SUPER_ADMIN', 'ADMIN']);
    const body = parseJsonObject(await request.json());
    const name = boundedString(body.name, 'name', 100, true)!;
    const slug = slugValue(body.slug);
    const description = boundedString(body.description, 'description', 500) || '';
    const result = await withCmsTransaction(async (client) => {
      const category = await client.query('INSERT INTO cms_categories (name,slug,description) VALUES ($1,$2,$3) RETURNING id,name,slug,description', [name,slug,description]);
      await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id) VALUES ($1,$2,$3,$4)', [user.id,'CATEGORY_CREATED','CATEGORY',category.rows[0].id]);
      return category.rows[0];
    });
    return NextResponse.json({ category: result }, { status: 201 });
  } catch (error) {
    if (isConflict(error)) return NextResponse.json({ error: 'That category name or slug already exists.' }, { status: 409 });
    return cmsErrorResponse(error);
  }
}

function isConflict(error: unknown) { return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505'; }
