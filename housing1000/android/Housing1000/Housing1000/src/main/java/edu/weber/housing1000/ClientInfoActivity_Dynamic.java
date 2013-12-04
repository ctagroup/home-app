package edu.weber.housing1000;

import android.app.Activity;
import android.graphics.Point;
import android.os.Bundle;
import android.view.Display;
import android.view.View;
import android.widget.*;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.*;

import edu.weber.housing1000.db.SurveyDbAdapter;

public class ClientInfoActivity_Dynamic extends Activity
{

    /* Called when the activity is first created. */
    long surveyId = -1;

    RelativeLayout rootLayout;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_clnt_info_dynamic);

        rootLayout = (RelativeLayout) findViewById(R.id.root_layout);

        surveyId = getIntent().getLongExtra(SurveyDbAdapter.SURVEYS_FIELD_ID, -1);

        try
        {
            //Create linear layout and add it to a scroll view
            ScrollView sv = new ScrollView(this);
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            layoutParams.addRule(RelativeLayout.ABOVE, R.id.buttonsLinearLayout);
            sv.setLayoutParams(layoutParams);

            LinearLayout ll = new LinearLayout(this);
            ll.setOrientation(LinearLayout.VERTICAL);
            sv.addView(ll);

            //Parse survey information
            JSONArray lstQuestions = JSONParser.parseSurvey(JSONParser.testSurvey);
            List<String> lstPanels = new ArrayList<String>();

            //Get panel types
            for (int j = 0; j < lstQuestions.length(); j++)
            {
                if (!lstPanels.contains(lstQuestions.getJSONObject(j).get("Panel").toString()))
                {
                    lstPanels.add(lstQuestions.getJSONObject(j).get("Panel").toString());
                }
            }

            LinearLayout[] panelViews = new LinearLayout[lstPanels.size()];
            Button[] buttons = new Button[lstPanels.size()];

            //Create buttons and panels
            for (int k = 0; k < lstPanels.size(); k++)
            {
                Button btn = new Button(this);
                btn.setId(k);
                btn.setText(lstPanels.get(k));
                buttons[k] = btn;
                ll.addView(btn);

                LinearLayout panelView = new LinearLayout(this);
                panelView.setId(k);
                panelView.setOrientation(LinearLayout.VERTICAL);
                panelViews[k] = panelView;
                ll.addView(panelView);
                panelView.setVisibility(View.GONE);
            }

            //Set Click Events
            for (int k = 0; k < lstPanels.size(); k++)
            {
                final int localK = k;
                final LinearLayout[] localPanelViews = panelViews;
                final List<String> localLstPanels = lstPanels;
                buttons[k].setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        if (localPanelViews[localK].getVisibility() == View.VISIBLE)
                        {
                            localPanelViews[localK].setVisibility(View.GONE);
                        } else
                        {
                            localPanelViews[localK].setVisibility(View.VISIBLE);
                        }
                        for (int l = 0; l < localLstPanels.size(); l++)
                        {
                            if (l != localK)
                            {
                                localPanelViews[l].setVisibility(View.GONE);
                            }
                        }
                    }
                });
            }

            //Add questions
            for (int i = 0; i < lstQuestions.length(); i++)
            {
                if((lstQuestions.getJSONObject(i).get("QuestionType").toString()).equals("SinglelineTextBox") == true)
                {
                    //Add a text box
                    LinearLayout ll_sub = new LinearLayout(this);
                    for(int k =0; k < panelViews.length; k++)
                    {
                        if ((lstQuestions.getJSONObject(i).get("Panel").toString()).equals(lstPanels.get(k)))
                        {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(lstQuestions.getJSONObject(i).get("text").toString());
                    ll_sub.addView(tv);
                    // TODO: Have the ctagroup people add a minimum character length for the SinglelineTextBox so we can wrap to the next line if it isn't big enough
                    if (tv.getText().length() >= 16)
                        ll_sub.setOrientation(LinearLayout.VERTICAL);

                    EditText et = new EditText(this);
                    et.setId(Integer.parseInt(lstQuestions.getJSONObject(i).get("QuestionId").toString()));
                    LinearLayout.LayoutParams etParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                    et.setLayoutParams(etParams);
                    ll_sub.addView(et);

                } else if((lstQuestions.getJSONObject(i).get("QuestionType").toString()).equals("SingleSelect") == true)
                {
                    //Add question with selections
                    LinearLayout ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.VERTICAL);
                    for(int k =0; k < panelViews.length; k++)
                    {
                        if ((lstQuestions.getJSONObject(i).get("Panel").toString()).equals(lstPanels.get(k)))
                        {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(lstQuestions.getJSONObject(i).get("text").toString());
                    ll_sub.addView(tv);


                    //Add potential answers
                    List<String> lstAnswers = new ArrayList<String>();
                    lstAnswers.add("-SELECT-");
                    String[] arrAnswers = (lstQuestions.getJSONObject(i).get("Options").toString()).split("\\|");
                    for (int j = 0; j < arrAnswers.length; j++) {
                        lstAnswers.add(arrAnswers[j]);
                    }

                    Spinner sp = new Spinner(this);
                    ArrayAdapter spArr = new ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item,
                            lstAnswers);
                    sp.setAdapter(spArr);
                    sp.setId(Integer.parseInt(lstQuestions.getJSONObject(i).get("QuestionId").toString()));
                    ll_sub.addView(sp);
                } else if((lstQuestions.getJSONObject(i).get("QuestionType").toString()).equals("MultiSelect") == true)
                {
                    //Add question with selections
                    LinearLayout ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.VERTICAL);
                    ll_sub.setId(Integer.parseInt(lstQuestions.getJSONObject(i).get("QuestionId").toString()));
                    for(int k =0; k < panelViews.length; k++)
                    {
                        if ((lstQuestions.getJSONObject(i).get("Panel").toString()).equals(lstPanels.get(k)))
                        {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(lstQuestions.getJSONObject(i).get("text").toString());
                    ll_sub.addView(tv);

                    //Add potential answers
                    String[] arrAnswers = (lstQuestions.getJSONObject(i).get("Options").toString()).split("\\|");
                    for (int j = 0; j < arrAnswers.length; j++) {
                        CheckBox cb = new CheckBox(this);
                        cb.setText(arrAnswers[j]);
                        ll_sub.addView(cb);
                    }
                }
            }

            rootLayout.addView(sv);
        }
        catch(JSONException e) {
            e.printStackTrace();
        }
    }

    public void cancelButton(View view)
    {
        finish();
    }

    public void submitButton(View view)
    {
        finish();
    }

}