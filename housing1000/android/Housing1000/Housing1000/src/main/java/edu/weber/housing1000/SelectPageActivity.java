package edu.weber.housing1000;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class SelectPageActivity extends Activity {
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.select_page);

        //Get the Buttons
        Button clientButton = (Button) findViewById(R.id.censusBtn);
        Button interviewButton = (Button) findViewById(R.id.surveyBtn);
        Button dynamicWithApiButton = (Button) findViewById(R.id.dynamicWithApiButton);

        clientButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(SelectPageActivity.this, CensusActivity.class);
                startActivity(intent);
            }
        });

        interviewButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(SelectPageActivity.this, LegalDisclaimerActivity.class);
                startActivity(intent);
            }
        });

        dynamicWithApiButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                //getSurveyList();
                Intent intent = new Intent(SelectPageActivity.this, SurveyListActivity.class);
                startActivity(intent);
            }
        });

    }

}

