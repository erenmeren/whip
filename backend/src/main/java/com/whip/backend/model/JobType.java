package com.whip.backend.model;

public enum JobType {
    ALL("All"),
    CONTRACT("Contract"),
    PERMANENT("Permanent"),;

    public final String typeName;

    JobType(String typeName) {
        this.typeName = typeName;
    }
}
