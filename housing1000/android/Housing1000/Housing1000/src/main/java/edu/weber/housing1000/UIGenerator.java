package edu.weber.housing1000;

import android.animation.LayoutTransition;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Questions.Question;

/**
 * Created by Blake on 3/3/14.
 */
public class UIGenerator {

    /**
     * Sets up the UI elements for the survey form
     */
    public static ScrollView generateQuestionUi(Context context, SurveyListing surveyListing, ArrayList<Question> lstQuestions, Survey survey) {
        try {
            final ScrollView mainScrollView = new ScrollView(context);
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            layoutParams.addRule(RelativeLayout.ABOVE, R.id.buttonsLinearLayout);
            mainScrollView.setLayoutParams(layoutParams);

            LinearLayout mainLinearLayout = new LinearLayout(context);
            mainLinearLayout.setOrientation(LinearLayout.VERTICAL);
            LayoutTransition layoutTransition = new LayoutTransition();
            mainLinearLayout.setLayoutTransition(layoutTransition);
            mainScrollView.addView(mainLinearLayout);

            List<String> lstPanels = new ArrayList<String>();

            //Get panel types
            for (Question q : lstQuestions) {
                if (!q.getGroup().isEmpty() && !lstPanels.contains(q.getGroup()))
                    lstPanels.add(q.getGroup());
            }

            LinearLayout[] panelViews = new LinearLayout[lstPanels.size()];
            Button[] buttons = new Button[lstPanels.size()];

            //Create buttons and panels
            for (int k = 0; k < lstPanels.size(); k++) {
                Button btn = new Button(context);
                btn.setId(k);
                btn.setText(lstPanels.get(k));
                buttons[k] = btn;
                mainLinearLayout.addView(btn);

                LinearLayout panelView = new LinearLayout(context);
                panelView.setId(k);
                panelView.setOrientation(LinearLayout.VERTICAL);
                panelViews[k] = panelView;
                mainLinearLayout.addView(panelView);
                if (k > 0)
                    panelView.setVisibility(View.GONE);
            }

            //Set Click Events for the buttons
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

            // Create question views and add them
            for (Question question : lstQuestions) {
                View questionView = question.createView(context);

                if (questionView != null) {
                    if (lstPanels.size() > 0) {
                        for (int k = 0; k < panelViews.length; k++) {
                            if (question.getGroup().equals(lstPanels.get(k))) {
                                panelViews[k].addView(questionView);
                            }
                        }
                    } else {
                        mainLinearLayout.addView(questionView);
                    }
                }
            }

//            // Temporary for testing
//            // TODO REMOVE THIS - DEPENDENCY TESTING
//            if (survey.getSurveyId() == 1)
//            {
//                for (Question q : lstQuestions)
//                {
//                    if (q.getQuestionId() == 2)
//                    {
//                        q.setParentQuestionId(3);
//                        q.setParentRequiredAnswer("1234");
//                    }
//                    else if (q.getQuestionId() == 3)
//                    {
//                        q.setParentQuestionId(1);
//                        q.setParentRequiredAnswer("1234");
//                    }
//
//                }
//            }

            // Set up question dependencies
            Set<Question> dependencies = new HashSet<Question>();

            for (Question question : lstQuestions) {
                if (question.getParentQuestionId() > 0) {
                    for (Question q : lstQuestions) {
                        if (q.getQuestionId() == question.getParentQuestionId()) {
                            q.addDependent(question);
                            dependencies.add(q);
                            break;
                        }
                    }
                }
            }

            // Set click listeners on the parent questions so the answers will be compared
            for (Question question : dependencies) {
                question.hookUpDependents();
            }

            return mainScrollView;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }


}
