'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export function PasswordLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || 'Sign-in could not be completed.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Sign-in could not be completed. Please try again.');
    } finally {
      setLoading(false);
      setPassword('');
    }
  }

  return <form onSubmit={submit} className="mt-7 space-y-5">
    {error && <p role="alert" className="rounded-xl border border-[#e7c5bd] bg-[#fff2ee] px-4 py-3 text-sm text-[#873e31]">{error}</p>}
    <label className="block text-sm font-medium text-[#315743]">Email
      <input type="email" name="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d9e3da] bg-white px-4 py-3 text-[#173d2b] outline-none focus:border-[#4d8060] focus:ring-2 focus:ring-[#4d8060]/20" />
    </label>
    <label className="block text-sm font-medium text-[#315743]">Password
      <input type="password" name="password" autoComplete="current-password" required maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d9e3da] bg-white px-4 py-3 text-[#173d2b] outline-none focus:border-[#4d8060] focus:ring-2 focus:ring-[#4d8060]/20" />
    </label>
    <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#17603d] px-4 py-3 font-semibold text-white transition hover:bg-[#104b30] disabled:cursor-wait disabled:opacity-60">
      {loading ? 'Signing in…' : 'Sign In'}
    </button>
  </form>;
}
