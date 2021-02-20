/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { JobSearchResult } from '../../../models/search';

const axiosConfig = {
  baseURL: 'http://localhost:8080/',
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<JobSearchResult[]>
) => {
  const { keyword, location, jobType } = req.query;

  const response = await axios.get<JobSearchResult[]>(
    `job/search?keyword=${keyword}&location=${location}&jobType=${jobType}`,
    axiosConfig
  );

  res.json(response.data);
};
