import { getRelatedLinks } from '@/lib/seo/internal-links';
import RelatedLinks from '@/components/marketing/RelatedLinks';

interface PageRelatedLinksProps {
  slug: string;
  variant?: 'blog' | 'landing';
  heading?: string;
  columns?: 2 | 3 | 4;
}

export default function PageRelatedLinks({
  slug,
  variant = 'blog',
  heading,
  columns = 3,
}: PageRelatedLinksProps) {
  const links = getRelatedLinks(slug, { variant });

  if (!links || links.length === 0) return null;

  return (
    <RelatedLinks
      links={links}
      variant={variant}
      heading={heading}
      columns={columns}
    />
  );
}
