package com.whip.backend.repository;


import com.whip.backend.lib.CustomFunctions;
import com.whip.backend.model.JobSearchResult;
import com.whip.backend.model.JobType;
import com.whip.backend.model.ProviderName;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Repository
public class LinkedInRepositoryImpl implements LinkedInRepository {

    @Async
    @Override
    public CompletableFuture<List<JobSearchResult>> searchJob(String Keyword, String location, JobType jobType) {
        try {

            String url = String.format("https://uk.linkedin.com/jobs/search?keywords=%s&location=%s&trk=homepage-jobseeker_jobs-search-bar_search-submit&redirect=false&position=1&pageNum=0&f_JT=", "java", "london");

            if(!JobType.ALL.equals(jobType))
                url = url+(jobType.equals(JobType.CONTRACT) ? "C" : "F");


            // search result
            Document searchResultPage = Jsoup.connect(url).get();

            //Find jobs
            Elements jobs = searchResultPage.select(".jobs-search__results-list li");
//            log.info("jobs : {}", jobs);
            return CompletableFuture.completedFuture(parseElements(jobs, jobType));


        } catch (IOException e) {
            e.printStackTrace();
        }
            return CompletableFuture.completedFuture(new ArrayList<>());
    }

    private static List<JobSearchResult> parseElements(Elements elements, JobType jobType) {
        List<JobSearchResult> result = new ArrayList<>();
        for(Element element : elements){

            result.add(
                    JobSearchResult.builder()
                            .id( "LI-" + element.attr("data-id") )
                            .companyName( element.select(".result-card__subtitle").first().text() )
                            .jobDescription( "" )
                            .location( element.select(".job-result-card__location").first().text() )
                            .jobType( jobType.equals(JobType.ALL) ? null : jobType )
                            .postedDate( element.select(".job-result-card__listdate").first() == null ? "?" : element.select(".job-result-card__listdate").first().attr("datetime") )
                            .providerName( ProviderName.LINKEDIN.name() )
                            .jobURL( String.format("https://www.linkedin.com/jobs/view/%s",element.attr("data-id")) )
                            .salary( element.select(".job-result-card__salary-info").first() == null ? "?" : element.select(".job-result-card__salary-info").first().text() )
                            .subtitle(
                                    CustomFunctions.cutStringForSubtitle(
                                            element.select(".result-card__title").first().text()
                                    )
                            )
                            .title( element.select(".result-card__title").first().text() )
                            .build()
            );



//            log.info("------------------");
//
//            // id
//            log.info("id - {}", element.attr("data-id"));

//            // jobUrl
//            log.info("href - {}", String.format("https://www.linkedin.com/jobs/view/%s",element.attr("data-id")));

//            // title
//            log.info("title - {}", element.select(".result-card__title").first().text());

            // location.
//            log.info("location - {}", element.select(".job-result-card__location").first().text());

//            // salary
//            log.info("salary - {}", element.select(".job-result-card__salary-info").first() == null ? "?" : element.select(".job-result-card__salary-info").first().text() );

//            // job type
//            log.info("Job type - {}", jobType.equals(JobType.ALL) ? "?" : jobType.typeName );

//            // company
//            log.info("company - {}", element.select(".result-card__subtitle").first().text());

//            // posted date
//            log.info("date posted - {}", element.select(".job-result-card__listdate").first() == null ? "?" : element.select(".job-result-card__listdate").first().attr("datetime") );

//            // job detail
//            log.info("job detail - {}", "?");

//            log.info("------------------");

        }

        return result;
    }

}
