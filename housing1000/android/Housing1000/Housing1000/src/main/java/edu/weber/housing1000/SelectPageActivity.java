package edu.weber.housing1000;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.view.View;
import android.widget.Button;

import com.squareup.okhttp.internal.Util;

public class SelectPageActivity extends ActionBarActivity {
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
    }

}

