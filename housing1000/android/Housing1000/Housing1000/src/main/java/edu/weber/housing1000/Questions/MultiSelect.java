package edu.weber.housing1000.Questions;

import android.content.Context;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.Spinner;
import android.widget.TextView;

/**
 * Created by Blake on 1/21/14.
 */
public class MultiSelect extends Question {
    @Override
    public View createView(Context context) {
        //Add question with selections
        LinearLayout qLayout = new LinearLayout(context);
        qLayout.setOrientation(LinearLayout.VERTICAL);

        TextView textView = new TextView(context);
        textView.setText(getText());
        qLayout.addView(textView);

        //Add potential answers
        String[] arrAnswers = getOptions().split("\\|");
        for (String answer : arrAnswers) {
            CheckBox checkBox = new CheckBox(context);
            checkBox.setText(answer);
            qLayout.addView(checkBox);
        }

        setView(qLayout);
        return getView();
    }

    @Override
    public String getAnswer() {
        String answer = "";
        LinearLayout layout = (LinearLayout)myView;

        for (int i = 0; i < layout.getChildCount(); i++)
        {
            View childView = layout.getChildAt(i);
            if (childView instanceof CheckBox)
            {
                CheckBox checkbox = (CheckBox) childView;
                if (checkbox.isChecked())
                {
                    answer = answer.isEmpty() ? checkbox.getText().toString() : answer + "|" + checkbox.getText().toString();
                }
            }
        }

        return answer;
    }
}
