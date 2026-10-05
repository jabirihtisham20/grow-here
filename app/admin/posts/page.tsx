'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';

type Post = { id: string; title: string; slug: string; category: string | null; status: string; updated_at: string };
export default function PostsAdminPage() {
  const [posts,setPosts]=useState<Post[]>([]); const [query,setQuery]=useState(''); const [status,setStatus]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;const params=new URLSearchParams();if(query)params.set('q',query);if(status)params.set('status',status);fetch(`/api/admin/posts?${params}`,{cache:'no-store'}).then(async r=>{const b=await r.json();if(!r.ok)throw new Error(b.error||'Unable to load posts');if(active)setPosts(b.posts)}).catch(e=>active&&setError(e.message)).finally(()=>active&&setLoading(false));return()=>{active=false}},[query,status]);
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#64806d]">Manage your editorial content</p><h1 className="mt-1 text-3xl font-semibold">Posts</h1></div><Link href="/admin/posts/new" className="inline-flex items-center gap-2 rounded-xl bg-[#17603d] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17}/>New post</Link></div>
    <div className="mt-7 flex flex-wrap gap-3"><label className="flex min-w-64 flex-1 items-center gap-2 rounded-xl border border-[#dfe8e0] bg-white px-3"><Search size={17} className="text-[#7e9184]"/><input value={query} onChange={e=>setQuery(e.target.value)} className="w-full py-3 text-sm outline-none" placeholder="Search title or slug"/></label><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-[#dfe8e0] bg-white px-4 text-sm"><option value="">All statuses</option><option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option></select></div>
    {error&&<p role="alert" className="mt-5 rounded-xl bg-white p-4 text-sm text-[#873e31]">{error}</p>}
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#e0e8df] bg-white"><div className="grid grid-cols-[1fr_110px_120px] gap-4 border-b border-[#edf1ec] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#748579]"><span>Article</span><span>Status</span><span>Updated</span></div>{loading?<div className="p-8 text-sm text-[#718276]">Loading posts…</div>:posts.map(post=><Link key={post.id} href={`/admin/posts/${post.id}`} className="grid grid-cols-[1fr_110px_120px] items-center gap-4 border-b border-[#f0f3ef] px-5 py-4 last:border-0 hover:bg-[#f8faf7]"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{post.title}</span><span className="mt-1 block truncate text-xs text-[#839086]">/{post.slug} · {post.category||'Uncategorized'}</span></span><span className="text-xs text-[#62776a]">{post.status}</span><time className="text-xs text-[#839086]">{new Date(post.updated_at).toLocaleDateString()}</time></Link>)}{!loading&&!posts.length&&<div className="p-10 text-center text-sm text-[#718276]">No posts match these filters.</div>}</div>
  </div>;
}
