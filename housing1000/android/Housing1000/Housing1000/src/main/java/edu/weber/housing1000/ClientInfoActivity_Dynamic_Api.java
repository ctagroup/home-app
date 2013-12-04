package edu.weber.housing1000;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import edu.weber.housing1000.data.Question;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.db.SurveyDbAdapter;

public class ClientInfoActivity_Dynamic_Api extends Activity
{
    public static final String EXTRA_SURVEY = "survey";

    long surveyId = -1;
    SurveyListing survey;

    RelativeLayout rootLayout;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_clnt_info_dynamic);

        rootLayout = (RelativeLayout) findViewById(R.id.root_layout);

        surveyId = getIntent().getLongExtra(SurveyDbAdapter.SURVEYS_FIELD_ID, -1);
        survey = (SurveyListing) getIntent().getSerializableExtra(EXTRA_SURVEY);

        generateQuestionUi();
    }

    private void generateQuestionUi()
    {
        try
        {
            ScrollView sv = new ScrollView(this);
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            layoutParams.addRule(RelativeLayout.ABOVE, R.id.buttonsLinearLayout);
            sv.setLayoutParams(layoutParams);

            LinearLayout ll = new LinearLayout(this);
            ll.setOrientation(LinearLayout.VERTICAL);
            sv.addView(ll);

            ArrayList<Question> lstQuestions = JSONParser.parseSurveyQuestions(survey.getQuestions());

            // Sort the questions by orderId
            Collections.sort(lstQuestions, new Comparator<Question>() {
                public int compare(Question q1, Question q2) {
                    return q1.getOrderId() - q2.getOrderId();
                }
            });

            List<String> lstPanels = new ArrayList<String>();

            //Get panel types
            for (Question q : lstQuestions)
            {
                if (!lstPanels.contains(q.getGroup()))
                    lstPanels.add(q.getGroup());
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
            for (int i = 0; i < lstQuestions.size(); i++)
            {
                if(lstQuestions.get(i).getQuestionType().equals("SinglelineTextBox") == true)
                {
                    //Add a text box
                    LinearLayout ll_sub = new LinearLayout(this);
                    for(int k =0; k < panelViews.length; k++)
                    {
                        if (lstQuestions.get(i).getGroup().equals(lstPanels.get(k)))
                        {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(lstQuestions.get(i).getText());
                    ll_sub.addView(tv);

                    EditText et = new EditText(this);
                    et.setId(lstQuestions.get(i).getQuestionId());
                    LinearLayout.LayoutParams etParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                    et.setLayoutParams(etParams);
                    ll_sub.addView(et);

                } else if(lstQuestions.get(i).getQuestionType().equals("SingleSelect") == true)
                {
                    //Add question with selections
                    LinearLayout ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.VERTICAL);
                    for(int k =0; k < panelViews.length; k++)
                    {
                        if (lstQuestions.get(i).getGroup().equals(lstPanels.get(k)))
                        {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(lstQuestions.get(i).getText());
                    ll_sub.addView(tv);

                    //Add potential answers
                    List<String> lstAnswers = new ArrayList<String>();
                    lstAnswers.add("-SELECT-");
                    String[] arrAnswers = lstQuestions.get(i).getOptions().split("\\|");
                    for (int j = 0; j < arrAnswers.length; j++) {
                        lstAnswers.add(arrAnswers[j]);
                    }

                    Spinner sp = new Spinner(this);
                    ArrayAdapter spArr = new ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item,
                            lstAnswers);
                    sp.setAdapter(spArr);
                    sp.setId(lstQuestions.get(i).getQuestionId());
                    ll_sub.addView(sp);
                } else if(lstQuestions.get(i).getQuestionType().equals("MultiSelect") == true)
                {
                    //Add question with selections
                    LinearLayout ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.VERTICAL);
                    ll_sub.setId(lstQuestions.get(i).getQuestionId());
                    for(int k =0; k < panelViews.length; k++)
                    {
                        if (lstQuestions.get(i).getGroup().equals(lstPanels.get(k)))
                        {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(lstQuestions.get(i).getText());
                    ll_sub.addView(tv);

                    //Add potential answers
                    String[] arrAnswers = lstQuestions.get(i).getOptions().split("\\|");
                    for (int j = 0; j < arrAnswers.length; j++) {
                        CheckBox cb = new CheckBox(this);
                        cb.setText(arrAnswers[j]);
                        ll_sub.addView(cb);
                    }
                }
            }

            rootLayout.addView(sv);
        }
        catch (Exception e)
        {
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