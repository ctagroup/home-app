package edu.weber.housing1000;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.*;
import de.akquinet.android.androlog.Log;
import edu.weber.housing1000.data.SurveyResponse;
import edu.weber.housing1000.db.SurveyDbAdapter;

public class InterviewerInfoActivity extends Activity {

    long surveyId = -1;

    /**
     * Called when the activity is first created.
     *
     * @param savedInstanceState If the activity is being re-initialized after
     *                           previously being shut down then this Bundle contains the data it most
     *                           recently supplied in onSaveInstanceState(Bundle). <b>Note: Otherwise it is null.</b>
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Set the hmsId
        surveyId = getIntent().getLongExtra(SurveyDbAdapter.SURVEYS_FIELD_ID, -1);

        // Initializes the logging
        Log.init();

        // Log a message (only on dev platform)
        Log.i(this, "onCreate");

        setContentView(R.layout.interviewer_info);

        Button btnSubmit = (Button) findViewById(R.id.Submit);
        Button btnCancel = (Button) findViewById(R.id.Cancel);

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(InterviewerInfoActivity.this, MainMenuActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                startActivity(intent);
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SurveyDbAdapter db = new SurveyDbAdapter(getApplicationContext());
                db.open();
                saveSurveyResponseAnswer("udoyoudetectsignsorsy", findViewById(R.id.udoyoudetectsignsorsy), db);
                saveSurveyResponseAnswer("ansrInterviewerDrugs", findViewById(R.id.ansrInterviewerDrugs), db);
                saveSurveyResponseAnswer("mobservesignsorsympto", findViewById(R.id.mobservesignsorsympto), db);
                saveSurveyResponseAnswer("ansrInterviewerCity", findViewById(R.id.ansrInterviewerCity), db);
                saveSurveyResponseAnswer("censustrack", findViewById(R.id.censustrack), db);
                saveSurveyResponseAnswer("interviewersname", findViewById(R.id.interviewersname), db);
                db.close();
                Intent intent = new Intent(InterviewerInfoActivity.this, MainMenuActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                startActivity(intent);
            }
        });
    }

    private void saveSurveyResponseAnswer(String question, View view, SurveyDbAdapter db){
        String response = getEditableViewText(view);
        if (response != null){
            db.insertResponse(new SurveyResponse(surveyId, question, response));
        }
    }

    private String getEditableViewText(View view){
        String retVal = null;
        if(view instanceof RadioGroup) retVal = getRadioGroupValue((RadioGroup) view);
        else if(view instanceof EditText) retVal = getEditTextValue((EditText) view);
        return retVal;
    }

    public String getRadioGroupValue(RadioGroup radioGroup){
        int selected = radioGroup.getCheckedRadioButtonId();
        if (selected == -1) return null;
        return ((RadioButton)findViewById(selected)).getText().toString();
    }

    public String getEditTextValue(EditText editText){
        String retVal = null;
        CharSequence charSequence = editText.getText();
        if (charSequence != null) retVal = charSequence.toString();
        return retVal;
    }

    @Override
    public void onBackPressed(){
        Intent intent = new Intent(InterviewerInfoActivity.this, MainMenuActivity.class);
        startActivity(intent);
    }
}
