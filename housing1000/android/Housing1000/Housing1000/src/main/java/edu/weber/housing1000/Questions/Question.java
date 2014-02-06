package edu.weber.housing1000.Questions;

import android.content.Context;
import android.content.DialogInterface;
import android.opengl.Visibility;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.LinearLayout;
import android.widget.Spinner;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

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

    private String group = "";
    protected View myView;

    private ArrayList<Question> dependents;

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

    public int getParentQuestionId()
    {
        return parentQuestionId;
    }

    public String getParentRequiredAnswer()
    {
        return parentRequiredAnswer;
    }

    // Default constructor
    public Question() {
        dependents = new ArrayList<Question>();
    }

    public void addDependent(Question dependent)
    {
        dependents.add(dependent);
    }

    public void hookUpDependents()
    {
        LinearLayout myLayout = (LinearLayout) getView();

        for (final Question question : dependents)
        {
            // Add an on click listener to the parent's main layout
            View.OnClickListener onClickListener = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d("TOUCHED", "TOUCHED");
                    toggleVisibility(question);
                }
            };

            myLayout.setOnClickListener(onClickListener);

            // Add a listener to all child views, too
            if (myLayout.getChildCount() > 0)
            {
                for (int i = 0; i < myLayout.getChildCount(); i++)
                {
                    View child = myLayout.getChildAt(i);

                    if (child instanceof Spinner)
                    {
                        Spinner spinner = (Spinner) child;
                        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                            @Override
                            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                                toggleVisibility(question);
                            }

                            @Override
                            public void onNothingSelected(AdapterView<?> parent) {
                                toggleVisibility(question);
                            }
                        });

                    }
                    else
                    {
                        child.setOnClickListener(onClickListener);
                    }
                }
            }
        }
    }

    private void toggleVisibility(Question child)
    {
        final LinearLayout questionLayout = (LinearLayout) child.getView();

        if (child.getParentRequiredAnswer().toLowerCase().equals(Question.this.getAnswer().toLowerCase()))
        {
            questionLayout.setVisibility(View.VISIBLE);
        }
        else
        {
            questionLayout.setVisibility(View.INVISIBLE);
        }
    }

    // Abstract classes
    public abstract View createView(Context context);
    public abstract String getAnswer();

}
