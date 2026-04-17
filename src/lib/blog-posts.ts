export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'dog-grooming-waiver-template',
    title: 'Dog Grooming Waiver Template: Free Liability Waiver for Professional Groomers',
    description: 'Protect your grooming business with a free dog grooming waiver template. Covers senior dogs, matting, medical emergencies, and behavioral risks — ready to customize and use.',
    publishedAt: '2026-04-17',
  },
  {
    slug: 'dog-grooming-software',
    title: 'Dog Grooming Software: The 2026 Buyer\'s Guide for Professional Groomers',
    description: 'Compare the best dog grooming software for 2026. Covers scheduling, client records, automated reminders, payments, and what to look for before you buy.',
    publishedAt: '2026-04-17',
  },
  {
    slug: 'dog-grooming-business-management',
    title: 'Dog Grooming Business Management: The Complete Guide',
    description: 'Learn how to manage your dog grooming business like a pro — scheduling, client retention, deposits, payments, and the tools that make it all click.',
    publishedAt: '2026-04-01',
  },
  {
    slug: 'dog-grooming-contract-template',
    title: 'Dog Grooming Contract Template: What to Include and Why',
    description: 'Protect your grooming business with a solid client contract. Here\'s exactly what to include, plus a ready-to-use dog grooming contract template.',
    publishedAt: '2026-04-02',
  },
  {
    slug: 'how-to-start-mobile-grooming-business',
    title: 'How to Start a Mobile Dog Grooming Business: Step-by-Step Guide',
    description: 'Everything you need to launch a mobile dog grooming business — licensing, equipment, pricing, finding first clients, and the tools that run it all.',
    publishedAt: '2026-04-03',
  },
  {
    slug: 'is-dog-grooming-a-profitable-business',
    title: 'Is Dog Grooming a Profitable Business? Real Numbers, Real Talk',
    description: 'Dog grooming can be highly profitable — but only if the numbers work. Here\'s the real breakdown: revenue potential, expenses, margins, and what it takes to actually make money grooming dogs.',
    publishedAt: '2026-04-04',
  },
  {
    slug: 'mobile-dog-grooming-business-plan',
    title: 'Mobile Dog Grooming Business Plan: The Complete Template',
    description: 'Build a profitable mobile dog grooming business with this complete business plan guide — covering pricing, routes, equipment, and client acquisition.',
    publishedAt: '2026-04-05',
  },
  {
    slug: 'reduce-no-shows-dog-grooming',
    title: 'How to Reduce No-Shows in Your Dog Grooming Business',
    description: 'Cut grooming no-shows by 60% with automated reminders, deposit policies, and a multi-touch follow-up strategy. Real tactics groomers use every day.',
    publishedAt: '2026-04-06',
  },
].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
