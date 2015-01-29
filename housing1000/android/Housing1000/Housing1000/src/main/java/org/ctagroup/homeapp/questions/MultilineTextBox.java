package org.ctagroup.homeapp.questions;

import android.content.Context;
import android.text.InputType;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * @author David Horton
 */
public class MultilineTextBox extends Question {


    @Override
    public View createView(Context context) {
        LinearLayout qLayout = new LinearLayout(context);

        TextView textView = new TextView(context);
        textView.setText(getText());
        textView.setTextSize(getTextSize());
        qLayout.addView(textView);
        if (textView.getText().length() >= 16)
            qLayout.setOrientation(LinearLayout.VERTICAL);

        final EditText editText = new EditText(context);
        LinearLayout.LayoutParams editTextParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 300);
        editText.setLayoutParams(editTextParams);
        editText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);

        qLayout.addView(editText);

        setView(qLayout);
        return getView();
    }

    @Override
    public String getAnswer() {
        String answer = "";
        LinearLayout layout = (LinearLayout) myView;

        for (int i = 0; i < layout.getChildCount(); i++) {
            View childView = layout.getChildAt(i);
            if (childView instanceof EditText) {
                EditText editText = (EditText) childView;

                answer = editText.getText().toString();
            }
        }

        return answer;
    }

    @Override
    public void setAnswer(String answer) {
        clearAnswer();

        if (answer != null) {
            LinearLayout layout = (LinearLayout) myView;

            for (int i = 0; i < layout.getChildCount(); i++) {
                View childView = layout.getChildAt(i);
                if (childView instanceof EditText) {
                    EditText editText = (EditText) childView;
                    editText.setText(answer);
                }
            }
        }
    }

    @Override
    public void clearAnswer() {
        LinearLayout layout = (LinearLayout) myView;

        for (int i = 0; i < layout.getChildCount(); i++) {
            View childView = layout.getChildAt(i);
            if (childView instanceof EditText) {
                EditText editText = (EditText) childView;
                editText.setText(null);
            }
        }
    }
}