/**
 * Schema.org JSON-LD Generation Utilities
 * 
 * Helper functions for generating structured data markup for SEO.
 * All functions return objects that can be serialized to JSON-LD.
 */

import { getBreadcrumbs, BreadcrumbItem } from './internal-links';

// Base URL for all schema references
const BASE_URL = 'https://getgroomgrid.com';

// Organization data (shared across all schemas)
const ORGANIZATION_DATA = {
  '@type': 'Organization' as const,
  '@id': `${BASE_URL}/#organization`,
  name: 'GroomGrid',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject' as const,
    url: `${BASE_URL}/favicon.ico`,
  },
  description:
    'AI-powered pet grooming business management platform — scheduling, client records, reminders, and payments.',
};

/**
 * Generate BreadcrumbList schema for a page
 * @param slug - The page slug (e.g., "best-dog-grooming-software" or "blog/how-to-start")
 * @returns BreadcrumbList schema object
 */
export function generateBreadcrumbListSchema(slug: string): Record<string, unknown> {
  const breadcrumbs = getBreadcrumbs(slug);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${BASE_URL}${crumb.href}`,
    })),
  };
}

/**
 * Generate HowTo schema for step-by-step guides
 * @param title - The how-to title
 * @param description - Brief description
 * @param steps - Array of step objects with name and text
 * @param options - Additional metadata (totalTime, supplies, tools)
 * @returns HowTo schema object
 */
export function generateHowToSchema(
  title: string,
  description: string,
  steps: Array<{ name: string; text: string; url?: string }>,
  options?: {
    totalTime?: string; // ISO 8601 duration format (e.g., "PT2M")
    supplies?: string[];
    tools?: string[];
    image?: string;
  }
): Record<string, unknown> {
  const howToSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
    })),
  };

  if (options?.totalTime) {
    howToSchema.totalTime = options.totalTime;
  }

  if (options?.image) {
    howToSchema.image = {
      '@type': 'ImageObject',
      url: options.image,
    };
  }

  if (options?.supplies && options.supplies.length > 0) {
    howToSchema.supply = options.supplies.map((supply) => ({
      '@type': 'HowToSupply',
      name: supply,
    }));
  }

  if (options?.tools && options.tools.length > 0) {
    howToSchema.tool = options.tools.map((tool) => ({
      '@type': 'HowToTool',
      name: tool,
    }));
  }

  return howToSchema;
}

/**
 * Generate SoftwareApplication schema with review
 * @param name - Software name
 * @param description - Software description
 * @param url - Software URL
 * @param reviewRating - Rating value (1-5)
 * @param reviewCount - Number of reviews
 * @returns SoftwareApplication schema with aggregate rating
 */
export function generateSoftwareApplicationReviewSchema(
  name: string,
  description: string,
  url: string,
  reviewRating: number,
  reviewCount: number
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    description: description,
    url: url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviewRating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      reviewCount: reviewCount.toString(),
    },
    publisher: ORGANIZATION_DATA,
  };
}

/**
 * Generate Review schema for a product comparison
 * @param itemName - Product being reviewed
 * @param reviewBody - Review text
 * @param ratingValue - Rating (1-5)
 * @param authorName - Review author
 * @returns Review schema object
 */
export function generateReviewSchema(
  itemName: string,
  itemType: 'SoftwareApplication' | 'Service',
  reviewBody: string,
  ratingValue: number,
  authorName: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': itemType,
      name: itemName,
      url: BASE_URL,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: ratingValue.toString(),
      bestRating: '5',
    },
    reviewBody: reviewBody,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GroomGrid',
      url: BASE_URL,
    },
  };
}

/**
 * Generate Article schema
 * @param title - Article title
 * @param description - Article description
 * @param url - Article URL
 * @param datePublished - Publication date (ISO 8601)
 * @param dateModified - Last modified date (ISO 8601)
 * @param image - Article featured image URL
 * @returns Article schema object
 */
export function generateArticleSchema(
  title: string,
  description: string,
  url: string,
  datePublished: string,
  dateModified: string,
  image?: string
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    dateModified: dateModified,
    publisher: {
      '@type': 'Organization',
      name: 'GroomGrid',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  if (image) {
    schema.image = {
      '@type': 'ImageObject',
      url: image,
    };
  }

  return schema;
}

/**
 * Generate FAQPage schema
 * @param faqs - Array of FAQ items with question and answer
 * @returns FAQPage schema object
 */
export function generateFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Service schema
 * @param name - Service name
 * @param description - Service description
 * @param url - Service URL
 * @param price - Service price
 * @returns Service schema object
 */
export function generateServiceSchema(
  name: string,
  description: string,
  url: string,
  price?: number
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: name,
    description: description,
    provider: ORGANIZATION_DATA,
    url: url,
  };

  if (price) {
    schema.offers = {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
    };
  }

  return schema;
}

/**
 * Default OG image URL for social sharing
 */
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * Generate Open Graph metadata
 * @param title - Page title
 * @param description - Page description
 * @param url - Page URL
 * @param image - Optional custom image URL
 * @returns Open Graph metadata object
 */
export function generateOpenGraph(
  title: string,
  description: string,
  url: string,
  image?: string
) {
  return {
    title: title,
    description: description,
    url: url,
    siteName: 'GroomGrid',
    type: 'website' as const,
    images: [
      {
        url: image || DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}

/**
 * Combine multiple schemas into a single @graph
 * @param schemas - Array of schema objects
 * @returns Combined schema with @graph
 */
export function combineSchemas(...schemas: Array<Record<string, unknown>>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map((schema) => {
      // Remove @context from nested schemas
      const { '@context': _, ...rest } = schema;
      return rest;
    }),
  };
}
