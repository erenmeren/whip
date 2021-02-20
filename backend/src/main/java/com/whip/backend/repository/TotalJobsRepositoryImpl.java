package com.whip.backend.repository;

import com.whip.backend.lib.CustomFunctions;
import com.whip.backend.model.JobSearchResult;
import com.whip.backend.model.JobType;
import com.whip.backend.model.ProviderName;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.FormElement;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Repository
public class TotalJobsRepositoryImpl implements TotalJobsRepository {
    private static final String URL = "https://www.totaljobs.com";

    @Async
    @Override
    public CompletableFuture<List<JobSearchResult>> searchJob(String keyword, String location, JobType jobType) {

        try {

            // Home Page
            Document homePage = Jsoup.connect(URL).get();

            // set keyword
            Element keywordsTextBox = homePage.select("#keywords").first();
            keywordsTextBox.val(keyword);

            // set location
            Element locationTextBox = homePage.select("#location").first();
            locationTextBox.val(location);

            // submit form
            FormElement form = (FormElement) homePage.select(".search-container > form").first();
//            log.info("form  {}", form);
            Connection newPage = form.submit();

            //search result page
            Document resultPage = newPage.get();
//            log.info("{}", resultPage);

            // check job type searching
            if(JobType.CONTRACT.equals(jobType) || JobType.PERMANENT.equals(jobType)){
                String jobTypeUrl = resultPage.select("#facetListJobType .facet-links li a").get(JobType.PERMANENT.equals(jobType) ? 0 : 1).attr("abs:href");
                resultPage = Jsoup.connect(jobTypeUrl).get();
            }

            // jobs
            Elements jobs = resultPage.select(".job");
//            log.info("jobs : {}", jobs);
            return CompletableFuture.completedFuture( parseElements(jobs) );


        } catch (IOException e) {
            e.printStackTrace();
        }

        return CompletableFuture.completedFuture(new ArrayList<>());
    }

    private List<JobSearchResult> parseElements(Elements  elements) {
        List<JobSearchResult> result = new ArrayList<>();

        for(Element element : elements){

            result.add(
                    JobSearchResult.builder()
                            .id( "TJ-" + element.attr("id") )
                            .companyName( element.select(".company").first().text() )
                            .jobDescription( element.select(".job-intro").first().text() )
                            .location( element.select(".location").first().text().split(" from")[0] )
                            .jobType( JobType.valueOf(element.select(".job-type").first().text().toUpperCase()) )
                            .postedDate( element.select(".date-posted").first().text() )
                            .providerName( ProviderName.TOTAL_JOB.providerName )
                            .jobURL( element.select(".job-title > a").first().attr("href") )
                            .salary( element.select(".salary").first().text() )
                            .subtitle(
                                    CustomFunctions.cutStringForSubtitle(
                                            element.select(".job-intro").first().text())
                            )
                            .title( element.select(".job-title > a").first().select("h2").first().text() )
                            .build()
            );

//            log.info("------------------");
//
//            // id
//            log.info("id - {}", element.attr("id"));

//            // jobUrl
//            log.info("href - {}", element.select(".job-title > a").first().attr("href"));

//            // title
//            log.info("title - {}", element.select(".job-title > a").first().select("h2").first().text());

//            // location. idiotsssssss
//            log.info("location - {}", element.select(".location").first().text().split(" from")[0]);

//            // salary
//            log.info("location - {}", element.select(".salary").first().text());

//            // job type
//            log.info("Job type - {}", element.select(".job-type").first().text());

//            // company
//            log.info("company - {}", element.select(".company").first().text());

//            // posted date
//            log.info("date posted - {}", element.select(".date-posted").first().text());

//            // job detail
//            log.info("job detail - {}", element.select(".job-intro").first().text());

//            log.info("------------------");

        }

        return result;
    }
}
