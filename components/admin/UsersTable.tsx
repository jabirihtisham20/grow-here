'use client';

import { Fragment, useEffect, useState, type FormEvent } from 'react';

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
type User = { id: string; email: string | null; display_name: string; role: Role; status: 'ACTIVE' | 'DISABLED'; created_at: string; last_login_at: string | null; has_password: boolean };
const roles: Role[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not load administrator accounts.');
      setUsers(body.users);
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load administrator accounts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadUsers(); }, []);

  async function send(url: string, method: string, body?: Record<string, unknown>) {
    const response = await fetch(url, {
      method,
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'The administrator change could not be saved.');
    return result;
  }

  async function createAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setBusy('create');
    try {
      await send('/api/admin/users', 'POST', {
        name: form.get('name'), email: form.get('email'), password, confirmPassword, role: form.get('role'),
      });
      formElement.reset();
      setAdding(false);
      setNotice('Administrator account created.');
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create administrator.');
    } finally {
      setBusy(null);
    }
  }

  async function saveAdmin(event: FormEvent<HTMLFormElement>, user: User) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const status = String(form.get('status')) as User['status'];
    if (status === 'DISABLED' && user.status !== 'DISABLED' && !window.confirm(`Disable ${user.display_name}? Their active sessions will end immediately.`)) return;
    setBusy(user.id);
    try {
      await send(`/api/admin/users/${user.id}`, 'PATCH', {
        name: form.get('name'), email: form.get('email'), role: form.get('role'), status,
      });
      setEditing(null);
      setNotice('Administrator details updated.');
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update administrator.');
    } finally {
      setBusy(null);
    }
  }

  async function setStatus(user: User, status: User['status']) {
    if (status === 'DISABLED' && !window.confirm(`Disable ${user.display_name}? Their active sessions will end immediately.`)) return;
    setBusy(user.id);
    setError('');
    try {
      await send(`/api/admin/users/${user.id}`, 'PATCH', { status });
      setNotice(status === 'DISABLED' ? 'Administrator disabled.' : 'Administrator enabled.');
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update administrator.');
    } finally {
      setBusy(null);
    }
  }

  async function removeAdmin(user: User) {
    if (!window.confirm(`Permanently remove ${user.display_name} (${user.email || 'no email'})? This also ends their sessions.`)) return;
    setBusy(user.id);
    setError('');
    try {
      await send(`/api/admin/users/${user.id}`, 'DELETE');
      setNotice('Administrator removed.');
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not remove administrator.');
    } finally {
      setBusy(null);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>, user: User) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setBusy(user.id);
    try {
      const result = await send(`/api/admin/users/${user.id}/password`, 'POST', { password, confirmPassword });
      setChangingPassword(null);
      setNotice(result.signedOut ? 'Password changed. Sign in again with the new password.' : 'Password reset. The administrator must sign in again.');
      if (result.signedOut) window.location.assign('/admin/login');
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not change the password.');
    } finally {
      setBusy(null);
    }
  }

  return <div>
    {(error || notice) && <p role={error ? 'alert' : 'status'} className={`mb-4 rounded-xl border px-4 py-3 text-sm ${error ? 'border-[#e7c5bd] bg-[#fff2ee] text-[#873e31]' : 'border-[#c9dfce] bg-[#f0f8f1] text-[#28603d]'}`}>{error || notice}</p>}
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-[#64806d]">Manage CMS accounts, roles, sign-in access, and password resets.</p></div><button type="button" onClick={() => setAdding((value) => !value)} className="rounded-xl bg-[#17603d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#104b30]">{adding ? 'Close form' : '+ Add New Admin'}</button></div>

    {adding && <form onSubmit={createAdmin} className="mb-6 grid gap-4 rounded-2xl border border-[#dfe8e0] bg-white p-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Name<input required name="name" maxLength={120} className="mt-2 w-full rounded-lg border border-[#dfe8e0] px-3 py-2" /></label>
      <label className="text-sm font-medium">Email<input required type="email" name="email" maxLength={254} autoComplete="off" className="mt-2 w-full rounded-lg border border-[#dfe8e0] px-3 py-2" /></label>
      <label className="text-sm font-medium">Password<input required type="password" name="password" minLength={12} maxLength={72} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-[#dfe8e0] px-3 py-2" /><span className="mt-1 block text-xs font-normal text-[#718276]">At least 12 characters; passphrases are welcome.</span></label>
      <label className="text-sm font-medium">Confirm password<input required type="password" name="confirmPassword" minLength={12} maxLength={72} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-[#dfe8e0] px-3 py-2" /></label>
      <label className="text-sm font-medium">Role<select name="role" defaultValue="EDITOR" className="mt-2 w-full rounded-lg border border-[#dfe8e0] bg-white px-3 py-2">{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
      <div className="flex items-end"><button disabled={busy === 'create'} className="rounded-xl bg-[#17603d] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{busy === 'create' ? 'Creating…' : 'Create Admin'}</button></div>
    </form>}

    {loading ? <div className="rounded-2xl border border-[#e0e8df] bg-white p-6 text-sm text-[#718276]">Loading administrators…</div> : error && !users.length ? null : <div className="overflow-x-auto rounded-2xl border border-[#e0e8df] bg-white"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-wide text-[#748579]"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Created</th><th className="p-4">Last Login</th><th className="p-4">Actions</th></tr></thead><tbody>{users.map((user) => <Fragment key={user.id}><tr className="border-b align-top last:border-0">
      <td className="p-4 font-medium">{user.display_name}</td><td className="p-4">{user.email || '—'}</td><td className="p-4">{user.role}</td><td className="p-4"><span className={user.status === 'ACTIVE' ? 'text-[#28603d]' : 'text-[#873e31]'}>{user.status}</span>{!user.has_password && <span className="mt-1 block text-xs text-[#8a6940]">Password not set</span>}</td><td className="p-4 text-xs text-[#718276]">{new Date(user.created_at).toLocaleDateString()}</td><td className="p-4 text-xs text-[#718276]">{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}</td><td className="p-4"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setEditing(editing === user.id ? null : user.id); setChangingPassword(null); }} className="rounded-lg border border-[#dfe8e0] px-2.5 py-1.5 text-xs font-semibold">Edit</button><button type="button" onClick={() => { setChangingPassword(changingPassword === user.id ? null : user.id); setEditing(null); }} className="rounded-lg border border-[#dfe8e0] px-2.5 py-1.5 text-xs font-semibold">{user.has_password ? 'Reset password' : 'Set password'}</button><button type="button" disabled={busy === user.id} onClick={() => setStatus(user, user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE')} className="rounded-lg border border-[#dfe8e0] px-2.5 py-1.5 text-xs font-semibold disabled:opacity-50">{user.status === 'ACTIVE' ? 'Disable' : 'Enable'}</button><button type="button" disabled={busy === user.id} onClick={() => removeAdmin(user)} className="rounded-lg border border-[#e7c5bd] px-2.5 py-1.5 text-xs font-semibold text-[#873e31] disabled:opacity-50">Remove</button></div></td>
      </tr>{(editing === user.id || changingPassword === user.id) && <tr><td colSpan={7} className="p-4 pt-0">{editing === user.id ? <form onSubmit={(event) => saveAdmin(event, user)} className="grid gap-3 rounded-xl bg-[#f5f7f4] p-4 sm:grid-cols-4"><label className="text-xs font-semibold">Name<input name="name" required defaultValue={user.display_name} maxLength={120} className="mt-1 w-full rounded border px-2 py-2 text-sm" /></label><label className="text-xs font-semibold">Email<input type="email" name="email" required defaultValue={user.email || ''} maxLength={254} className="mt-1 w-full rounded border px-2 py-2 text-sm" /></label><label className="text-xs font-semibold">Role<select name="role" defaultValue={user.role} className="mt-1 w-full rounded border bg-white px-2 py-2 text-sm">{roles.map((role) => <option key={role}>{role}</option>)}</select></label><label className="text-xs font-semibold">Status<select name="status" defaultValue={user.status} className="mt-1 w-full rounded border bg-white px-2 py-2 text-sm"><option>ACTIVE</option><option>DISABLED</option></select></label><button disabled={busy === user.id} className="w-fit rounded-lg bg-[#17603d] px-3 py-2 text-xs font-semibold text-white">Save changes</button></form> : <form onSubmit={(event) => changePassword(event, user)} className="grid gap-3 rounded-xl bg-[#f5f7f4] p-4 sm:grid-cols-3"><label className="text-xs font-semibold">New password<input required type="password" name="password" minLength={12} maxLength={72} autoComplete="new-password" className="mt-1 w-full rounded border px-2 py-2 text-sm" /></label><label className="text-xs font-semibold">Confirm new password<input required type="password" name="confirmPassword" minLength={12} maxLength={72} autoComplete="new-password" className="mt-1 w-full rounded border px-2 py-2 text-sm" /></label><button disabled={busy === user.id} className="w-fit self-end rounded-lg bg-[#17603d] px-3 py-2 text-xs font-semibold text-white">Save password</button></form>}</td></tr>}</Fragment>)}</tbody></table>{!users.length && <p className="p-8 text-center text-sm text-[#718276]">No admin accounts have been created yet.</p>}</div>}
  </div>;
}
