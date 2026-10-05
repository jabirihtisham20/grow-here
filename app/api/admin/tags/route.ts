import {NextRequest,NextResponse} from 'next/server';
import {requireCmsUser} from '@/lib/cms/auth';
import {cmsQuery,withCmsTransaction} from '@/lib/cms/db';
import {assertSameOrigin,boundedString,cmsErrorResponse,parseJsonObject,slugValue} from '@/lib/cms/http';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){try{await requireCmsUser();const result=await cmsQuery(`SELECT t.id,t.name,t.slug,COUNT(pt.post_id)::int AS post_count FROM cms_tags t LEFT JOIN cms_post_tags pt ON pt.tag_id=t.id GROUP BY t.id ORDER BY t.name`);return NextResponse.json({tags:result.rows},{headers:{'Cache-Control':'private, no-store'}})}catch(error){return cmsErrorResponse(error)}}
export async function POST(request:NextRequest){try{assertSameOrigin(request);const user=await requireCmsUser(['SUPER_ADMIN','ADMIN']);const body=parseJsonObject(await request.json());const name=boundedString(body.name,'name',80,true)!;const slug=slugValue(body.slug);const result=await withCmsTransaction(async c=>{const tag=await c.query('INSERT INTO cms_tags(name,slug) VALUES($1,$2) RETURNING id,name,slug',[name,slug]);await c.query('INSERT INTO cms_activity_logs(user_id,action,entity,entity_id) VALUES($1,$2,$3,$4)',[user.id,'TAG_CREATED','TAG',tag.rows[0].id]);return tag.rows[0]});return NextResponse.json({tag:result},{status:201})}catch(error){if(typeof error==='object'&&error!==null&&'code'in error&&error.code==='23505')return NextResponse.json({error:'That tag name or slug already exists.'},{status:409});return cmsErrorResponse(error)}}
