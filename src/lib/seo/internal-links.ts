/**
 * SEO Internal Linking Architecture — Single Source of Truth
 *
 * This module is the canonical registry for all internal link data:
 * - Topic cluster definitions (which pages belong together)
 * - Related link generation (contextual, same-cluster-first)
 * - Footer link generation (SEO-optimized navigation)
 * - Breadcrumb data generation (JSON-LD structured data)
 *
 * All page files should import from this module instead of hardcoding
 * related links or footer links.
 */

import { blogPosts } from '@/lib/blog-posts';

// ────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────

export interface TopicCluster {
  id: string;
  name: string;
  slug: string;
  pages: ContentPage[];
}

export interface ContentPage {
  slug: string;
  title: string;
  type: 'blog' | 'landing';
  path: string;
}

export interface RelatedLinkItem {
  href: string;
  title: string;
  category?: string;
  description?: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

// ────────────────────────────────────────────────────────
// DATA: LANDING PAGES
// ────────────────────────────────────────────────────────

const landingPages: ContentPage[] = [
  {
    slug: 'best-dog-grooming-software',
    title: 'Best Dog Grooming Software (2026) — GroomGrid vs MoeGo vs DaySmart',
    type: 'landing',
    path: '/best-dog-grooming-software',
  },
  {
    slug: 'cat-grooming-software',
    title: 'Cat Grooming Software — Scheduling, Profiles & Reminders | GroomGrid',
    type: 'landing',
    path: '/cat-grooming-software',
  },
  {
    slug: 'dog-grooming-scheduling-software',
    title: 'Dog Grooming Scheduling Software',
    type: 'landing',
    path: '/dog-grooming-scheduling-software',
  },
  {
    slug: 'mobile-grooming-software',
    title: 'Mobile Grooming Software — Built for Van Groomers | GroomGrid',
    type: 'landing',
    path: '/mobile-grooming-software',
  },
  {
    slug: 'mobile-grooming-business',
    title: 'Mobile Grooming Business Guide',
    type: 'landing',
    path: '/mobile-grooming-business',
  },
  {
    slug: 'grooming-business-operations',
    title: 'Grooming Business Operations Hub',
    type: 'landing',
    path: '/grooming-business-operations',
  },
  {
    slug: 'moego-alternatives',
    title: 'MoeGo Alternatives: Better Grooming Software for Less | GroomGrid',
    type: 'landing',
    path: '/moego-alternatives',
  },
  {
    slug: 'daysmart-alternatives',
    title: 'DaySmart Alternatives: Why Groomers Are Switching',
    type: 'landing',
    path: '/daysmart-alternatives',
  },
  {
    slug: 'pawfinity-alternatives',
    title: 'Pawfinity Alternatives: Why Groomers Are Switching',
    type: 'landing',
    path: '/pawfinity-alternatives',
  },
  {
    slug: '123-pet-grooming-software-alternatives',
    title: '123 Pet Grooming Software Alternatives',
    type: 'landing',
    path: '/123-pet-grooming-software-alternatives',
  },
  {
    slug: 'pet-grooming-business-software',
    title: 'Pet Grooming Business Software — Manage Your Salon | GroomGrid',
    type: 'landing',
    path: '/pet-grooming-business-software',
  },
  {
    slug: 'features-mobile-groomer',
    title: 'Mobile Groomer Feature Spotlight',
    type: 'landing',
    path: '/features/mobile-groomer',
  },
];

// ────────────────────────────────────────────────────────
// DATA: BLOG PAGES (derived from blog-posts.ts)
// ────────────────────────────────────────────────────────

const blogPages: ContentPage[] = blogPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  type: 'blog' as const,
  path: `/blog/${post.slug}`,
}));

// ────────────────────────────────────────────────────────
// DATA: ALL CONTENT PAGES
// ────────────────────────────────────────────────────────

export const allContentPages: ContentPage[] = [
  ...landingPages,
  ...blogPages,
];

// ────────────────────────────────────────────────────────
// DATA: TOPIC CLUSTERS
// ────────────────────────────────────────────────────────

