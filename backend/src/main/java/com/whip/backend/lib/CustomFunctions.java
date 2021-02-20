package com.whip.backend.lib;

public class CustomFunctions {

    public static String cutStringForSubtitle(String str) {
        if(str == null)
            return "";
        if(str.length() > 146)
            str = str.substring(0, 144)+"...";
        return str;
    }

}
