package edu.weber.housing1000.Questions;

import android.content.Context;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Created by Blake on 1/21/14.
 */
public class SinglelineTextBox extends Question {
    @Override
    public View createView(Context context) {
        LinearLayout qLayout = new LinearLayout(context);

        TextView textView = new TextView(context);
        textView.setText(getText());
        qLayout.addView(textView);
        // TODO: Have the ctagroup people add a minimum character length for the SinglelineTextBox so we can wrap to the next line if it isn't big enough
        if (textView.getText().length() >= 16)
            qLayout.setOrientation(LinearLayout.VERTICAL);

        EditText editText = new EditText(context);
        LinearLayout.LayoutParams editTextParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        editText.setLayoutParams(editTextParams);

        qLayout.addView(editText);

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
            if (childView instanceof EditText)
            {
                EditText editText = (EditText) childView;

                answer = editText.getText().toString();
            }
        }

        return answer;
    }
}
