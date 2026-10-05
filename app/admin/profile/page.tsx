'use client';

import { useEffect, useState } from 'react';
type User = { name: string; email: string | null; role: string };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { fetch('/api/auth/me', { cache: 'no-store' }).then((response) => response.json()).then((body) => setUser(body.user || null)); }, []);
  return <div><h1 className="text-3xl font-semibold">Profile</h1><div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#e0e8df] bg-white p-6"><div className="grid h-16 w-16 place-items-center rounded-full bg-[#315b45] text-xl font-semibold text-white">{user?.name?.charAt(0).toUpperCase() || 'A'}</div><div><p className="text-lg font-semibold">{user?.name || 'Loading profile…'}</p><p className="mt-1 text-sm text-[#718276]">{user?.email}</p><p className="mt-1 text-sm text-[#718276]">{user?.role}</p></div></div></div>;
}
