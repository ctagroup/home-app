package edu.weber.housing1000.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Blake on 1/22/14.
 */
public class Response {
    @Expose
    @SerializedName("QuestionId")
    private int questionId;

    @Expose
    @SerializedName("Answer")
    private String answer;

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Response()
    {

    }

    public Response(int questionId, String answer)
    {
        this.questionId = questionId;
        this.answer = answer;
    }
}
