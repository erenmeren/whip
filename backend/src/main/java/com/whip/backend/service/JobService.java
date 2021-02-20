package com.whip.backend.service;


import com.whip.backend.model.JobSearchResult;
import com.whip.backend.model.JobType;
import reactor.core.publisher.Flux;

public interface JobService {
    Flux<JobSearchResult> searchJob(String keyword, String location, JobType jobType);
}
