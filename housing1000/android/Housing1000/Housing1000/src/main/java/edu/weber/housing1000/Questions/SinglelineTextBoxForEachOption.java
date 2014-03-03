package edu.weber.housing1000.Questions;

import edu.weber.housing1000.R;
import android.content.Context;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import static android.R.color.darker_gray;

/**
 * Created by PLW on 3/1/14.
 */
public class SinglelineTextBoxForEachOption extends Question {
        @Override
        public View createView(Context context) {
            LinearLayout linearLayout = new LinearLayout(context);
            linearLayout.setOrientation(LinearLayout.VERTICAL);

            //Add a view for a border at the top of each group of questions
            View view = new View(context);
            LinearLayout.LayoutParams viewParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 10);
            view.setLayoutParams(viewParams);
            view.setBackgroundResource(darker_gray);
            linearLayout.addView(view);

            //Add potential answers
            String[] arrAnswers = getOptions().split("\\|");

            Integer iTextWidth = 150;
            for (String answer : arrAnswers) {
                //Setup questions for each option
                LinearLayout qLayout = new LinearLayout(context);
                qLayout.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams qLayoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                qLayout.setLayoutParams(qLayoutParams);

                //Add text for question
                TextView textView = new TextView(context);
                LinearLayout.LayoutParams textViewParams = new LinearLayout.LayoutParams(iTextWidth, ViewGroup.LayoutParams.WRAP_CONTENT);
                textView.setLayoutParams(textViewParams);
                textView.setGravity(Gravity.RIGHT);
                textView.setPadding(0, 0, 10, 0);
                textView.setText(answer);

                //Add edit text box for number entry
                final EditText editText = new EditText(context);
                LinearLayout.LayoutParams editTextParams = new LinearLayout.LayoutParams(iTextWidth, LinearLayout.LayoutParams.WRAP_CONTENT);
                editText.setLayoutParams(editTextParams);
                editText.setInputType(InputType.TYPE_CLASS_NUMBER);
                editText.setGravity(Gravity.CENTER);
                editText.setSingleLine(false);

                LinearLayout.LayoutParams imageButtonParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                //Add image buttons
                ImageButton imageButtonLeft = new ImageButton(context);
                imageButtonLeft.setLayoutParams(imageButtonParams);
                imageButtonLeft.setBackgroundResource(R.drawable.transparent_background);
                imageButtonLeft.setImageResource(R.drawable.minus_btn);

                ImageButton imageButtonRight = new ImageButton(context);
                imageButtonRight.setLayoutParams(imageButtonParams);
                imageButtonRight.setBackgroundResource(R.drawable.transparent_background);
                imageButtonRight.setImageResource(R.drawable.plus_btn);

                //Add click listener to each minus button
                imageButtonLeft.setOnClickListener(new View.OnClickListener() {
                    Integer iNum = 0;

                    @Override
                    public void onClick(View v) {
                        if (editText.getText().toString().equals("0") || (editText.getText().toString().equals("")))
                        {
                            iNum = 0;
                        } else
                        {
                            iNum = Integer.parseInt(editText.getText().toString());
                            iNum--;
                        }
                        editText.setText(String.valueOf(iNum));
                    }
                });

                //Add click listener to each plus button
                imageButtonRight.setOnClickListener(new View.OnClickListener() {
                    Integer iNum = 0;
                    @Override
                    public void onClick(View v) {
                        if (editText.getText().toString().equals(""))
                        {
                            iNum = 0;
                        } else
                        {
                            iNum = Integer.parseInt(editText.getText().toString());
                        }
                        iNum++;
                        editText.setText(String.valueOf(iNum));
                    }
                });

                //Add objects to the layout
                qLayout.addView(textView);
                qLayout.addView(editText);
                qLayout.addView(imageButtonLeft);
                qLayout.addView(imageButtonRight);

                //Add the layout to the main layout
                linearLayout.addView(qLayout);
            }

            setView(linearLayout);
            return getView();
        }

        @Override
        public String getAnswer() {
            String answer = "";
            LinearLayout layout = (LinearLayout)myView;

            for (int i = 0; i < layout.getChildCount(); i++)
            {
                View childView = layout.getChildAt(i);
                if (childView instanceof LinearLayout)
                {
                    LinearLayout linearLayout = (LinearLayout) childView;
                    for (int j = 0; j < linearLayout.getChildCount(); j++)
                    {
                        View childView_sub = linearLayout.getChildAt(j);
                        if (childView_sub instanceof EditText)
                        {
                            Integer iNum = 0;
                            EditText editText = (EditText) childView_sub;
                            if (!editText.getText().toString().equals(""))
                            {
                                iNum = Integer.parseInt(editText.getText().toString());
                            }

                            if (answer.equals(""))
                            {
                                answer = iNum.toString();
                            } else
                            {
                                answer += "|" + iNum.toString();
                            }
                        }
                    }
                }
            }

            return answer;
        }

        @Override
        public void setAnswer(String answer) {
            clearAnswer();

            if (answer != null)
            {
                LinearLayout layout = (LinearLayout)myView;

                String[] answers = answer.split("\\|");
                Integer iCountQuestion = 0;

                //Loop through linear layouts
                for (int i = 0; i < layout.getChildCount(); i++)
                {
                    View childView = layout.getChildAt(i);
                    if (childView instanceof LinearLayout)
                    {
                        LinearLayout linearLayout = (LinearLayout) childView;

                        //Loop through objects to find the EditText box
                        for (int j = 0; j < linearLayout.getChildCount(); j++)
                        {
                            View childView_sub = linearLayout.getChildAt(j);

                            //When the EditText box is found, put the stored answer there
                            if (childView_sub instanceof EditText)
                            {
                                EditText editText = (EditText) childView_sub;
                                editText.setText(answers[iCountQuestion]);
                                //Increment the answer counter
                                iCountQuestion++;
                            }
                        }
                    }
                }
            }
        }

        @Override
        public void clearAnswer() {
            LinearLayout layout = (LinearLayout)myView;

            for (int i = 0; i < layout.getChildCount(); i++)
            {
                View childView = layout.getChildAt(i);
                if (childView instanceof LinearLayout)
                {
                    LinearLayout linearLayout = (LinearLayout) childView;
                    for (int j = 0; j < linearLayout.getChildCount(); j++)
                    {
                        View childView_sub = linearLayout.getChildAt(j);
                        if (childView_sub instanceof EditText)
                        {
                            EditText editText = (EditText) childView_sub;
                            editText.setText("0");
                        }
                    }
                }
            }
        }
    }


