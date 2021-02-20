export interface JobSearchResult {
  id: string;
  title: string;
  subtitle?: string;
  salary?: string;
  jobType: string;
  location: string;
  jobDescription: string;
  postedDate: string;
  companyName?: string;
  providerName: string;
  jobURL: string;
}
