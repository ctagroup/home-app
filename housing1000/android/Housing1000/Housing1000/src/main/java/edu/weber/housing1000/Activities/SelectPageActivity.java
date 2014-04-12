package edu.weber.housing1000.Activities;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import edu.weber.housing1000.R;
import edu.weber.housing1000.Utils;

public class SelectPageActivity extends ActionBarActivity {
    private final Context context = this;


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

        //Check if GPS is enabled
        LocationManager locationmanager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);

        if(!locationmanager.isProviderEnabled(LocationManager.GPS_PROVIDER))
        {
            AlertDialog.Builder alertDialog = new AlertDialog.Builder(context);

            alertDialog.setTitle("GPS Disabled");
            alertDialog.setMessage("GPS is not enabled. Do you want to go to the settings menu?");

            alertDialog.setPositiveButton("Settings",
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                            context.startActivity(intent);
                            dialog.dismiss();
                        }
                    });

            alertDialog.setNegativeButton("Cancel",
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.cancel();
                        }
                    });

            alertDialog.show();
            Log.d("GPS Disabled: ", "Please Enable GPS");
        }

    }

}

