'use client';

import Script from 'next/script';

interface SchemaScriptProps {
  id: string;
  schema: Record<string, unknown>;
}

/**
 * SchemaScript Component
 * 
 * Injects JSON-LD structured data into the page head.
 * Use this to add Schema.org markup for SEO and rich snippets.
 * 
 * Example:
 * ```tsx
 * <SchemaScript 
 *   id="breadcrumb-schema" 
 *   schema={generateBreadcrumbListSchema('best-dog-grooming-software')} 
 * />
 * ```
 */
export function SchemaScript({ id, schema }: SchemaScriptProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default SchemaScript;