export const topicClusters: TopicCluster[] = [
  {
    id: 'software-comparison',
    name: 'Software & Comparison',
    slug: 'software-comparison',
    pages: [
      { slug: 'dog-grooming-software', title: "Dog Grooming Software: The 2026 Buyer's Guide", type: 'blog', path: '/blog/dog-grooming-software' },
      { slug: 'best-dog-grooming-software', title: 'Best Dog Grooming Software (2026) — GroomGrid vs MoeGo vs DaySmart', type: 'landing', path: '/best-dog-grooming-software' },
      { slug: 'moego-alternatives', title: 'MoeGo Alternatives: Better Grooming Software for Less | GroomGrid', type: 'landing', path: '/moego-alternatives' },
      { slug: 'daysmart-alternatives', title: 'DaySmart Alternatives', type: 'landing', path: '/daysmart-alternatives' },
      { slug: 'groomgrid-vs-moego', title: 'GroomGrid vs MoeGo', type: 'blog', path: '/blog/groomgrid-vs-moego' },
      { slug: 'groomgrid-vs-daysmart', title: 'GroomGrid vs DaySmart Pet', type: 'blog', path: '/blog/groomgrid-vs-daysmart' },
      { slug: 'groomgrid-vs-pawfinity', title: 'GroomGrid vs Pawfinity', type: 'blog', path: '/blog/groomgrid-vs-pawfinity' },
      { slug: 'pawfinity-alternatives', title: 'Pawfinity Alternatives', type: 'landing', path: '/pawfinity-alternatives' },
      { slug: 'pet-grooming-software', title: 'Pet Grooming Software: What It Is and Why Your Business Needs It', type: 'blog', path: '/blog/pet-grooming-software' },
      { slug: 'free-dog-grooming-software', title: 'Free Dog Grooming Software: What You Actually Get', type: 'blog', path: '/blog/free-dog-grooming-software' },
      { slug: 'best-pet-grooming-software', title: 'Best Pet Grooming Software in 2026', type: 'blog', path: '/blog/best-pet-grooming-software' },
      { slug: 'dog-grooming-appointment-app', title: 'Best Dog Grooming Appointment App', type: 'blog', path: '/blog/dog-grooming-appointment-app' },
      { slug: '123-pet-grooming-software-alternatives', title: '123 Pet Grooming Software Alternatives', type: 'landing', path: '/123-pet-grooming-software-alternatives' },
      { slug: 'pet-grooming-business-software', title: 'Pet Grooming Business Software — Manage Your Salon | GroomGrid', type: 'landing', path: '/pet-grooming-business-software' },
      { slug: 'dog-grooming-scheduling-software', title: 'Dog Grooming Scheduling Software', type: 'landing', path: '/dog-grooming-scheduling-software' },
    ],
  },
  {
    id: 'business-starting',
    name: 'Starting a Grooming Business',
    slug: 'business-starting',
    pages: [
      { slug: 'how-to-start-mobile-grooming-business', title: 'How to Start a Mobile Dog Grooming Business', type: 'blog', path: '/blog/how-to-start-mobile-grooming-business' },
      { slug: 'how-to-start-a-mobile-dog-grooming-business', title: 'How to Start a Mobile Dog Grooming Business: The Complete Guide', type: 'blog', path: '/blog/how-to-start-a-mobile-dog-grooming-business' },
      { slug: 'how-to-start-dog-grooming-business-at-home', title: 'How to Start a Dog Grooming Business at Home', type: 'blog', path: '/blog/how-to-start-dog-grooming-business-at-home' },
      { slug: 'how-to-open-a-pet-grooming-business', title: 'How to Open a Pet Grooming Business', type: 'blog', path: '/blog/how-to-open-a-pet-grooming-business' },
      { slug: 'how-much-to-start-dog-grooming-business', title: 'How Much Does It Cost to Start a Dog Grooming Business?', type: 'blog', path: '/blog/how-much-to-start-dog-grooming-business' },
      { slug: 'is-dog-grooming-a-profitable-business', title: 'Is Dog Grooming a Profitable Business?', type: 'blog', path: '/blog/is-dog-grooming-a-profitable-business' },
      { slug: 'dog-grooming-business-plan-template', title: 'Dog Grooming Business Plan Template', type: 'blog', path: '/blog/dog-grooming-business-plan-template' },
      { slug: 'mobile-dog-grooming-business-plan', title: 'Mobile Dog Grooming Business Plan', type: 'blog', path: '/blog/mobile-dog-grooming-business-plan' },
      { slug: 'mobile-grooming-business', title: 'Mobile Grooming Business Guide', type: 'landing', path: '/mobile-grooming-business' },
    ],
  },
  {
    id: 'mobile-grooming',
    name: 'Mobile Grooming',
    slug: 'mobile-grooming',
    pages: [
      { slug: 'how-to-start-mobile-grooming-business', title: 'How to Start a Mobile Dog Grooming Business', type: 'blog', path: '/blog/how-to-start-mobile-grooming-business' },
      { slug: 'how-to-start-a-mobile-dog-grooming-business', title: 'How to Start a Mobile Dog Grooming Business: The Complete Guide', type: 'blog', path: '/blog/how-to-start-a-mobile-dog-grooming-business' },
      { slug: 'mobile-dog-grooming-business-plan', title: 'Mobile Dog Grooming Business Plan', type: 'blog', path: '/blog/mobile-dog-grooming-business-plan' },
      { slug: 'mobile-dog-grooming-business-tips', title: 'Mobile Dog Grooming Business Tips', type: 'blog', path: '/blog/mobile-dog-grooming-business-tips' },
      { slug: 'how-to-build-mobile-grooming-trailer', title: 'How to Build a Mobile Grooming Trailer', type: 'blog', path: '/blog/how-to-build-mobile-grooming-trailer' },
      { slug: 'mobile-grooming-business', title: 'Mobile Grooming Business Guide', type: 'landing', path: '/mobile-grooming-business' },
      { slug: 'mobile-grooming-software', title: 'Mobile Grooming Software — Built for Van Groomers | GroomGrid', type: 'landing', path: '/mobile-grooming-software' },
      { slug: 'features-mobile-groomer', title: 'Mobile Groomer Feature Spotlight', type: 'landing', path: '/features/mobile-groomer' },
    ],
  },
  {
    id: 'operations',
    name: 'Business Operations',
    slug: 'operations',
    pages: [
      { slug: 'dog-grooming-business-management', title: 'Dog Grooming Business Management: The Complete Guide', type: 'blog', path: '/blog/dog-grooming-business-management' },
      { slug: 'reduce-no-shows-dog-grooming', title: 'How to Reduce No-Shows in Your Dog Grooming Business', type: 'blog', path: '/blog/reduce-no-shows-dog-grooming' },
      { slug: 'how-to-increase-sales-dog-grooming-business', title: 'How to Increase Sales in Your Dog Grooming Business', type: 'blog', path: '/blog/how-to-increase-sales-dog-grooming-business' },
      { slug: 'dog-grooming-client-intake-form', title: 'Dog Grooming Client Intake Form', type: 'blog', path: '/blog/dog-grooming-client-intake-form' },
      { slug: 'dog-grooming-contract-template', title: 'Dog Grooming Contract Template', type: 'blog', path: '/blog/dog-grooming-contract-template' },
      { slug: 'dog-grooming-waiver-template', title: 'Dog Grooming Waiver Template', type: 'blog', path: '/blog/dog-grooming-waiver-template' },
      { slug: 'grooming-business-operations', title: 'Grooming Business Operations Hub', type: 'landing', path: '/grooming-business-operations' },
    ],
  },
  {
    id: 'pricing',
    name: 'Pricing & Revenue',
    slug: 'pricing',
    pages: [
      { slug: 'dog-grooming-pricing-guide', title: 'Dog Grooming Pricing Guide: How Much to Charge in 2026', type: 'blog', path: '/blog/dog-grooming-pricing-guide' },
      { slug: 'how-much-do-dog-groomers-make', title: 'How Much Do Dog Groomers Make?', type: 'blog', path: '/blog/how-much-do-dog-groomers-make' },
      { slug: 'is-dog-grooming-a-profitable-business', title: 'Is Dog Grooming a Profitable Business?', type: 'blog', path: '/blog/is-dog-grooming-a-profitable-business' },
      { slug: 'how-much-to-start-dog-grooming-business', title: 'How Much Does It Cost to Start a Dog Grooming Business?', type: 'blog', path: '/blog/how-much-to-start-dog-grooming-business' },
      { slug: 'how-to-increase-sales-dog-grooming-business', title: 'How to Increase Sales in Your Dog Grooming Business', type: 'blog', path: '/blog/how-to-increase-sales-dog-grooming-business' },
      { slug: 'do-you-tip-dog-groomers', title: 'Do You Tip Dog Groomers?', type: 'blog', path: '/blog/do-you-tip-dog-groomers' },
    ],
  },
  {
    id: 'career',
    name: 'Grooming Career',
    slug: 'career',
    pages: [
      { slug: 'how-to-become-a-dog-groomer', title: 'How to Become a Dog Groomer', type: 'blog', path: '/blog/how-to-become-a-dog-groomer' },
      { slug: 'how-much-do-dog-groomers-make', title: 'How Much Do Dog Groomers Make?', type: 'blog', path: '/blog/how-much-do-dog-groomers-make' },
      { slug: 'dog-grooming-business-insurance', title: 'Dog Grooming Business Insurance', type: 'blog', path: '/blog/dog-grooming-business-insurance' },
      { slug: 'do-you-tip-dog-groomers', title: 'Do You Tip Dog Groomers?', type: 'blog', path: '/blog/do-you-tip-dog-groomers' },
    ],
  },
  {
    id: 'cat-grooming',
    name: 'Cat Grooming',
    slug: 'cat-grooming',
    pages: [
      { slug: 'cat-grooming-business-guide', title: 'How to Start a Cat Grooming Business', type: 'blog', path: '/blog/cat-grooming-business-guide' },
      { slug: 'cat-grooming-software', title: 'Cat Grooming Software — Scheduling, Profiles & Reminders | GroomGrid', type: 'landing', path: '/cat-grooming-software' },
    ],
  },
  {
    id: 'tools-equipment',
    name: 'Tools & Equipment',
    slug: 'tools-equipment',
    pages: [
      { slug: 'dog-grooming-tools-equipment-list', title: 'Dog Grooming Tools & Equipment List', type: 'blog', path: '/blog/dog-grooming-tools-equipment-list' },
      { slug: 'how-to-build-mobile-grooming-trailer', title: 'How to Build a Mobile Grooming Trailer', type: 'blog', path: '/blog/how-to-build-mobile-grooming-trailer' },
      { slug: 'dog-grooming-waiver-template', title: 'Dog Grooming Waiver Template', type: 'blog', path: '/blog/dog-grooming-waiver-template' },
      { slug: 'dog-grooming-contract-template', title: 'Dog Grooming Contract Template', type: 'blog', path: '/blog/dog-grooming-contract-template' },
      { slug: 'dog-grooming-client-intake-form', title: 'Dog Grooming Client Intake Form', type: 'blog', path: '/blog/dog-grooming-client-intake-form' },
    ],
  },
];

