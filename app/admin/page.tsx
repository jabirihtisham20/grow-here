'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, FileText, FolderOpen, Image, Users } from 'lucide-react';

type Overview = { counts: { posts: { total: number; published: number; drafts: number }; categories: number; media: number; users: number }; recentPosts: { id: string; title: string; slug: string; status: string; updated_at: string }[]; recentActivity: { id: string; action: string; display_name: string | null; email: string | null; created_at: string }[] };

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { fetch('/api/admin/overview',{cache:'no-store'}).then(async r=>{const b=await r.json();if(!r.ok)throw new Error(b.error||'Unable to load overview');setData(b);}).catch(e=>setError(e.message)); },[]);
  if (error) return <div className="rounded-xl border border-[#e5c8bf] bg-white p-5 text-sm text-[#873e31]">{error}</div>;
  if (!data) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-[#e2e9e2]"/><div className="h-28 rounded-2xl bg-[#e2e9e2]"/></div>;
  const cards=[['Total posts',data.counts.posts.total,FileText],['Published',data.counts.posts.published,ArrowUpRight],['Drafts',data.counts.posts.drafts,FileText],['Categories',data.counts.categories,FolderOpen],['Media files',data.counts.media,Image],['Users',data.counts.users,Users]] as const;
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#64806d]">Your publishing workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard</h1></div><Link href="/admin/posts/new" className="rounded-xl bg-[#17603d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#104c30]">Create post</Link></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label,value,Icon])=><div key={label} className="rounded-2xl border border-[#e0e8df] bg-white p-5"><div className="flex items-center justify-between text-sm text-[#647a69]"><span>{label}</span><Icon size={18}/></div><p className="mt-4 text-3xl font-semibold">{value}</p></div>)}</div>
    <div className="mt-8 grid gap-6 xl:grid-cols-2"><section className="rounded-2xl border border-[#e0e8df] bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Recently edited</h2><Link className="text-sm text-[#17603d]" href="/admin/posts">All posts</Link></div><div className="mt-4 divide-y divide-[#edf1ec]">{data.recentPosts.map(post=><Link key={post.id} href={`/admin/posts/${post.id}`} className="flex items-center justify-between gap-3 py-3"><span className="truncate text-sm font-medium">{post.title}</span><span className="shrink-0 text-xs text-[#718276]">{post.status}</span></Link>)}{!data.recentPosts.length&&<p className="py-8 text-center text-sm text-[#7c8d80]">No posts in the CMS yet.</p>}</div></section><section className="rounded-2xl border border-[#e0e8df] bg-white p-5"><h2 className="font-semibold">Recent activity</h2><div className="mt-4 divide-y divide-[#edf1ec]">{data.recentActivity.map(item=><div key={item.id} className="flex justify-between gap-3 py-3 text-sm"><span>{item.display_name || item.email || 'System'} <span className="text-[#718276]">{item.action.toLowerCase().replaceAll('_',' ')}</span></span><time className="shrink-0 text-xs text-[#829187]">{new Date(item.created_at).toLocaleDateString()}</time></div>)}{!data.recentActivity.length&&<p className="py-8 text-center text-sm text-[#7c8d80]">Activity appears when an editor signs in or changes content.</p>}</div></section></div>
  </div>;
}
