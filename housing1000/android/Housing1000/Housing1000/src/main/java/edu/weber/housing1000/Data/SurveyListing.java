package edu.weber.housing1000.Data;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by Blake on 11/29/13.
 */
public class SurveyListing implements Serializable {
    private long id;
    private long version;
    private String title;
    private String questions;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getQuestions() {
        return questions;
    }

    public void setQuestions(String questions) {
        this.questions = questions;
    }

    public SurveyListing(long id, long version, String title)
    {
        this.id = id;
        this.version = version;
        this.title = title;
    }

    public SurveyListing(long id, long version, String title, String questions)
    {
        this(id, version, title);
        this.questions = questions;
    }
}
