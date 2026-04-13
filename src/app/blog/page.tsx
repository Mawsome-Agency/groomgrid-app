import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blog | GroomGrid - Pet Grooming Business Tips & Resources',
  description:
    'Expert tips and resources for pet grooming business owners. Learn about scheduling, client management, pricing, and growing your grooming business.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/',
  },
  openGraph: {
    title: 'Blog | GroomGrid - Pet Grooming Business Tips & Resources',
    description:
      'Expert tips and resources for pet grooming business owners. Learn about scheduling, client management, pricing, and growing your grooming business.',
    url: 'https://getgroomgrid.com/blog/',
    type: 'website',
  },
};

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'GroomGrid Blog',
  description:
    'Expert tips and resources for pet grooming business owners. Learn about scheduling, client management, pricing, and growing your grooming business.',
  url: 'https://getgroomgrid.com/blog/',
  blogPost: blogPosts.map(post => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `https://getgroomgrid.com/blog/${post.slug}/`,
    datePublished: post.publishedAt,
  })),
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* Header */}
      <header className="bg-green-50 border-b border-green-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-block text-green-600 hover:text-green-700 font-semibold text-sm mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            GroomGrid Blog
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl">
            Expert tips and resources for pet grooming business owners. Learn
            about scheduling, client management, pricing, and growing your
            grooming business.
          </p>
        </div>
      </header>

      {/* Blog Posts Grid */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block p-6 rounded-xl border border-stone-200 hover:border-green-300 hover:shadow-md transition-all"
            >
              <article>
                <h2 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-green-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {post.description}
                </p>
                <time className="text-xs text-stone-400">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </article>
            </Link>
          ))}
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-green-50 border-t border-green-100">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            Ready to streamline your grooming business?
          </h2>
          <p className="text-stone-600 mb-6 max-w-xl mx-auto">
            Join 50+ groomers already using GroomGrid to manage appointments,
            reduce no-shows, and get paid faster.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors"
          >
            Start Free Trial — 14 Days Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-stone-400 text-sm border-t border-stone-100">
        <p>
          © 2026 GroomGrid ·{' '}
          <a
            href="mailto:hello@getgroomgrid.com"
            className="hover:text-stone-600 transition-colors"
          >
            hello@getgroomgrid.com
          </a>
        </p>
      </footer>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </div>
  );
}