// ────────────────────────────────────────────────────────
// HELPER: Build lookup maps
// ────────────────────────────────────────────────────────

const pageBySlug = new Map<string, ContentPage>();
allContentPages.forEach((page) => pageBySlug.set(page.slug, page));

const clusterBySlug = new Map<string, TopicCluster>();
topicClusters.forEach((cluster) => {
  cluster.pages.forEach((page) => {
    // Only set primary cluster (first occurrence wins)
    if (!clusterBySlug.has(page.slug)) {
      clusterBySlug.set(page.slug, cluster);
    }
  });
});

// ────────────────────────────────────────────────────────
// HELPER: Normalize slug
// ────────────────────────────────────────────────────────

function normalizeSlug(slug: string): string {
  return slug
    .replace(/^\/+/, '')   // Remove leading slashes
    .replace(/\/+$/, '')   // Remove trailing slashes
    .replace(/^blog\//, ''); // Remove blog/ prefix if present
}

// ────────────────────────────────────────────────────────
// HELPER: Blog post descriptions lookup
// ────────────────────────────────────────────────────────

const blogDescriptions = new Map<string, string>();
blogPosts.forEach((post) => blogDescriptions.set(post.slug, post.description));

// ────────────────────────────────────────────────────────
// HELPER: Cluster names for category labels
// ────────────────────────────────────────────────────────

const categoryNames: Record<string, string> = {
  'software-comparison': 'Software & Comparison',
  'business-starting': 'Business',
  'mobile-grooming': 'Mobile Grooming',
  'operations': 'Operations',
  'pricing': 'Pricing & Revenue',
  'career': 'Career',
  'cat-grooming': 'Cat Grooming',
  'tools-equipment': 'Tools & Equipment',
};

// ────────────────────────────────────────────────────────
// getRelatedLinks — CORE FUNCTION
// ────────────────────────────────────────────────────────

export function getRelatedLinks(
  slug: string,
  options?: { variant?: 'landing' | 'blog' }
): RelatedLinkItem[] {
  const normalizedSlug = normalizeSlug(slug ?? '');
  const variant = options?.variant ?? 'blog';

  // Handle unknown/empty slugs — return popular pages
  if (!normalizedSlug || !pageBySlug.has(normalizedSlug)) {
    return getDefaultRelatedLinks(variant);
  }

  // Collect same-cluster pages (excluding current page)
  const primaryCluster = clusterBySlug.get(normalizedSlug);
  const sameClusterPages: ContentPage[] = primaryCluster
    ? primaryCluster.pages.filter((p) => p.slug !== normalizedSlug)
    : [];

  // Collect cross-cluster pages (excluding current and same-cluster)
  const sameClusterSlugSet = new Set(sameClusterPages.map((p) => p.slug));
  const crossClusterPages: ContentPage[] = allContentPages.filter(
    (p) => p.slug !== normalizedSlug && !sameClusterSlugSet.has(p.slug)
  );

  // Build related links: same-cluster first, then cross-cluster
  const results: RelatedLinkItem[] = [];

  // Add same-cluster pages (up to 4)
  const sameClusterSlice = sameClusterPages.slice(0, 4);
  for (const page of sameClusterSlice) {
    results.push(buildLinkItem(page, variant));
  }

  // Add cross-cluster pages to fill up to 6 total
  const remaining = 6 - results.length;
  if (remaining > 0 && crossClusterPages.length > 0) {
    const crossSlice = deterministicSlice(crossClusterPages, normalizedSlug, remaining);
    for (const page of crossSlice) {
      results.push(buildLinkItem(page, variant));
    }
  }

  return results;
}

// ────────────────────────────────────────────────────────
// HELPER: Build a RelatedLinkItem from a ContentPage
// ────────────────────────────────────────────────────────

function buildLinkItem(page: ContentPage, variant: 'landing' | 'blog'): RelatedLinkItem {
  const item: RelatedLinkItem = {
    href: page.path,
    title: page.title,
  };

  if (variant === 'landing') {
    const cluster = clusterBySlug.get(page.slug);
    if (cluster) {
      item.category = categoryNames[cluster.slug] ?? cluster.name;
    }
  }

  if (variant === 'blog') {
    const desc = blogDescriptions.get(page.slug);
    if (desc) {
      item.description = desc;
    }
  }

  return item;
}

// ────────────────────────────────────────────────────────
// HELPER: Default related links for unknown slugs
// ────────────────────────────────────────────────────────

function getDefaultRelatedLinks(variant: 'landing' | 'blog'): RelatedLinkItem[] {
  const defaultSlugs = [
    'best-dog-grooming-software',
    'mobile-grooming-software',
    'cat-grooming-software',
    'dog-grooming-software',
    'how-to-start-mobile-grooming-business',
    'reduce-no-shows-dog-grooming',
  ];

  return defaultSlugs
    .filter((slug) => pageBySlug.has(slug))
    .map((slug) => buildLinkItem(pageBySlug.get(slug)!, variant));
}

// ────────────────────────────────────────────────────────
// HELPER: Deterministic slice — same slug always gets same results
// ────────────────────────────────────────────────────────

function deterministicSlice<T>(arr: T[], seed: string, count: number): T[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const chr = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + chr) | 0;
  }
  const offset = Math.abs(hash) % Math.max(arr.length, 1);
  const rotated = [...arr.slice(offset), ...arr.slice(0, offset)];
  return rotated.slice(0, count);
}

