package edu.weber.housing1000.Activities;

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

import edu.weber.housing1000.R;
import edu.weber.housing1000.Utils;

public class SelectPageActivity extends ActionBarActivity {
    private static double latitude = 0;
    private static double longitude = 0;
    private static Location currentLocation = new Location("0, 0");
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

        //Start Location Listener
        LocationManager locationmanager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        LocationListener locationlistener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                latitude = location.getLatitude();
                longitude = location.getLongitude();
                currentLocation = location;

                Log.d("GPS Location:", latitude + "," + longitude);
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

        // Get updates every 15 minutes
        locationmanager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 60000 * 15, 0, locationlistener);

        //Alert user to enable GPS if it is disabled
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

    public static Double getLatitude()
    {
        return latitude;
    }

    public static Double getLongitude()
    {
        return longitude;
    }

    public static Location getLocation()
    {
        return currentLocation;
    }
}

