import Link from 'next/link';
import { PasswordLoginForm } from '@/components/admin/PasswordLoginForm';

export default function AdminLoginPage() {
  return <main className="grid min-h-screen place-items-center bg-[#071b13] px-5 py-12 text-[#173d2b]"><section className="w-full max-w-md rounded-3xl bg-[#f7f8f4] p-8 shadow-2xl sm:p-10"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#4d8060]">Grow Here</p><h1 className="mt-4 text-3xl font-semibold">Editorial CMS</h1><p className="mt-3 text-sm leading-6 text-[#617567]">Sign in with your administrator email and password.</p><PasswordLoginForm/><Link href="/" className="mt-7 block text-center text-xs font-medium text-[#4d8060] hover:underline">← Return to website</Link></section></main>;
}
