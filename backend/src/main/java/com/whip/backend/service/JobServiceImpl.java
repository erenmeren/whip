package com.whip.backend.service;


import com.whip.backend.model.JobSearchResult;
import com.whip.backend.model.JobType;
import com.whip.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;


@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private CWJobsRepository cwJobsRepository;

    @Autowired
    private TotalJobsRepository totalJobsRepository;

    @Autowired
    private JobServeRepository jobServeRepository;

    @Autowired
    private LinkedInRepository linkedInRepository;

    @Override
    public Flux<JobSearchResult> searchJob(String keyword, String location, JobType jobType)  {

        try{
            long startTime = System.currentTimeMillis();

            // TODO : Multi-threading or search flux combine, parallel...
            List<JobSearchResult> all = new ArrayList<>();

            CompletableFuture<List<JobSearchResult>> js = jobServeRepository.searchJob(keyword, location , jobType);
            CompletableFuture<List<JobSearchResult>> tj = totalJobsRepository.searchJob(keyword, location , jobType);
            CompletableFuture<List<JobSearchResult>> cj = cwJobsRepository.searchJob(keyword, location , jobType);
            CompletableFuture<List<JobSearchResult>> li = linkedInRepository.searchJob(keyword, location , jobType);

//            CompletableFuture.allOf(tj, js, cj, li).join();

            all.addAll( tj.get() );
            all.addAll( js.get() );
            all.addAll( cj.get() );
            all.addAll( li.get() );

            long stopTime = System.currentTimeMillis();
            long elapsedTime = stopTime - startTime;
            System.out.println(elapsedTime);


            return Flux.fromIterable(all);
        }catch (Exception e){

        }
        return Flux.empty();
    }

}
