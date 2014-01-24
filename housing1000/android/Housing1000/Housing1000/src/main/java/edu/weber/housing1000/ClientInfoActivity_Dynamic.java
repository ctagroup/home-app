package edu.weber.housing1000;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.*;

import edu.weber.housing1000.Data.Client;
import edu.weber.housing1000.Data.Response;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Data.SurveyToSend;
import edu.weber.housing1000.Questions.Question;

public class ClientInfoActivity_Dynamic extends Activity
{

    //TODO: Inform CTA of the question types.
    /* *************************************** */
    /* There are four question types supported */
    /* by the dynamic activity. They are as    */
    /* follows:                                */
    /*  1. SinglelineTextBox -> Edit Text      */
    /*  2. SingleSelect -> Spinner             */
    /*  3. MultiSelect -> Checkboxes           */
    /*  4. SingleSelectRadio -> Radio Buttons  */
    /* *************************************** */

    ArrayList<Question>  lstQuestions;

    RelativeLayout rootLayout;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_clnt_info_dynamic);

        rootLayout = (RelativeLayout) findViewById(R.id.root_layout);

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

            lstQuestions = JSONParser.parseSurveyQuestionsOld(JSONParser.testSurvey);

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
                if (k > 0)
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


    public void cancelButton(View view)
    {
        finish();
    }

    public void submitButton(View view)
    {
        saveAnswers();
        finish();
    }

    public void saveAnswers() {
        Client client = new Client("2/14/1977", "37.336704, -121.919087", "1234", 14);
        ArrayList<Response> responses = generateResponses(lstQuestions);

        SurveyListing survey = new SurveyListing(0, "Test Survey", JSONParser.testSurvey);

        SurveyToSend surveyToSend = new SurveyToSend(survey, client, responses);

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
        String jsonData = gson.toJson(surveyToSend);

        Log.d("json", jsonData);
    }

    private  ArrayList<Response> generateResponses(ArrayList<Question> questions)
    {
        ArrayList<Response> responses = new ArrayList<Response>();

        for (Question question : questions)
        {
            Response response = new Response(question.getQuestionId(), question.getAnswer());

            responses.add(response);
        }

        return responses;
    }
}