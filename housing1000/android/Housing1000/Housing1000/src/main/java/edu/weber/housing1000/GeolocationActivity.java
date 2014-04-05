package edu.weber.housing1000;

import android.app.Activity;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.widget.TextView;

/**
 * Created with IntelliJ IDEA.
 * User: JAdams
 * Date: 11/7/12
 * Time: 6:17 AM
 * To change this template use File | Settings | File Templates.
 */

public class GeolocationActivity extends ActionBarActivity implements LocationListener
{//GeolocationActivity

    private TextView latitudeField;
    private TextView longitudeField;
    private TextView timeField;

    private LocationManager locationManager;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {//onCreate
        super.onCreate(savedInstanceState);
        setContentView(R.layout.geo_location);
        Utils.setActionBarColorToDefault(this);

        latitudeField  = (TextView) findViewById(R.id.latitudeCords);
        longitudeField = (TextView) findViewById(R.id.longitudeCords);
        timeField = (TextView) findViewById(R.id.timeValue);

        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        Location lastLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

        Criteria criteria = new Criteria();
        criteria.setAccuracy(Criteria.ACCURACY_FINE);
        criteria.setPowerRequirement(Criteria.POWER_LOW);

        //this below will force an update for last location
        String locationProvider = locationManager.getBestProvider(criteria, true);
        locationManager.requestLocationUpdates(locationProvider, 0, 0, this);

        if (lastLocation != null)
            onLocationChanged(lastLocation);

    }//onCreate


    //=== Methods for the GPS Location ===//
    @Override
    protected void onResume()
    {//onResume
        super.onRestart();
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0,0, this);
    }//onResume

    @Override
    protected void onPause()
    {//onPause
        super.onPause();
        locationManager.removeUpdates(this);
    }//onPause

    public void onLocationChanged(Location location)
    {//onLocationChanged
        String latString = Double.toString(location.getLatitude());
        String lonString = Double.toString(location.getLongitude());
        String timeString = Long.toString(location.getTime()/1000);

        latitudeField.setText(latString);
        longitudeField.setText(lonString);
        timeField.setText(timeString);
    }//onLocation Changed

    //=== Methods required by LocationListener (these really do nothing, they NEED to be here) ===//
    public void onProviderDisabled(String provider) {
    }
    public void onProviderEnabled(String provider) {
    }
    public void onStatusChanged(String provider, int status, Bundle extras) {
    }

}//GeolocationActivity
