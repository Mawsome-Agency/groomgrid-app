import CompetitorResearchDashboard from '@/components/seo/CompetitorResearchDashboard';

export default function SEOAdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">SEO Competitor Research</h1>
        <p className="text-gray-600 mt-2">
          Analyze competitor keywords and identify content opportunities
        </p>
      </div>
      
      <CompetitorResearchDashboard />
    </div>
  );
}