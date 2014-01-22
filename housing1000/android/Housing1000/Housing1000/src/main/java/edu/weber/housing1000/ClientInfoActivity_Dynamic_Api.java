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
import android.widget.RadioButton;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import edu.weber.housing1000.Questions.Question;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.db.SurveyDbAdapter;

public class ClientInfoActivity_Dynamic_Api extends Activity {
    public static final String EXTRA_SURVEY = "survey";

    private long surveyId = -1;
    private SurveyListing survey;

    private RelativeLayout rootLayout;

    ArrayList<Question> lstQuestions;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_clnt_info_dynamic);

        rootLayout = (RelativeLayout) findViewById(R.id.root_layout);

        surveyId = getIntent().getLongExtra(SurveyDbAdapter.SURVEYS_FIELD_ID, -1);
        survey = (SurveyListing) getIntent().getSerializableExtra(EXTRA_SURVEY);

        generateQuestionUi();
    }

    private void generateQuestionUi() {
        try {
            final ScrollView mainScrollView = new ScrollView(this);
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            layoutParams.addRule(RelativeLayout.ABOVE, R.id.buttonsLinearLayout);
            mainScrollView.setLayoutParams(layoutParams);

            LinearLayout mainLinearLayout = new LinearLayout(this);
            mainLinearLayout.setOrientation(LinearLayout.VERTICAL);
            mainScrollView.addView(mainLinearLayout);

            lstQuestions = JSONParser.parseSurveyQuestions(survey.getQuestions());

            // Sort the questions by orderId
            Collections.sort(lstQuestions, new Comparator<Question>() {
                public int compare(Question q1, Question q2) {
                    return q1.getOrderId() - q2.getOrderId();
                }
            });

            List<String> lstPanels = new ArrayList<String>();

            //Get panel types
            for (Question q : lstQuestions) {
                if (!lstPanels.contains(q.getGroup()))
                    lstPanels.add(q.getGroup());
            }

            LinearLayout[] panelViews = new LinearLayout[lstPanels.size()];
            Button[] buttons = new Button[lstPanels.size()];

            //Create buttons and panels
            for (int k = 0; k < lstPanels.size(); k++) {
                Button btn = new Button(this);
                btn.setId(k);
                btn.setText(lstPanels.get(k));
                buttons[k] = btn;
                mainLinearLayout.addView(btn);

                LinearLayout panelView = new LinearLayout(this);
                panelView.setId(k);
                panelView.setOrientation(LinearLayout.VERTICAL);
                panelViews[k] = panelView;
                mainLinearLayout.addView(panelView);
                if (k > 1)
                    panelView.setVisibility(View.GONE);
            }

            //Set Click Events
            for (int k = 0; k < lstPanels.size(); k++) {
                final int localK = k;
                final LinearLayout[] localPanelViews = panelViews;
                final List<String> localLstPanels = lstPanels;
                buttons[k].setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        if (localPanelViews[localK].getVisibility() == View.VISIBLE) {
                            localPanelViews[localK].setVisibility(View.GONE);
                        } else {
                            localPanelViews[localK].setVisibility(View.VISIBLE);
                        }
                        for (int l = 0; l < localLstPanels.size(); l++) {
                            if (l != localK) {
                                localPanelViews[l].setVisibility(View.GONE);
                            }
                        }
                    }
                });
            }

            //Add questions
            for (Question question : lstQuestions) {
                View questionView = question.createView(this);

                if (questionView != null)
                {
                    for (int k = 0; k < panelViews.length; k++) {
                        if (question.getGroup().equals(lstPanels.get(k))) {
                            panelViews[k].addView(questionView);
                        }
                    }
                }
            }

            rootLayout.addView(mainScrollView);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void cancelButton(View view) {
        finish();
    }

    public void submitButton(View view) {
        saveAnswers();
        finish();
    }

    public void saveAnswers() {
        for (Question question : lstQuestions) {

            // TODO: Implement answer grabbing code here

            Log.d("Answer: ", (question.getAnswer() != null) ? question.getAnswer() : "None");
        }
    }

}