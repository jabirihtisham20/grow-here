import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy | Grow Here',
  description:
    'Learn how Grow Here may collect, use and protect information from site visitors, newsletter subscribers and contact forms.',
  keywords: ['Grow Here privacy policy', 'privacy policy', 'visitor data protection'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy | Grow Here',
    description:
      'Learn how Grow Here may collect, use and protect information from site visitors, newsletter subscribers and contact forms.',
    url: `${SITE_CONFIG.url}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 bg-forest-950 min-h-screen">
      <Container size="article">
        <div className="py-12 border-b border-forest-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-4">
            <span>Legal Notice</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-cream-100 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs text-botanical-muted font-mono">
            Last Updated: September 2026
          </p>
        </div>

        <div className="py-10 space-y-8 text-cream-400 font-sans leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Introduction
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              This policy explains the types of information Grow Here may collect, how that information may be used, and the choices available to visitors. Replace or update this policy to match the final analytics, newsletter, hosting and advertising tools used on the live website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Information You Provide
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              If you subscribe to a newsletter or submit a contact form, we may receive information such as your name, email address and the content of your message.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Automatic Information
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              The website may collect limited technical information such as browser type, device type, pages viewed, approximate location and referral source through hosting logs or analytics tools.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Cookies
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Cookies or similar technologies may be used for essential site functions, analytics, preferences or advertising if those services are enabled. Visitors should be given appropriate choices where required by law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              How Information Is Used
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Information may be used to operate the website, respond to enquiries, deliver requested newsletters, understand site performance, prevent abuse and improve content.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Third-Party Services
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Grow Here may use third-party hosting, analytics, email or security providers. Their handling of information is governed by their own terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Data Retention and Security
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              We aim to keep personal information only as long as needed for its intended purpose and use reasonable safeguards. No internet service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Your Choices
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              You may unsubscribe from marketing emails using the link in each message. Depending on your location, you may also have rights to access, correct or request deletion of personal information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Contact
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              For privacy questions, use the <Link href="/contact" className="text-warm-accent underline">Contact page</Link> and select Privacy or General Question as the topic.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
