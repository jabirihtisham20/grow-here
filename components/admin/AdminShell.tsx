'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, BookOpen, Boxes, FileText, Image as ImageIcon, LayoutDashboard, LogOut, Settings, Shield, Tags, Users } from 'lucide-react';

type User = { name: string; email: string | null; role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' };
const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: BookOpen },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/categories', label: 'Categories & Tags', icon: Tags },
  { href: '/admin/media', label: 'Media library', icon: ImageIcon },
  { href: '/admin/users', label: 'Admins & Access', icon: Users, superAdmin: true },
  { href: '/admin/roles', label: 'Roles & access', icon: Shield },
  { href: '/admin/seo', label: 'SEO', icon: Boxes },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/activity', label: 'Activity log', icon: Activity },
  { href: '/admin/profile', label: 'Profile', icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'signed-out' | 'database' | 'error'>(isLogin ? 'ready' : 'loading');

  useEffect(() => {
    if (isLogin) return;
    let cancelled = false;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (response.status === 401) {
          setStatus('signed-out');
          router.replace('/admin/login');
        } else if (response.status === 503) {
          setStatus('database');
        } else if (!response.ok) {
          setStatus('error');
        } else if (body.user) {
          setUser(body.user);
          setStatus('ready');
        } else {
          setStatus('signed-out');
          router.replace('/admin/login');
        }
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => { cancelled = true; };
  }, [isLogin, router]);

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  if (isLogin) return <>{children}</>;
  if (status === 'loading' || status === 'signed-out') return <div className="min-h-screen bg-[#f5f7f4] p-8 text-sm text-[#557064]">Checking your secure CMS session…</div>;
  if (status === 'database') return <div className="min-h-screen bg-[#f5f7f4] p-8"><div className="mx-auto mt-24 max-w-xl rounded-2xl border border-[#dce5dd] bg-white p-8"><h1 className="text-xl font-semibold text-[#123d2c]">CMS database is not connected</h1><p className="mt-3 text-sm leading-6 text-[#557064]">The existing website and MDX posts are still active. Configure the server-only <code>DATABASE_URL</code>, run the schema migration, and complete the MDX import before using database-backed CMS features.</p><Link className="mt-5 inline-block text-sm font-semibold text-[#18754c]" href="/keystatic">Open the current editor</Link></div></div>;
  if (status === 'error') return <div className="min-h-screen bg-[#f5f7f4] p-8 text-[#7d3429]">The CMS session could not be verified. Refresh or try again.</div>;

  const visibleNav = nav.filter((item) => !item.superAdmin || user?.role === 'SUPER_ADMIN');
  const initial = user?.name?.trim().charAt(0).toUpperCase() || 'A';

  return <div className="min-h-screen bg-[#f5f7f4] text-[#163a2b] md:flex">
    <aside className="w-full border-b border-[#dfe8e0] bg-[#0b271c] text-white md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-0">
      <div className="px-6 py-6"><Link href="/admin" className="text-lg font-semibold tracking-wide">GROW HERE <span className="text-[#aac8b1]">CMS</span></Link><p className="mt-1 text-xs text-[#aac8b1]">Editorial workspace</p></div>
      <nav className="grid grid-cols-2 gap-1 px-3 pb-4 md:block md:flex-1 md:overflow-y-auto">{visibleNav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${pathname === href ? 'bg-[#1d5139] text-white' : 'text-[#c1d3c5] hover:bg-white/10 hover:text-white'}`}><Icon size={17}/>{label}</Link>)}</nav>
      <div className="hidden border-t border-white/10 p-4 md:block"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#315b45] font-semibold">{initial}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{user?.name}</p><p className="truncate text-xs text-[#aac8b1]">{user?.email} · {user?.role}</p></div></div><button onClick={signOut} className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#c1d3c5] hover:bg-white/10"><LogOut size={16}/>Sign out</button></div>
    </aside>
    <div className="min-w-0 flex-1 md:ml-64"><header className="flex items-center justify-between border-b border-[#dfe8e0] bg-white px-5 py-4 md:px-8"><p className="text-sm text-[#5e7668]">Grow Here <span className="px-2 text-[#b2c2b7]">/</span><span className="font-medium text-[#163a2b]">{visibleNav.find((item) => item.href === pathname)?.label || 'Editor'}</span></p><div className="flex items-center gap-3 md:hidden">{user && <span className="text-xs">{user.name}</span>}<button aria-label="Sign out" onClick={signOut}><LogOut size={17}/></button></div></header><main className="mx-auto max-w-7xl p-5 md:p-8">{children}</main></div>
  </div>;
}
