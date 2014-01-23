package edu.weber.housing1000.Data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Blake on 1/22/14.
 */
public class Response {
    @Expose
    @SerializedName("QuestionId")
    public int questionId;

    @Expose
    @SerializedName("Answer")
    public String answer;

    public Response()
    {

    }

    public Response(int questionId, String answer)
    {
        this.questionId = questionId;
        this.answer = answer;
    }
}
