package com.whip.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Builder
@Value
@EqualsAndHashCode
@AllArgsConstructor
public class JobSearchResult {
    String id;
    String title;
    String subtitle;
    String salary;
    String location;
    String jobDescription;
    String postedDate;
    String companyName;
    String providerName;
    String jobURL;
    JobType jobType;
}
