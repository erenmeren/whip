import axios from 'axios';
import { JobSearchResult } from '../models/search';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const axiosConfig = {
  baseURL: 'http://localhost:3000/',
};

// eslint-disable-next-line import/prefer-default-export
export const search = async (
  keyword: string,
  location: string,
  jobType: string
): Promise<JobSearchResult[]> => {
  const res = await axios.get<JobSearchResult[]>(
    `api/job/search?keyword=${keyword}&location=${location}&jobType=${jobType}`
  );

  // Return properties
  return res.data;
};
