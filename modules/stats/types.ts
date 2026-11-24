export interface PeriodFilter {
  days?: number;
}

export interface DashboardStats {
  totals: {
    applications: number;
    published: number;
    development: number;
    categories: number;
    views: number;
    clicks: number;
    downloads: number;
  };
  topViewed: { id: string; name: string; slug: string; views: number }[];
  topDownloaded: { id: string; name: string; slug: string; downloads: number }[];
  timeline: { date: string; views: number; clicks: number; downloads: number }[];
  recentActivity: {
    id: string;
    action: string;
    entityType: string;
    createdAt: string;
    adminName: string | null;
  }[];
  newPublished: { id: string; name: string; slug: string; releasedAt: string | null }[];
}
