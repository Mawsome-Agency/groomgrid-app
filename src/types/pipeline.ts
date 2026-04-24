/**
 * Pipeline status page types
 *
 * These types mirror the GitHub PR API response shape
 * that /api/admin/pipeline proxies.
 */

export interface PipelineItem {
  number: number;
  title: string;
  html_url: string;
  state: string;
  draft: boolean;
  user: {
    login: string;
    avatar_url: string;
  } | null;
  head: {
    ref: string;
    sha: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PipelineResponse {
  pullRequests: PipelineItem[];
  fetchedAt: string;
  error?: string;
}
