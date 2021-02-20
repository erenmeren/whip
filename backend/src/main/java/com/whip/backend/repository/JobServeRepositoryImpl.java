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
public class JobServeRepositoryImpl implements JobServeRepository {

    private static final String URL = "https://www.jobserve.com/gb/en/Job-Search/";

    @Async
    @Override
    public CompletableFuture<List<JobSearchResult>> searchJob(String keyword, String location, JobType jobType) {

        try {

            // Home Page
            Document homePage = Jsoup.connect(URL).get();

            //set keyword
            Element keywordsTextBox = homePage.select("#txtKey").first();
            keywordsTextBox.val("java");

            // set location
            Element locationTextBox = homePage.select("#txtLoc").first();
            locationTextBox.val("london");

            // set job type
            if(JobType.CONTRACT.equals(jobType) || JobType.PERMANENT.equals(jobType)){
                Elements jt = homePage.select("#selJType option");

                // for contract => 2
                // for permanent => 1
                jt.get( JobType.CONTRACT.equals(jobType) ? 2 : 1).attr("selected", "selected");
            }

            // submit form
            FormElement form = (FormElement) homePage.select("form").first();
//            log.info("form  {}", form);
            Connection newPage = form.submit();

            // skip sign-up page ._.
            Document signUpPage = newPage.get();
            String resultPageURL = signUpPage.select("#msgNoJSRedirectLink").first().attr("abs:href");
//            log.info("{}", resultPageURL);

            // search result page
            Document searchResultPage = Jsoup.connect(resultPageURL).get();
//            log.info("{}", searchResultPage);

            //Find jobs
            Elements jobs = searchResultPage.select(".jobListItem");
//            log.info("jobs : {}", jobs);

            return CompletableFuture.completedFuture(parseElements(jobs));


        } catch (IOException e) {
            e.printStackTrace();
        }

        return CompletableFuture.completedFuture(new ArrayList<>());
    }

    private static List<JobSearchResult> parseElements(Elements  elements) {
        List<JobSearchResult> result = new ArrayList<>();
//        log.info("{}",elements.get(0));

        for(Element element : elements){

            result.add(
                    JobSearchResult.builder()
                            .id( "JS-" + element.attr("id") )
                            .companyName( element.select(".jobListDetailsPanel span").get(4).text() )
                            .jobDescription( element.select(".jobListSkills").first().text() )
                            .location( element.select(".jobListDetailsPanel span").get(0).text() )
                            .jobType( JobType.valueOf(element.select(".jobListDetailsPanel span").get(2).text().toUpperCase()) )
                            .postedDate( element.select(".jobListSkillsPanel .jobListDetail").first().text() )
                            .providerName( ProviderName.JOB_SERVE.providerName )
                            .jobURL( element.select(".jobListHeaderPanel > a").first().attr("abs:href") )
                            .salary( element.select(".jobListDetailsPanel span").get(1).text() )
                            .subtitle(
                                    CustomFunctions.cutStringForSubtitle(
                                            element.select(".jobListSkills").first().text()
                                    )
                            )
                            .title( element.select(".jobListHeaderPanel > a").first().text() )
                            .build()
            );



//            log.info("------------------");
//
//            // id
//            log.info("id - {}", element.attr("id"));

//            // jobUrl
//            log.info("href - {}", element.select(".jobListHeaderPanel > a").first().attr("abs:href"));

//            // title
//            log.info("title - {}", element.select(".jobListHeaderPanel > a").first().text());

            // location.
//            log.info("location - {}", element.select(".jobListDetailsPanel span").get(0).text());

//            // salary
//            log.info("location - {}", element.select(".jobListDetailsPanel span").get(1).text());

//            // job type
//            log.info("Job type - {}", element.select(".jobListDetailsPanel span").get(2).text());

//            // company
//            log.info("company - {}", element.select(".jobListDetailsPanel span").get(4).text());

//            // posted date
//            log.info("date posted - {}", element.select(".jobListSkillsPanel .jobListDetail").first().text());

//            // job detail
//            log.info("job detail - {}", element.select(".jobListSkills").first().text());

//            log.info("------------------");

        }
        return result;
    }
}