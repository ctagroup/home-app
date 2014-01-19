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

import edu.weber.housing1000.data.Question;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.db.SurveyDbAdapter;

public class ClientInfoActivity_Dynamic_Api extends Activity {
    public static final String EXTRA_SURVEY = "survey";

    private long surveyId = -1;
    private SurveyListing survey;

    private RelativeLayout rootLayout;

    private List<View> answerViews;

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

            ArrayList<Question> lstQuestions = JSONParser.parseSurveyQuestions(survey.getQuestions());
            answerViews = new ArrayList<View>();

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
                if (question.getQuestionType().equals("SinglelineTextBox")) {
                    //Add a text box
                    LinearLayout ll_sub = new LinearLayout(this);
                    for (int k = 0; k < panelViews.length; k++) {
                        if (question.getGroup().equals(lstPanels.get(k))) {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(question.getText());
                    ll_sub.addView(tv);
                    // TODO: Have the ctagroup people add a minimum character length for the SinglelineTextBox so we can wrap to the next line if it isn't big enough
                    if (tv.getText().length() >= 16)
                        ll_sub.setOrientation(LinearLayout.VERTICAL);

                    EditText et = new EditText(this);
                    LinearLayout.LayoutParams etParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                    et.setLayoutParams(etParams);

                    et.setId(question.getQuestionId());
                    et.setTag(question.getQuestionType());
                    ll_sub.addView(et);
                    answerViews.add(et);
                } else if (question.getQuestionType().equals("SingleSelect")) {
                    //Add question with selections
                    LinearLayout ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.VERTICAL);
                    for (int k = 0; k < panelViews.length; k++) {
                        if (question.getGroup().equals(lstPanels.get(k))) {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(question.getText());
                    ll_sub.addView(tv);

                    //Add potential answers
                    List<String> lstAnswers = new ArrayList<String>();
                    lstAnswers.add("-SELECT-");
                    String[] arrAnswers = question.getOptions().split("\\|");
                    Collections.addAll(lstAnswers, arrAnswers);

                    Spinner spinner = new Spinner(this);
                    spinner.setAdapter(new ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item,
                            lstAnswers));

                    spinner.setId(question.getQuestionId());
                    spinner.setTag(question.getQuestionType());
                    ll_sub.addView(spinner);
                    answerViews.add(spinner);
                } else if (question.getQuestionType().equals("MultiSelect")) {
                    //Add question with selections
                    LinearLayout ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.VERTICAL);
                    for (int k = 0; k < panelViews.length; k++) {
                        if (question.getGroup().equals(lstPanels.get(k))) {
                            panelViews[k].addView(ll_sub);
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(question.getText());
                    ll_sub.addView(tv);

                    //Add potential answers
                    String[] arrAnswers = question.getOptions().split("\\|");
                    for (String answer : arrAnswers) {
                        CheckBox cb = new CheckBox(this);
                        cb.setText(answer);
                        ll_sub.addView(cb);
                    }

                    ll_sub.setId(question.getQuestionId());
                    ll_sub.setTag(question.getQuestionType());
                    answerViews.add(ll_sub);
                } else if (question.getQuestionType().equals("SingleSelectRadio")) {
                    //Add question with selections
                    LinearLayout ll_sub = new LinearLayout(this);
                    ll_sub.setOrientation(LinearLayout.VERTICAL);
                    ll_sub.setId(question.getQuestionId());
                    ll_sub.setTag(question.getQuestionType());
                    for (int k = 0; k < panelViews.length; k++) {
                        if (question.getGroup().equals(lstPanels.get(k))) {
                            panelViews[k].addView(ll_sub);
                            answerViews.add(ll_sub);
                            break;
                        }
                    }

                    TextView tv = new TextView(this);
                    tv.setText(question.getText());
                    ll_sub.addView(tv);

                    //Add potential answers
                    String[] arrAnswers = question.getOptions().split("\\|");
                    RadioButton[] RadioButtons = new RadioButton[arrAnswers.length];

                    for (int j = 0; j < arrAnswers.length; j++) {
                        RadioButtons[j] = new RadioButton(this);
                        RadioButtons[j].setText(arrAnswers[j]);
                        ll_sub.addView(RadioButtons[j]);
                    }

                    for (int j = 0; j < arrAnswers.length; j++) {
                        final int localJ = j;
                        final int maxJ = arrAnswers.length;
                        final RadioButton[] localRadioButtons = RadioButtons;

                        RadioButtons[j].setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                for (int l = 0; l < maxJ; l++) {
                                    if (l != localJ) {
                                        localRadioButtons[l].setChecked(false);
                                    }
                                }
                            }
                        });
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
        for (View view : answerViews) {
            Log.d("Answer View ID", String.valueOf(view.getId()));
            Log.d("Answer Type", view.getTag().toString());

            if (view.getTag().toString().equals("SinglelineTextBox")) {

            } else if (view.getTag().toString().equals("SingleSelect")) {

            } else if (view.getTag().toString().equals("MultiSelect")) {

            } else if (view.getTag().toString().equals("SingleSelectRadio")) {

            }

//            switch (view.getTag().toString())
//            {
//                case "SinglelineTextBox":
//                    break;
//                case "SingleSelect":
//                    break;
//                case "MultiSelect":
//                    break;
//                default:
//                    break;
//            }

        }
    }

}