package edu.weber.housing1000;


import android.app.Activity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;

import edu.weber.housing1000.db.SurveyDbAdapter;

public class ClientInfoActivity_Dynamic extends Activity
{

    /* Called when the activity is first created. */
    long surveyId = -1;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_clnt_info_dynamic);

        surveyId = getIntent().getLongExtra(SurveyDbAdapter.SURVEYS_FIELD_ID, -1);

        /////

        try
        {

            LinearLayout ll_sub = null;
            TextView tv = null;
            EditText et = null;
            Spinner sp = null;

            //Create linear layout and add it to a scroll view
            ScrollView sv = new ScrollView(this);
            LinearLayout ll = new LinearLayout(this);
            ll.setOrientation(LinearLayout.VERTICAL);
            sv.addView(ll);

            //Add a text box
            tv = new TextView(this);
            tv.setText("This is a test");
            ll.addView(tv);

            //Add a button
            Button btn = new Button(this);
            btn.setText("Test Button");
            ll.addView(btn);

            //Parse survey information
            JSONArray lstQuestions = JSONParser.parseSurvey(JSONParser.testSurvey);

            for (int i = 0; i < lstQuestions.length(); i++)
            {
                if((lstQuestions.getJSONObject(i).get("QuestionType").toString()).equals("SinglelineTextBox") == true)
                {
                    //Add a text box
                    ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.HORIZONTAL);
                    ll.addView(ll_sub);

                    tv = new TextView(this);
                    tv.setText(lstQuestions.getJSONObject(i).get("text").toString());
                    ll_sub.addView(tv);

                    et = new EditText(this);
                    et.setMinimumWidth(100);
                    ll_sub.addView(et);
                } else if((lstQuestions.getJSONObject(i).get("QuestionType").toString()).equals("SingleSelect") == true)
                {
                    //Add question with selections
                    ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.VERTICAL);
                    ll.addView(ll_sub);

                    tv = new TextView(this);
                    tv.setText(lstQuestions.getJSONObject(i).get("text").toString());
                    ll_sub.addView(tv);

                    //Add potential answers
                    String[] arrAnswers = (lstQuestions.getJSONObject(i).get("Options").toString()).split("\\|");
                    sp = new Spinner(this);
                    ArrayAdapter spArr = new ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item,
                            arrAnswers);
                    sp.setAdapter(spArr);
                    ll_sub.addView(sp);
                }
            }

            this.setContentView(sv);
        }
        catch(JSONException e) {
            e.printStackTrace();
        }
    }

}