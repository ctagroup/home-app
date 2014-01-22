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
        LinearLayout ll_sub = new LinearLayout(context);

        TextView tv = new TextView(context);
        tv.setText(getText());
        ll_sub.addView(tv);
        // TODO: Have the ctagroup people add a minimum character length for the SinglelineTextBox so we can wrap to the next line if it isn't big enough
        if (tv.getText().length() >= 16)
            ll_sub.setOrientation(LinearLayout.VERTICAL);

        EditText et = new EditText(context);
        LinearLayout.LayoutParams etParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        et.setLayoutParams(etParams);

        ll_sub.addView(et);

        setView(ll_sub);
        return getView();
    }

    @Override
    public String getAnswer() {
        return null;
    }
}
