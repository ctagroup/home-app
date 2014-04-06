package edu.weber.housing1000;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.View;
import android.widget.Button;

import edu.weber.housing1000.Helpers.ErrorHelper;

public class SelectPageActivity extends ActionBarActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            setContentView(R.layout.select_page);
            Utils.setActionBarColorToDefault(this);

            //Get the Buttons
            Button pitButton = (Button) findViewById(R.id.pitButton);
            Button dynamicWithApiButton = (Button) findViewById(R.id.dynamicWithApiButton);

            pitButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View view) {
                    Intent intent = new Intent(SelectPageActivity.this, PitActivity.class);
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
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }
}

