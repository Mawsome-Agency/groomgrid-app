import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * /checkout — Redirect page
 *
 * Users navigating directly to /checkout are sent to /plans.
 * If a plan parameter is provided (e.g. /checkout?plan=solo),
 * it's passed through as /plans?selected=solo.
 *
 * This page exists because /checkout was returning 404 — there was
 * no page.tsx at this route, only sub-routes for success/cancel/error.
 */
export const metadata: Metadata = {
  title: 'Checkout | GroomGrid',
  robots: { index: false, follow: false },
};

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const plan = params.plan;

  if (plan) {
    redirect(`/plans?selected=${encodeURIComponent(plan)}`);
  }

  redirect('/plans');
}
