import { redirect } from 'next/navigation';
import { getCmsUser } from '@/lib/cms/auth';
import { UsersTable } from '@/components/admin/UsersTable';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const user = await getCmsUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'SUPER_ADMIN') redirect('/admin');
  return <div><h1 className="text-3xl font-semibold">Admins &amp; Access</h1><p className="mb-6 mt-2 text-sm text-[#64806d]">Only SUPER_ADMIN accounts can create administrators, change roles, reset passwords, or manage account access.</p><UsersTable/></div>;
}
