package edu.weber.housing1000.Questions;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;

/**
 * Created by Blake on 1/21/14.
 */
public class SingleSelectRadio extends Question {
    @Override
    public View createView(Context context) {
        //Add question with selections
        LinearLayout ll_sub = new LinearLayout(context);
        ll_sub.setOrientation(LinearLayout.VERTICAL);

        TextView tv = new TextView(context);
        tv.setText(getText());
        ll_sub.addView(tv);

        //Add potential answers
        String[] arrAnswers = getOptions().split("\\|");
        RadioButton[] RadioButtons = new RadioButton[arrAnswers.length];

        for (int j = 0; j < arrAnswers.length; j++) {
            RadioButtons[j] = new RadioButton(context);
            RadioButtons[j].setText(arrAnswers[j]);
            ll_sub.addView(RadioButtons[j]);
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

        setView(ll_sub);
        return getView();
    }

    @Override
    public String getAnswer() {
        return null;
    }
}
