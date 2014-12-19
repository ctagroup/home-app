package edu.weber.housing1000.questions;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;

/**
 * @author Blake
 */
public class SingleSelectRadio extends Question {
    @Override
    public View createView(Context context) {
        //Add question with selections
        LinearLayout qLayout = new LinearLayout(context);
        qLayout.setOrientation(LinearLayout.VERTICAL);

        TextView textView = new TextView(context);
        textView.setText(getText());
        textView.setTextSize(getTextSize());
        qLayout.addView(textView);

        //Add potential answers
        String[] arrAnswers = getOptions().split("\\|");
        RadioButton[] RadioButtons = new RadioButton[arrAnswers.length];

        for (int j = 0; j < arrAnswers.length; j++) {
            RadioButtons[j] = new RadioButton(context);
            RadioButtons[j].setText(arrAnswers[j]);
            qLayout.addView(RadioButtons[j]);
        }

        for (int j = 0; j < arrAnswers.length; j++) {
            final int localJ = j;
            final int maxJ = arrAnswers.length;
            final RadioButton[] localRadioButtons = RadioButtons;

            RadioButtons[j].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    for (int l = 0; l < maxJ; l++) {
                        if (l != localJ) {
                            localRadioButtons[l].setChecked(false);
                        }
                    }
                }
            });
        }

        setView(qLayout);
        return getView();
    }

    @Override
    public String getAnswer() {
        String answer = "";
        LinearLayout layout = (LinearLayout) myView;

        // Loop through each child view (radio buttons)
        for (int i = 0; i < layout.getChildCount(); i++)
        {
            View childView = layout.getChildAt(i);
            if (childView instanceof RadioButton)
            {
                RadioButton radioButton = (RadioButton) childView;
                if (radioButton.isChecked())
                {
                    answer = radioButton.getText().toString();
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

            for (int i = 0; i < layout.getChildCount(); i++)
            {
                View childView = layout.getChildAt(i);
                if (childView instanceof RadioButton)
                {
                    RadioButton radioButton = (RadioButton) childView;

                    if (answer.equals(radioButton.getText().toString()))
                    {
                        radioButton.setChecked(true);
                        break;
                    }

                }
            }
        }
    }

    @Override
    public void clearAnswer() {
        LinearLayout layout = (LinearLayout) myView;

        // Loop through each child view (radio buttons)
        for (int i = 0; i < layout.getChildCount(); i++)
        {
            View childView = layout.getChildAt(i);
            if (childView instanceof RadioButton)
            {
                RadioButton radioButton = (RadioButton) childView;
                radioButton.setChecked(false);
            }
        }
    }

}
