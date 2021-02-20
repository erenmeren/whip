package com.whip.backend.repository;


import com.whip.backend.model.JobSearchResult;
import com.whip.backend.model.JobType;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface Job {
    CompletableFuture<List<JobSearchResult>> searchJob(String keyword, String location, JobType jobType);
}
