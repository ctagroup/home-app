package edu.weber.housing1000;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.*;

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
        surveyId = -1;

        setContentView(R.layout.interviewer_info);

        Button btnSubmit = (Button) findViewById(R.id.Submit);
        Button btnCancel = (Button) findViewById(R.id.Cancel);

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               finish();
            }
        });
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

}
