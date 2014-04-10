package edu.weber.housing1000;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;

public class SelectPageActivity extends ActionBarActivity {
    public static double LATITUDE = 0;
    public static double LONGITUDE = 0;
    public static Location LOCATION = new Location("0, 0");
    Context context = this;


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

        //Start Location Listener
        LocationManager locationmanager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        LocationListener locationlistener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                LATITUDE = location.getLatitude();
                LONGITUDE = location.getLongitude();
                LOCATION = location;

                Log.d("GPS Location:", LATITUDE + "," + LONGITUDE);
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {
            }

            @Override
            public void onProviderEnabled(String provider) {
            }

            @Override
            public void onProviderDisabled(String provider) {
            }
        };

        locationmanager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 60000, 0, locationlistener);

        if(!locationmanager.isProviderEnabled(LocationManager.GPS_PROVIDER))
        {
            //Alert user to enable GPS
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

