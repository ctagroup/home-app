package edu.weber.housing1000.questions;

import android.content.Context;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

/**
 * @author Blake
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

    @Expose
    @SerializedName("TextBoxDataType")
    private String textBoxDataType;

    private String group = "";
    private ArrayList<Question> dependents;

    protected View myView;

    // Getters and Setters
    public String getTextBoxDataType() { return textBoxDataType; }

    public void setTextBoxDataType(String dataType) {
        this.textBoxDataType = dataType;
    }

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

    public View getView() {
        return myView;
    }

    public void setView(View v) {
        myView = v;
    }

    public int getParentQuestionId() {
        return parentQuestionId;
    }

    public void setParentQuestionId(int parentQuestionId) {
        this.parentQuestionId = parentQuestionId;
    }

    public String getParentRequiredAnswer() {
        return parentRequiredAnswer;
    }

    public void setParentRequiredAnswer(String parentRequiredAnswer) {
        this.parentRequiredAnswer = parentRequiredAnswer;
    }

    public ArrayList<Question> getDependents() {
        return dependents;
    }

    // Default constructor
    public Question() {
        dependents = new ArrayList<>();
    }

    public void addDependent(Question dependent) {
        dependents.add(dependent);
    }

    //TODO the reason this doesn't work is because it is setting an onclick listener to the parent for each
    //dependent. This means the only one that gets registered as the dependent that gets passed into toggleVisibility
    //is the last one, because each setOnClickListener overrides what is was before
    public void hookUpDependents() {
        LinearLayout myLayout = (LinearLayout) getView();

        final Question parentQuestion = this;

        // Add an on click listener to the parent's main layout
        View.OnClickListener onClickListener = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d("TOUCHED", "TOUCHED");
                parentQuestion.toggleChildrenVisibility();
            }
        };

        //myLayout.setOnClickListener(onClickListener);

        // Add a listener to all child views, too
        if (myLayout.getChildCount() > 0) {
            for (int i = 0; i < myLayout.getChildCount(); i++) {
                View child = myLayout.getChildAt(i);

                if (child instanceof Spinner) {
                    Spinner spinner = (Spinner) child;
                    spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                        @Override
                        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                            parentQuestion.toggleChildrenVisibility();
                        }

                        @Override
                        public void onNothingSelected(AdapterView<?> parent) {
                            parentQuestion.toggleChildrenVisibility();
                        }
                    });

                }
                else if (child instanceof EditText) {
                    EditText editText = (EditText) child;
                    editText.addTextChangedListener(new TextWatcher() {
                        @Override
                        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                        }

                        @Override
                        public void onTextChanged(CharSequence s, int start, int before, int count) {
                            parentQuestion.toggleChildrenVisibility();
                        }

                        @Override
                        public void afterTextChanged(Editable s) {

                        }
                    });
                }
                else {
                    child.setOnClickListener(onClickListener);
                }
            }
        }

        parentQuestion.toggleChildrenVisibility();
    }

    public void toggleChildrenVisibility() {

        for(Question question : this.getDependents()) {
            final LinearLayout questionLayout = (LinearLayout) question.getView();

            String[] requiredAnswers = question.getParentRequiredAnswer().split("\\|");

            if (this.getQuestionType().equals("SinglelineTextBox")) {
                //Make dependent questions visible if EditText is not blank
                if (!this.getAnswer().equals("")) {
                    questionLayout.setVisibility(View.VISIBLE);
                } else {
                    questionLayout.setVisibility(View.GONE);
                    question.clearAnswer();
                }
            } else if (this.getQuestionType().equals("MultiSelect")) {
                LinearLayout parentLayout = (LinearLayout) this.getView();
                for (int k = 0; k < parentLayout.getChildCount(); k++) {
                    View child = parentLayout.getChildAt(k);
                    //Make dependent questions visible if the required parent answer is checked
                    if (child instanceof CheckBox) {

                        boolean hasMatch = true;
                        for (String requiredAnswer : requiredAnswers) {
                            if (((CheckBox) child).isChecked() && ((CheckBox) child).getText().toString().toLowerCase().equals(requiredAnswer.toLowerCase())) {
                                questionLayout.setVisibility(View.VISIBLE);
                                hasMatch = true;
                                break;
                            } else {
                                hasMatch = false;
                            }
                        }

                        if(!hasMatch) {
                            questionLayout.setVisibility(View.GONE);
                            question.clearAnswer();
                        }
                    }
                }
            } else {
                boolean hasMatch = true;
                for (String requiredAnswer : requiredAnswers) {
                    if (requiredAnswer.toLowerCase().equals(this.getAnswer().toLowerCase())) {
                        questionLayout.setVisibility(View.VISIBLE);
                        hasMatch = true;
                        break;
                    } else {
                        hasMatch = false;
                    }
                }

                if(!hasMatch) {
                    questionLayout.setVisibility(View.GONE);
                    question.clearAnswer();
                }
            }
        }

        for (Question childQuestion : this.getDependents()) {
            childQuestion.toggleChildrenVisibility();
        }
    }

    // Abstract methods
    public abstract View createView(Context context);
    public abstract String getAnswer();
    public abstract void setAnswer(String answer);
    public abstract void clearAnswer();

}
