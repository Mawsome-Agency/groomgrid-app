import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Your Free Trial — GroomGrid Pet Grooming Software',
  description:
    'Start your 14-day free trial of GroomGrid. No credit card required. Automated reminders, smart scheduling, and built-in payments for mobile groomers.',
  alternates: {
    canonical: 'https://getgroomgrid.com/signup',
  },
  openGraph: {
    title: 'Start Your Free Trial — GroomGrid Pet Grooming Software',
    description:
      'Start your 14-day free trial of GroomGrid. No credit card required. Automated reminders, smart scheduling, and built-in payments.',
    url: 'https://getgroomgrid.com/signup',
    siteName: 'GroomGrid',
    type: 'website',
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
