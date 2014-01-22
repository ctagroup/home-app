package edu.weber.housing1000.Questions;

import android.content.Context;
import android.view.View;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Created by Blake on 1/21/14.
 */
public class MultiSelect extends Question {
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
        for (String answer : arrAnswers) {
            CheckBox cb = new CheckBox(context);
            cb.setText(answer);
            ll_sub.addView(cb);
        }

        setView(ll_sub);
        return getView();
    }

    @Override
    public String getAnswer() {
        return null;
    }
}