// ────────────────────────────────────────────────────────
// Footer Column Types & Generation
// ────────────────────────────────────────────────────────

export interface FooterColumnLink {
  href: string;
  label: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterColumnLink[];
}

export function getFooterColumns(slug?: string): FooterColumn[] {
  const columns: FooterColumn[] = [
    {
      heading: 'Software',
      links: [
        { href: '/best-dog-grooming-software', label: 'Best Dog Grooming Software' },
        { href: '/pet-grooming-business-software', label: 'Pet Grooming Business Software' },
        { href: '/mobile-grooming-software', label: 'Mobile Grooming Software' },
        { href: '/cat-grooming-software', label: 'Cat Grooming Software' },
      ],
    },
    {
      heading: 'Comparisons',
      links: [
        { href: '/moego-alternatives', label: 'MoeGo Alternatives' },
        { href: '/dog-grooming-scheduling-software', label: 'Dog Grooming Scheduling' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { href: '/blog', label: 'Blog' },
        { href: '/blog/dog-grooming-business-plan-template', label: 'Business Plan Template' },
        { href: '/blog/reduce-no-shows-dog-grooming', label: 'Reduce No-Shows' },
        { href: '/blog/free-dog-grooming-software', label: 'Free Grooming Software' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { href: '/plans', label: 'Pricing' },
        { href: '/signup', label: 'Start Free Trial' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
      ],
    },
  ];

  return columns;
}

// ────────────────────────────────────────────────────────
// getFooterLinks — FOOTER LINK GENERATION
// ────────────────────────────────────────────────────────

export function getFooterLinks(slug?: string): { href: string; label: string }[] {
  const baseLinks: { href: string; label: string }[] = [
    { href: '/plans', label: 'Pricing' },
    { href: '/signup', label: 'Sign Up' },
  ];

  if (slug) {
    const normalizedSlug = normalizeSlug(slug);
    const cluster = clusterBySlug.get(normalizedSlug);

    if (cluster) {
      const clusterLanding = cluster.pages.find((p) => p.type === 'landing');
      if (clusterLanding && clusterLanding.slug !== normalizedSlug) {
        baseLinks.push({
          href: clusterLanding.path,
          label: cluster.name,
        });
      }
    }

    if (!baseLinks.some((l) => l.href === '/mobile-grooming-software')) {
      baseLinks.push({ href: '/mobile-grooming-software', label: 'Mobile Grooming' });
    }

    if (!baseLinks.some((l) => l.href === '/grooming-business-operations')) {
      baseLinks.push({ href: '/grooming-business-operations', label: 'Operations Hub' });
    }
  } else {
    baseLinks.push({ href: '/mobile-grooming-software', label: 'Mobile Grooming' });
    baseLinks.push({ href: '/grooming-business-operations', label: 'Operations Hub' });
    baseLinks.push({ href: '/cat-grooming-software', label: 'Cat Grooming' });
  }

  return baseLinks;
}

// ────────────────────────────────────────────────────────
// getBreadcrumbs — BREADCRUMB GENERATION (JSON-LD compatible)
// ────────────────────────────────────────────────────────

export function getBreadcrumbs(slug: string): BreadcrumbItem[] {
  const normalizedSlug = normalizeSlug(slug ?? '');

  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  if (!normalizedSlug || !pageBySlug.has(normalizedSlug)) {
    return crumbs;
  }

  const currentPage = pageBySlug.get(normalizedSlug)!;

  // Blog pages get: Home > Blog > Post Title
  if (currentPage.type === 'blog') {
    crumbs.push({ label: 'Blog', href: '/blog' });
  }

  crumbs.push({
    label: currentPage.title,
    href: currentPage.path,
  });

  return crumbs;
}
