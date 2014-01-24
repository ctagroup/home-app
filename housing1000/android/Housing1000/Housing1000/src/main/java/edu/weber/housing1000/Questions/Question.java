package edu.weber.housing1000.Questions;

import android.content.Context;
import android.view.View;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Blake on 11/29/13.
 */
public abstract class Question {

    @Expose
    @SerializedName("QuestionId")
    private int questionId;

    @Expose
    @SerializedName("text")
    private String text;

    @Expose
    @SerializedName("QuestionType")
    private String questionType;

    @Expose
    @SerializedName("Options")
    private String options;

    @Expose
    @SerializedName("OrderId")
    private int orderId;

    @Expose
    @SerializedName("ParentQuestionId")
    private int parentQuestionId;

    @Expose
    @SerializedName("ParentRequiredAnswer")
    private String parentRequiredAnswer;

    private String group = "Questions";
    protected View myView;

    // Getters and Setters
    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public View getView()
    {
        return myView;
    }

    public void setView(View v)
    {
        myView = v;
    }

    // Default constructor
    public Question() { }

    // Abstract classes
    public abstract View createView(Context context);
    public abstract String getAnswer();

}
