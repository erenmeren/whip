package com.whip.backend.controller;

import com.whip.backend.model.JobSearchResult;
import com.whip.backend.model.JobType;
import com.whip.backend.service.JobService;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("job")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/search")
    public Publisher<JobSearchResult> search(@RequestParam String keyword,
                                             @RequestParam(required = false) String location,
                                             @RequestParam(required = false) JobType jobType) {
        jobType = jobType == null ? JobType.ALL : jobType;
        return jobService.searchJob(keyword, location, jobType);
    }

}
