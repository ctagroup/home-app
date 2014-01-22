package edu.weber.housing1000.Questions;

import android.content.Context;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by Blake on 1/21/14.
 */
public class SingleSelect extends Question {
    @Override
    public View createView(Context context) {
        //Add question with selections
        LinearLayout ll_sub = new LinearLayout(context);
        ll_sub.setOrientation(LinearLayout.VERTICAL);

        TextView tv = new TextView(context);
        tv.setText(getText());
        ll_sub.addView(tv);

        //Add potential answers
        List<String> lstAnswers = new ArrayList<String>();
        lstAnswers.add("-SELECT-");
        String[] arrAnswers = getOptions().split("\\|");
        Collections.addAll(lstAnswers, arrAnswers);

        Spinner spinner = new Spinner(context);
        spinner.setAdapter(new ArrayAdapter(context, android.R.layout.simple_spinner_dropdown_item,
                lstAnswers));

        ll_sub.addView(spinner);

        setView(ll_sub);
        return getView();
    }

    @Override
    public String getAnswer() {
        return null;
    }
}
