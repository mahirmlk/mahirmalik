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
}
