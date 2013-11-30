package edu.weber.housing1000.data;

/**
 * Created by Blake on 11/29/13.
 */
public class Question {
    private int questionId;
    private String group;
    private String text;
    private String questionType;
    private String options;
    private int orderId;

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

    public Question(int questionId, String group, String text, String questionType, String options, int orderId)
    {
        this.questionId = questionId;
        this.group = group;
        this.text = text;
        this.questionType = questionType;
        this.options = options;
        this.orderId = orderId;
    }

    public Question()
    {

    }
}
