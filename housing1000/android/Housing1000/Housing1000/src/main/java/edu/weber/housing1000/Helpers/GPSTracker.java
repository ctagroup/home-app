package edu.weber.housing1000.Helpers;

import android.app.AlertDialog;
import android.app.Service;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.util.Log;

/**
 * Created by Coty on 2/13/14.
 */
public class GPSTracker extends Service implements LocationListener {
    private final Context MCONTEXT;

    private Location LOCATION;
    private LocationManager LOCATIONMANAGER;

    private boolean ISGPSENABLED = false;
    private boolean ISNETWORKENABLED = false;
    private boolean CANGETLOCATION = false;

    private double LATITUDE;
    private double LONGITUDE;

    private long LOCATIONTIME;

    private String PROVIDER;
    private Criteria CRITERIA;

    private static final long MINDISTANCE = 0;
    private static final long MINTIME = 0;

    public GPSTracker(Context context) {
        this.MCONTEXT = context;
        getLocation();
    }

    public Location getLocation() {
        try {
            LOCATIONMANAGER = (LocationManager) MCONTEXT.getSystemService(LOCATION_SERVICE);

            ISGPSENABLED = LOCATIONMANAGER.isProviderEnabled(LocationManager.GPS_PROVIDER);
            ISNETWORKENABLED = LOCATIONMANAGER.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

            if(ISGPSENABLED || ISNETWORKENABLED) {
                CANGETLOCATION = true;

                /*if(ISNETWORKENABLED) {
                    LOCATIONMANAGER.requestLocationUpdates(
                            LocationManager.NETWORK_PROVIDER, MINTIME, MINDISTANCE, this);
                    Log.d("Network","Network");
                    if(LOCATIONMANAGER != null) {
                        LOCATION = LOCATIONMANAGER.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                        if(LOCATION != null) {
                            LATITUDE = LOCATION.getLatitude();
                            LONGITUDE = LOCATION.getLongitude();
                            LOCATIONTIME = LOCATION.getTime()/1000;
                        }
                    }
                }

                if(ISGPSENABLED) {
                    LOCATIONMANAGER.requestLocationUpdates(
                            LocationManager.GPS_PROVIDER, MINTIME, MINDISTANCE, this);
                    Log.d("GPS","GPS");
                    if(LOCATIONMANAGER != null) {
                        LOCATION = LOCATIONMANAGER.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                        if(LOCATION != null) {
                            LATITUDE = LOCATION.getLatitude();
                            LONGITUDE = LOCATION.getLongitude();
                            LOCATIONTIME = LOCATION.getTime()/1000;
                        }
                    }
                }*/

                CRITERIA = new Criteria();
                CRITERIA.setAccuracy(Criteria.ACCURACY_FINE);
                CRITERIA.setPowerRequirement(Criteria.POWER_LOW);
                PROVIDER = LOCATIONMANAGER.getBestProvider(CRITERIA, true);
                LOCATION = LOCATIONMANAGER.getLastKnownLocation(PROVIDER);
                Log.d("Provider: ", PROVIDER);
                LOCATIONMANAGER.requestLocationUpdates(PROVIDER, MINTIME, MINDISTANCE, this);
                if(LOCATION != null) {
                    LATITUDE = LOCATION.getLatitude();
                    LONGITUDE = LOCATION.getLongitude();
                    LOCATIONTIME = LOCATION.getTime()/1000;
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }

        return LOCATION;
    }

    public double getLatitude() {
        double lat = 0;

        if(LOCATION != null) {
            lat = LATITUDE;
        }

        return lat;
    }

    public double getLongitude() {
        double lon = 0;

        if(LOCATION != null) {
            lon = LONGITUDE;
        }

        return lon;
    }

    public long getTime() {
        long time = 0;

        if(LOCATION != null) {
            time = LOCATIONTIME;
        }

        return time;
    }

    public boolean canGetLocation() {
        return CANGETLOCATION;
    }

    public void showSettingsAlert() {
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(MCONTEXT);

        alertDialog.setTitle("GPS Disabled");
        alertDialog.setMessage("GPS is not enabled. Do you want to go to the settings menu?");

        alertDialog.setPositiveButton("Settings",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        MCONTEXT.startActivity(intent);
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
    }

    public void stopUsingGPS() {
        if(LOCATION != null) {
            LOCATIONMANAGER.removeUpdates(this);
        }
    }

    //REQUIRED METHODS FOR LOCATIONLISTENER
    @Override
    public void onLocationChanged(Location location) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public IBinder onBind(Intent arg0) {
        return null;
    }

}