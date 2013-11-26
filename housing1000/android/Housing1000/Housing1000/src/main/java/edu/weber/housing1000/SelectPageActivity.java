package edu.weber.housing1000;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class SelectPageActivity extends Activity {
    /**Called when the activity is first created. */
	
	TextView txt_display;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.select_page);

        //Get the Buttons
        Button clientButton = (Button) findViewById(R.id.censusBtn);
        Button interviewButton = (Button) findViewById(R.id.surveyBtn);
        Button dynamicButton = (Button) findViewById(R.id.dynamic_button);

        dynamicButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(SelectPageActivity.this, ClientInfoActivity_Dynamic.class);
                startActivity(intent);
            }
        });

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
        
      //  txt_display = (TextView) findViewById(R.id.txt_display);

        //txt_display.setText("Hello Youtube");

      //  setContentView(R.layout.main);
    }

}

