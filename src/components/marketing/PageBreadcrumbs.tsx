import { getBreadcrumbs } from '@/lib/seo/internal-links';
import Breadcrumbs from '@/components/marketing/Breadcrumbs';

interface PageBreadcrumbsProps {
  slug: string;
}

export default function PageBreadcrumbs({ slug }: PageBreadcrumbsProps) {
  const items = getBreadcrumbs(slug);

  if (!items || items.length === 0) return null;

  return <Breadcrumbs items={items} />;
}
