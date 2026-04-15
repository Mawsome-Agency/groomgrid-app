# SEO Competitor Research Feature

This feature provides insights into competitor keywords and identifies content opportunities for GroomGrid.

## Features

1. **Competitor Keyword Analysis** - Fetches organic and valuable keywords from top competitors
2. **Gap Analysis** - Identifies keywords competitors rank for that we don't have content for
3. **Question Keywords** - Generates content ideas based on question-based keywords
4. **Keyword Prioritization** - Ranks keywords by difficulty and volume for quick wins

## How It Works

### API Endpoint
```
GET /api/seo/competitor-research
```

Returns a JSON object with:
- Competitor keywords data
- Gap analysis results
- Question keywords for content ideas
- Prioritized keywords list

### Competitors Analyzed
- moego.com
- daysmart.com
- pawfinity.com

### Key Metrics
- **Volume**: Search volume for the keyword
- **CPC**: Cost per click (advertising value)
- **Difficulty**: How hard it is to rank for this keyword (0-100)
- **Position**: Competitor's average ranking position

## Implementation Details

### Files
- `src/lib/spyfu.ts` - SpyFu API client and helper functions
- `src/lib/content-analysis.ts` - Content analysis utilities
- `src/app/api/seo/competitor-research/route.ts` - API endpoint
- `src/components/seo/CompetitorResearchDashboard.tsx` - Frontend component
- `src/app/admin/seo/page.tsx` - Admin page to view results

### Functions
- `getCompetitorKeywords()` - Fetch keywords from competitors
- `performGapAnalysis()` - Identify missing content opportunities
- `getQuestionKeywords()` - Generate content ideas
- `prioritizeKeywords()` - Rank keywords by opportunity

## Usage

1. Ensure `SPYFU_API_SECRET` is set in environment variables
2. Visit `/admin/seo` to view the dashboard
3. Or call the API endpoint directly: `/api/seo/competitor-research`

## Data Interpretation

### Gap Analysis
Keywords with volume > 100 that we don't have content for represent opportunities.

### Prioritized Keywords
Keywords with:
- Difficulty < 50 (easier to rank for)
- High volume (more traffic potential)
- Sorted by difficulty first, then volume

### Question Keywords
Content ideas based on what people are searching for in question format.

## Next Steps

1. Create content for prioritized keywords
2. Monitor rankings after publishing new content
3. Regularly refresh competitor research data
4. Expand to analyze additional competitors