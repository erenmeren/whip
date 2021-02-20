/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import { NextPage } from 'next';
import { JobSearchResult } from '../models/search';
import { search } from '../utils/job';

interface Props {
  jobAds: JobSearchResult[];
}

const Home: NextPage<Props> = (): JSX.Element => {
  const [jobAds, setJobAds] = useState<JobSearchResult[]>([]);
  const [selectedJobAds, setSelectedJobAds] = useState<JobSearchResult>();
  const [filteredJobAds, setFilteredJobAds] = useState<JobSearchResult[]>([]);
  const [location, setLocation] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [jobType, setJobType] = useState<string>('ALL');

  const searchJob = async () => {
    const result = await search(keyword, location, jobType);
    setJobAds(result);
    if (result.length > 0) setSelectedJobAds(result[0]);
    setFilteredJobAds(result);
  };

  const selectJob = (jobId: string) =>
    filteredJobAds
      .filter((obj) => obj.id === jobId)
      .map((obj) => setSelectedJobAds(obj));

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div>
      <div className="container">
        <div className="columns">
          <div className="column">
            <div className="field">
              <div className="control">
                <label
                  htmlFor="keyword"
                  className="label"
                  style={{ color: '#ffdd57' }}
                >
                  Keyword
                </label>
                <input
                  id="keyword"
                  type="text"
                  className="input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <div className="control">
                <label
                  htmlFor="location"
                  className="label is-warning"
                  style={{ color: '#ffdd57' }}
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field is-grouped">
              <div className="control">
                <label
                  htmlFor="jobType"
                  className="label"
                  style={{ color: '#ffdd57' }}
                >
                  Job type
                </label>
                <div id="jobType" className="select">
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="PERMANENT">Permanent</option>
                  </select>
                </div>
              </div>
              <div className="control">
                <a
                  className="button is-warning is-outlined"
                  style={{ marginTop: 32 }}
                  onClick={() => searchJob()}
                  aria-hidden="true"
                >
                  Search
                </a>
                {/* <button type="button" class="button is-loading">Loading</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {jobAds.length !== 0 && (
        <div className="columns" style={{ marginTop: 30 }}>
          {/* <div className="column is-narrow"> */}
          <div className="column is-1">
            <div>
              <div className="box">
                <p className="title is-5">Filter</p>
                <p className="subtitle">{jobAds.length} jobs</p>
              </div>
            </div>
          </div>
          <div className="column is-6">
            {filteredJobAds.map((job) => (
              <div
                className="box"
                key={job.id}
                onClick={() => selectJob(job.id)}
                aria-hidden="true"
              >
                <p className="title is-5">
                  {`${job.title} - ${job.jobType} - ${job.providerName}`}
                </p>
                <p className="subtitle">{job.subtitle}</p>
                <p className="subtitle">
                  <b>Location:</b> {job.location}
                  <br />
                  <b>Salary:</b> {job.salary}
                  <br />
                  <b>Hiring org:</b> {job.companyName}
                  <br />
                  <b>Posted Date:</b> {job.postedDate}
                </p>
              </div>
            ))}
          </div>

          <div className="column is-5">
            {selectedJobAds && (
              <div className="box" style={{ position: 'fixed' }}>
                <p className="title is-5">{selectedJobAds.title}</p>
                <p className="subtitle">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedJobAds.jobDescription,
                    }}
                  />
                </p>
                <br />
                <a
                  className="button is-danger"
                  onClick={() => openInNewTab(selectedJobAds.jobURL)}
                  aria-hidden="true"
                >
                  Apply
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
