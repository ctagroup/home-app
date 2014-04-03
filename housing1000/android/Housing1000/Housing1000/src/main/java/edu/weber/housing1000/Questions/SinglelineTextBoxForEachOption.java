package edu.weber.housing1000.Questions;

import android.content.Context;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import edu.weber.housing1000.R;
import edu.weber.housing1000.Utils;

import static android.R.color.darker_gray;

/**
 * Created by PLW on 3/1/14.
 */
public class SinglelineTextBoxForEachOption extends Question {
    @Override
    public View createView(Context context) {
        LinearLayout linearLayout = new LinearLayout(context);
        linearLayout.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams mainParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        linearLayout.setLayoutParams(mainParams);

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
            RelativeLayout qLayout = new RelativeLayout(context);
            RelativeLayout.LayoutParams qLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
            qLayout.setLayoutParams(qLayoutParams);

            //Add text for question
            TextView textView = new TextView(context);
            RelativeLayout.LayoutParams textViewParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
            textViewParams.addRule(RelativeLayout.CENTER_VERTICAL);
            textViewParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
            textView.setLayoutParams(textViewParams);
            textView.setGravity(Gravity.LEFT);
            textView.setPadding(0, 0, 10, 0);
            textView.setText(answer);
            textView.setTextSize(18);

            //Add image buttons
            final float scale = context.getResources().getDisplayMetrics().density;
            int pixels = (int) (40 * scale + 0.5f);
            int btnPadding = 10;

            Button buttonPlus = new Button(context);
            buttonPlus.setId(Utils.getNewViewId(context));
            RelativeLayout.LayoutParams buttonRightParams = new RelativeLayout.LayoutParams(pixels, pixels);
            buttonRightParams.addRule(RelativeLayout.CENTER_VERTICAL);
            buttonRightParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            buttonRightParams.setMargins(btnPadding, btnPadding, btnPadding, btnPadding);
            buttonPlus.setLayoutParams(buttonRightParams);
            buttonPlus.setBackgroundResource(R.drawable.plus_btn);

            ImageButton buttonMinus = new ImageButton(context);
            buttonMinus.setId(Utils.getNewViewId(context));
            RelativeLayout.LayoutParams buttonLeftParams = new RelativeLayout.LayoutParams(pixels, pixels);
            buttonLeftParams.addRule(RelativeLayout.CENTER_VERTICAL);
            buttonLeftParams.addRule(RelativeLayout.LEFT_OF, buttonPlus.getId());
            buttonLeftParams.setMargins(btnPadding, btnPadding, btnPadding, btnPadding);
            buttonMinus.setLayoutParams(buttonLeftParams);
            buttonMinus.setBackgroundResource(R.drawable.minus_btn);

            //Add edit text box for number entry
            final EditText editText = new EditText(context);
            editText.setId(Utils.getNewViewId(context));
            RelativeLayout.LayoutParams editTextParams = new RelativeLayout.LayoutParams(iTextWidth, RelativeLayout.LayoutParams.WRAP_CONTENT);
            editTextParams.addRule(RelativeLayout.CENTER_VERTICAL);
            editTextParams.addRule(RelativeLayout.LEFT_OF, buttonMinus.getId());
            editText.setLayoutParams(editTextParams);
            editText.setInputType(InputType.TYPE_CLASS_NUMBER);
            editText.setGravity(Gravity.CENTER);
            editText.setSingleLine(false);
            editText.setText("0");

            //Add click listener to each minus button
            buttonMinus.setOnClickListener(new View.OnClickListener() {
                Integer iNum = 0;

                @Override
                public void onClick(View v) {
                    if (editText.getText().toString().equals("0") || (editText.getText().toString().equals(""))) {
                        iNum = 0;
                    } else {
                        iNum = Integer.parseInt(editText.getText().toString());
                        iNum--;
                    }
                    editText.setText(String.valueOf(iNum));
                }
            });

            //Add click listener to each plus button
            buttonPlus.setOnClickListener(new View.OnClickListener() {
                Integer iNum = 0;

                @Override
                public void onClick(View v) {
                    if (editText.getText().toString().equals("")) {
                        iNum = 0;
                    } else {
                        iNum = Integer.parseInt(editText.getText().toString());
                    }
                    iNum++;
                    editText.setText(String.valueOf(iNum));
                }
            });

            //Add objects to the layout
            qLayout.addView(textView);
            qLayout.addView(buttonPlus);
            qLayout.addView(buttonMinus);
            qLayout.addView(editText);

            //Add the layout to the main layout
            linearLayout.addView(qLayout);
        }

        setView(linearLayout);
        return getView();
    }

    @Override
    public String getAnswer() {
        String name = "";
        String answer = "";
        LinearLayout layout = (LinearLayout) myView;

        for (int i = 0; i < layout.getChildCount(); i++) {
            View childView = layout.getChildAt(i);
            if (childView instanceof RelativeLayout) {
                RelativeLayout relativeLayout = (RelativeLayout) childView;
                for (int j = 0; j < relativeLayout.getChildCount(); j++) {
                    View childView_sub = relativeLayout.getChildAt(j);
                    View childName = relativeLayout.getChildAt(0);
                    if (childName instanceof TextView) {
                        TextView textView = (TextView) childName;
                        name = textView.getText().toString();

                        if (childView_sub instanceof EditText) {
                            Integer iNum = 0;
                            EditText editText = (EditText) childView_sub;
                            if (!editText.getText().toString().equals("")) {
                                iNum = Integer.parseInt(editText.getText().toString());
                            }

                            if (answer.equals("")) {
                                answer = name + "=" + iNum.toString();
                            } else {
                                answer += "|" + name + "=" + iNum.toString();
                            }
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

        if (answer != null) {
            LinearLayout layout = (LinearLayout) myView;

            String[] answers = answer.split("\\|");
            Integer iCountQuestion = 0;

            //Loop through linear layouts
            for (int i = 0; i < layout.getChildCount(); i++) {
                View childView = layout.getChildAt(i);
                if (childView instanceof RelativeLayout) {
                    RelativeLayout relativeLayout = (RelativeLayout) childView;

                    //Loop through objects to find the EditText box
                    for (int j = 0; j < relativeLayout.getChildCount(); j++) {
                        View childView_sub = relativeLayout.getChildAt(j);

                        //When the EditText box is found, put the stored answer there
                        if (childView_sub instanceof EditText) {
                            String[] answerSplit = answers[iCountQuestion].split("=");
                            EditText editText = (EditText) childView_sub;
                            editText.setText(answerSplit[1]);
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
        LinearLayout layout = (LinearLayout) myView;

        for (int i = 0; i < layout.getChildCount(); i++) {
            View childView = layout.getChildAt(i);
            if (childView instanceof RelativeLayout) {
                RelativeLayout relativeLayout = (RelativeLayout) childView;
                for (int j = 0; j < relativeLayout.getChildCount(); j++) {
                    View childView_sub = relativeLayout.getChildAt(j);
                    if (childView_sub instanceof EditText) {
                        EditText editText = (EditText) childView_sub;
                        editText.setText("0");
                    }
                }
            }
        }
    }
}


