package com.whip.backend.model;

public enum ProviderName {
    CW_JOBS("CW Jobs"), TOTAL_JOB("Total Jobs"), LINKEDIN("LinkedIN"), JOB_SERVE("Job Serve");

    public final String providerName;

    ProviderName(String providerName) {
        this.providerName = providerName;
    }
}
