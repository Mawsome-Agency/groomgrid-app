'use client';

import { useState, useEffect } from 'react';

interface SpyFuKeyword {
  keyword: string;
  volume: number;
  cpc: number;
  difficulty: number;
  position: number;
}

interface CompetitorKeywords {
  [competitor: string]: SpyFuKeyword[];
}

interface CompetitorResearchData {
  competitors: string[];
  competitorKeywords: CompetitorKeywords;
  gapAnalysis: {
    totalOpportunities: number;
    keywords: SpyFuKeyword[];
  };
  questionKeywords: SpyFuKeyword[];
  prioritizedKeywords: SpyFuKeyword[];
}

export default function CompetitorResearchDashboard() {
  const [data, setData] = useState<CompetitorResearchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/seo/competitor-research');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error loading competitor research data</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-medium">No data available</h3>
        <p className="text-yellow-600">Competitor research data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Competitor Research Dashboard</h2>
        
        {/* Competitors Overview */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Competitors Analyzed</h3>
          <div className="flex flex-wrap gap-2">
            {data.competitors.map((competitor, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800"
              >
                {competitor}
              </span>
            ))}
          </div>
        </div>

        {/* Gap Analysis */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-gray-800">Gap Analysis</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {data.gapAnalysis.totalOpportunities} opportunities
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPC
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.gapAnalysis.keywords.slice(0, 10).map((keyword, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {keyword.keyword}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${keyword.cpc.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        keyword.difficulty < 30 ? 'bg-green-100 text-green-800' :
                        keyword.difficulty < 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {keyword.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prioritized Keywords */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Prioritized Keywords (Quick Wins)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.prioritizedKeywords.map((keyword, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">{keyword.keyword}</div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Vol: {keyword.volume.toLocaleString()}</span>
                  <span>CPC: ${keyword.cpc.toFixed(2)}</span>
                  <span>Diff: {keyword.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Keywords */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Question Keywords (Content Ideas)</h3>
          <div className="flex flex-wrap gap-2">
            {data.questionKeywords.slice(0, 20).map((keyword, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                {keyword.keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}