package edu.weber.housing1000;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import de.akquinet.android.androlog.Log;
import android.view.View.OnClickListener;

//=== GEOLOCATION IMPORTS ===//
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.Criteria;

/**
 * Created with IntelliJ IDEA.
 * User: JAdams
 * Date: 11/8/12
 * Time: 7:45 AM
 * To change this template use File | Settings | File Templates.
 */
public class CensusActivity extends Activity implements LocationListener
{//CensusActivity

    //counter variables
    private int Male18Count = 0;
    private int maleMiddleCounter  = 0;
    private int maleBottomCounter = 0;
    private int FemaleUnder18Counter = 0;
    private int FemaleMiddleTextCounter = 0;
    private int Female25Counter = 0;
    private int CarsCounter = 0;
    private int VanCounter = 0;
    private int tentCounter = 0;
    private int BuildingsCounter = 0;
    private int rangerCounter = 0;


    //=== GEOLOCATION VARIABLES ===//
    private TextView latitudeField;
    private TextView longitudeField;

    private LocationManager locationManager;

    public void onCreate(Bundle savedInstanceState)
    {//onCreate
        super.onCreate(savedInstanceState);


        // Initializes the logging
        Log.init();

        // Log a message (only on dev platform)
        Log.i(this, "onCreate");

        setContentView(R.layout.census_menu);

        //declare all the controls needed for census
        Button getGeolocationButton = (Button) findViewById(R.id.button1); //forgot to name this one on the layoyut

        Button menuIndividualButton = (Button)findViewById(R.id.btnIndividualsText);
        Button menuMiscellaneousButton = (Button)findViewById(R.id.btnMiscellaneous);
        Button Male18Minus  = (Button) findViewById(R.id.Male18Minus);
        Button Male18Plus = (Button) findViewById(R.id.Male18Plus);

        Button maleButtonMiddleMinus   = (Button) findViewById(R.id.malePlusButtonMiddle);
        Button maleMiddlePlusButton = (Button) findViewById(R.id.maleMiddleMinusButton);

        Button maleButtonMinusBottom   = (Button) findViewById(R.id.malePlusButtonBottom );
        Button maleBottmPlusButton = (Button) findViewById(R.id.maleBottmMinusButton);

        Button FemaleUnder18minus   = (Button) findViewById(R.id.FemaleUnder18minus );
        Button FemaleUnder18Plus = (Button) findViewById(R.id.FemaleUnder18Plus);

        Button FemaleMiddleminus   = (Button) findViewById(R.id.FemaleMiddleminus );
        Button FemaleMiddlePlus = (Button) findViewById(R.id.FemaleMiddlePlus);

        Button Female25minus   = (Button) findViewById(R.id.Female25minus );
        Button Female25Plus = (Button) findViewById(R.id.Female25Plus);

        Button Carsminus   = (Button) findViewById(R.id.Carsminus );
        Button CarsPlus = (Button) findViewById(R.id.CarsPlus);

        Button Vanminus   = (Button) findViewById(R.id.Vanminus );
        Button VanPlus = (Button) findViewById(R.id.VanPlus);

        Button TentMinus   = (Button) findViewById(R.id.TentMinus );
        Button tentPlus = (Button) findViewById(R.id.tentPlus);

        Button BuildingsMinus   = (Button) findViewById(R.id.BuildingsMinus );
        Button BuildingsPlus = (Button) findViewById(R.id.BuildingsPlus);

        Button rangerMinus    = (Button) findViewById(R.id.rangerMinus  );
        Button rangerPlus = (Button) findViewById(R.id.rangerPlus);

       //Button saveAllButton = (Button) findViewById(R.id.saveAllButton);



       // Button carsPlusButton    = (Button) findViewById(R.id.carsPlusButton);
       // Button carsMinusButton   = (Button) findViewById(R.id.carsMinusButton);
        //final EditText carsLabel = (EditText) findViewById(R.id.carsCounterLabel);


        Button saveAllButton     = (Button) findViewById(R.id.saveAllButton);


        View individualView = findViewById(R.id.IndividualView);
        individualView.setVisibility(View.GONE);
        View familyView = findViewById(R.id.MiscellaneousView);
        familyView.setVisibility(View.GONE);


       // TextView carsLabel   = (TextView) findViewById(R.id.carsCounterLabel);

        //===================== G E O L O C A T I O N =================================
        getGeolocationButton.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                Intent intent = new Intent(CensusActivity.this, GeolocationActivity.class);
                startActivityForResult(intent, 1);
            }
        });

        //=================== Male    C O U N T E R ===========================
        //===== Male18 plus ====
        Male18Minus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Male18Count = Male18Count - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.Male18Label);
                peopleLabel.setText(String.valueOf(Male18Count));
            }
        });


        //===== male18 minus ====
        Male18Plus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.Male18Label);
                Male18Count = Male18Count + 1;
                peopleLabel.setText(String.valueOf(Male18Count));


            }
        });

        //===== maleButtonMiddleMinus  ====
        maleButtonMiddleMinus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                maleMiddleCounter = maleMiddleCounter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.maleMiddleCounterText);
                peopleLabel.setText(String.valueOf(maleMiddleCounter));
            }
        });


        //===== maleMiddlePlusButton   ====
        maleMiddlePlusButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.maleMiddleCounterText);
                maleMiddleCounter = maleMiddleCounter + 1;
                peopleLabel.setText(String.valueOf(maleMiddleCounter));


            }
        });

        //===== maleButtonMinusBottom   ====
        maleButtonMinusBottom.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                maleBottomCounter = maleBottomCounter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.maleBottomCounterText);
                peopleLabel.setText(String.valueOf(maleBottomCounter));
            }
        });


        //===== maleBottmPlusButton     ====
        maleBottmPlusButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.maleBottomCounterText);
                maleBottomCounter = maleBottomCounter + 1;
                peopleLabel.setText(String.valueOf(maleBottomCounter));


            }
        });

        //===== FemaleUnder18minus ====
        FemaleUnder18minus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                FemaleUnder18Counter = FemaleUnder18Counter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.FemaleUnder18text);
                peopleLabel.setText(String.valueOf(FemaleUnder18Counter));
            }
        });


        //===== FemaleUnder18Plus ====
        FemaleUnder18Plus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.FemaleUnder18text);
                FemaleUnder18Counter = FemaleUnder18Counter + 1;
                peopleLabel.setText(String.valueOf(FemaleUnder18Counter));


            }
        });

        //===== FemaleMiddleminus  ====
        FemaleMiddleminus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                FemaleMiddleTextCounter = FemaleMiddleTextCounter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.FemaleMiddleText);
                peopleLabel.setText(String.valueOf(FemaleMiddleTextCounter));
            }
        });


        //===== FemaleMiddlePlus   ====
        FemaleMiddlePlus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.FemaleMiddleText );
                FemaleMiddleTextCounter = FemaleMiddleTextCounter + 1;
                peopleLabel.setText(String.valueOf(FemaleMiddleTextCounter));


            }
        });

        //===== Female25minus   ====
        Female25minus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Female25Counter = Female25Counter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.Female25text );
                peopleLabel.setText(String.valueOf(Female25Counter));
            }
        });


        //===== Female25Plus     ====
        Female25Plus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.Female25text);
                Female25Counter = Female25Counter + 1;
                peopleLabel.setText(String.valueOf(Female25Counter));


            }
        });


        //===== Carsminus    ====
        Carsminus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                CarsCounter = CarsCounter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.CarsText  );
                peopleLabel.setText(String.valueOf(CarsCounter));
            }
        });


        //===== Female25Plus     ====
        CarsPlus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.CarsText);
                CarsCounter = CarsCounter + 1;
                peopleLabel.setText(String.valueOf(CarsCounter));


            }
        });

        //===== Vanminus     ====
        Vanminus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                VanCounter = VanCounter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.VanText );
                peopleLabel.setText(String.valueOf(VanCounter));
            }
        });


        //===== Female25Plus     ====
        VanPlus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.VanText);
                VanCounter = VanCounter + 1;
                peopleLabel.setText(String.valueOf(VanCounter));


            }
        });

        //===== TentMinus      ====
        TentMinus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                tentCounter = tentCounter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.tentText  );
                peopleLabel.setText(String.valueOf(tentCounter));
            }
        });


        //===== tentPlus       ====
        tentPlus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.tentText );
                tentCounter = tentCounter + 1;
                peopleLabel.setText(String.valueOf(tentCounter));


            }
        });

        //===== BuildingsMinus       ====
        BuildingsMinus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                BuildingsCounter = BuildingsCounter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.BuildingsText   );
                peopleLabel.setText(String.valueOf(BuildingsCounter));
            }
        });

        //===== BuildingsPlus       ====
        BuildingsPlus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.BuildingsText );
                BuildingsCounter = BuildingsCounter + 1;
                peopleLabel.setText(String.valueOf(BuildingsCounter));
            }
        });

        //===== rangerMinus        ====
        rangerMinus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                rangerCounter = rangerCounter - 1;
                TextView peopleLabel = (TextView) findViewById(R.id.rangerText);
                peopleLabel.setText(String.valueOf(rangerCounter));
            }
        });

        //===== rangerPlus         ====
        rangerPlus.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView peopleLabel = (TextView) findViewById(R.id.rangerText);
                rangerCounter = rangerCounter + 1;
                peopleLabel.setText(String.valueOf(rangerCounter));
            }
        });

        //===== saveAllButton====
        saveAllButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                finish();
            }
        });







        //===============Ind Button click ===================//
        menuIndividualButton.setOnClickListener(new OnClickListener() {

           //@Override
            public void onClick(View v) {
                // DO STUFF
                View individualView = findViewById(R.id.IndividualView);
                if (individualView.getVisibility() == View.VISIBLE) {
                    individualView.setVisibility(View.GONE);
                } else {
                    individualView.setVisibility(View.VISIBLE);
                    //  View clientInfoTop = findViewById(R.id.questionOne);
                    //  menuIndividualButton.setFocusableInTouchMode(true);
                    // clientInfoTop.requestFocus();
                }
            }
        });

        //===============Family Button click ===================//
        menuMiscellaneousButton.setOnClickListener(new OnClickListener() {

            //@Override
            public void onClick(View v) {
                // DO STUFF
                View familylView = findViewById(R.id.MiscellaneousView);
                if (familylView.getVisibility() == View.VISIBLE) {
                    familylView.setVisibility(View.GONE);
                } else {
                    familylView.setVisibility(View.VISIBLE);
                    //  View clientInfoTop = findViewById(R.id.questionOne);
                    //  menuIndividualButton.setFocusableInTouchMode(true);
                    // clientInfoTop.requestFocus();
                }
            }
        });



        //================ C A R S    C O U N T E R ===================================



        //***** D E C L A R A T I O N S     F O R    G E O L O C A T I O N *****//

        latitudeField  = (TextView) findViewById(R.id.latitudeCords);
        longitudeField = (TextView) findViewById(R.id.longitudeCords);

        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        Location lastLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

        Criteria criteria = new Criteria();
        criteria.setAccuracy(Criteria.ACCURACY_FINE);
        criteria.setPowerRequirement(Criteria.POWER_LOW);

        //this below will force an update for last location
        String locationProvider = locationManager.getBestProvider(criteria, true);
        locationManager.requestLocationUpdates(locationProvider, 5000, (float) 2.0, this);

        if (lastLocation != null)
            onLocationChanged(lastLocation);

    }//onCreate

    //=== Methods for the GPS Location ===//
    @Override
    protected void onResume()
    {//onResume
        super.onRestart();
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000,10, this);
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

        if (latitudeField != null) latitudeField.setText(latString);
        if (longitudeField != null) longitudeField.setText(lonString);

    }//onLocation Changed

    //=== Methods required by LocationListener (these really do nothing, they NEED to be here) ===//
    public void onProviderDisabled(String provider) {
    }
    public void onProviderEnabled(String provider) {
    }
    public void onStatusChanged(String provider, int status, Bundle extras) {
    }

}//CensusActivity
