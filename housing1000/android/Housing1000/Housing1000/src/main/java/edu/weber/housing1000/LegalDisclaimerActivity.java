package edu.weber.housing1000;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import java.util.Random;

public class LegalDisclaimerActivity extends Activity {
    /**Called when the activity is first created. **/
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.legal_disclaimer);


        Button acceptButton = (Button) findViewById(R.id.acceptButton);

        acceptButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                //Test code to create a hms id
                Random randInt = new Random();
                int hms_id = randInt.nextInt();
                //End test code
                Intent intent = new Intent(LegalDisclaimerActivity.this, SignatureActivity.class);
                startActivity(intent);
            }
        });

        Button btnCancel = (Button) findViewById(R.id.cancelBtn);

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        
      //  txt_display = (TextView) findViewById(R.id.txt_display);

        //txt_display.setText("Hello Youtube");

      //  setContentView(R.layout.main);
    }

}

