export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  year: number;
  tags: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  /** No case-study page yet — the archive card shows a coming-soon preview only. */
  comingSoon?: boolean;
}
