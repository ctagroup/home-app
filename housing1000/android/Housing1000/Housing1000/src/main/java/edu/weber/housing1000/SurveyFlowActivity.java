package edu.weber.housing1000;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Parcel;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.astuetz.PagerSlidingTabStrip;
import com.google.common.hash.HashCode;
import com.google.common.hash.HashFunction;
import com.google.common.hash.Hashing;

import java.io.File;

import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Fragments.PhotosFragment;
import edu.weber.housing1000.Fragments.SignatureFragment;
import edu.weber.housing1000.Fragments.SurveyAppFragment;
import edu.weber.housing1000.Fragments.SurveyFragment;
import edu.weber.housing1000.Helpers.FileHelper;
import edu.weber.housing1000.Helpers.REST.PostImage;
import edu.weber.housing1000.Helpers.REST.PostResponses;

public class SurveyFlowActivity extends ActionBarActivity implements LocationListener, PostResponses.OnPostSurveyResponsesTaskCompleted, PostImage.OnPostImageTaskCompleted {
    public static final String EXTRA_SURVEY = "survey";

    //These are used to keep track of the submission state
    boolean submittingSurvey;
    boolean isSurveySubmitted;
    boolean isSignatureSubmitted;
    boolean isPhotoSubmitted;

    boolean isSignatureCaptured;

    PagerSlidingTabStrip mTabs;                         //Tabs of the view
    SectionsPagerAdapter mSectionsPagerAdapter;         //Keeps track of the fragments
    ViewPager.OnPageChangeListener mPageChangeListener; //Listens for page changes
    CustomViewPager mViewPager;                         //View object that holds the fragments

    private SurveyListing surveyListing;
    private ProgressDialog progressDialog;
    private String folderHash;                          //The name of the survey folder (for files)
    private String clientSurveyId;                      //Client survey id for image submission
    private Location currentLocation;
    private TextView latitudeField;
    private TextView longitudeField;
    private LocationManager locationManager;

    public ProgressDialog getProgressDialog() {
        return progressDialog;
    }

    public void setProgressDialog(ProgressDialog value) {
        progressDialog = value;
    }

    public String getFolderHash() {
        return folderHash;
    }

    public String getClientSurveyId() {
        return clientSurveyId;
    }

    public void setSubmittingSurvey(boolean value) {
        submittingSurvey = value;
    }

    public boolean getIsSignatureCaptured() {
        if (isSignatureCaptured && mTabs.getVisibility() != View.VISIBLE)
        {
            mTabs.setVisibility(View.VISIBLE);
        }
        else if (!isSignatureCaptured)
        {
            mTabs.setVisibility(View.GONE);
            mViewPager.setCurrentItem(0);
        }

        return isSignatureCaptured;
    }

    public void setIsSignatureCaptured(boolean value) {
        isSignatureCaptured = value;

        getIsSignatureCaptured();
    }

    public SurveyListing getSurveyListing() {
        return surveyListing;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey_flow);

        latitudeField  = (TextView) findViewById(R.id.latitudeCords);
        longitudeField = (TextView) findViewById(R.id.longitudeCords);

        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        currentLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

        Criteria criteria = new Criteria();
        criteria.setAccuracy(Criteria.ACCURACY_FINE);
        criteria.setPowerRequirement(Criteria.POWER_LOW);

        String locationProvider = locationManager.getBestProvider(criteria, true);
        locationManager.requestLocationUpdates(locationProvider, 5000, (float) 2.0, this);

        if (currentLocation != null)
            onLocationChanged(currentLocation);

        // Restore state after being recreated
        if (savedInstanceState != null) {
            surveyListing = (SurveyListing) savedInstanceState.getSerializable("surveyListing");
            folderHash = savedInstanceState.getString("folderHash");
            currentLocation = savedInstanceState.getParcelable("currentLocation");
            isSignatureCaptured = savedInstanceState.getBoolean("isSignatureCaptured");
        } else {
            // Grab the survey listing from the extras
            surveyListing = (SurveyListing) getIntent().getSerializableExtra(EXTRA_SURVEY);
            generateFolderHash();
        }

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (CustomViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        mPageChangeListener = new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int i, float v, int i2) {

            }

            @Override
            public void onPageSelected(int i) {
                final ActionBar actionBar = getSupportActionBar();

                String actionBarTitle = ((SurveyAppFragment) mSectionsPagerAdapter.getItem(i)).getActionBarTitle();

                actionBar.setTitle(actionBarTitle != null ? actionBarTitle : getResources().getString(R.string.app_name));
            }

            @Override
            public void onPageScrollStateChanged(int i) {

            }
        };
        // Set the page change listener
        mViewPager.setOnPageChangeListener(mPageChangeListener);

        // Bind the tabs to the ViewPager
        mTabs = (PagerSlidingTabStrip) findViewById(R.id.tabs);
        mTabs.setShouldExpand(true);
        mTabs.setViewPager(mViewPager);

        // Set the page change listener for the tabs
        mTabs.setOnPageChangeListener(mPageChangeListener);

        // Force a page change update
        mViewPager.setCurrentItem(1);
        mViewPager.setCurrentItem(0);

        getIsSignatureCaptured();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        // Store the survey listing and folder hash
        outState.putSerializable("surveyListing", surveyListing);
        outState.putString("folderHash", folderHash);
        if (currentLocation != null)
            outState.putParcelable("currentLocation", currentLocation);
        outState.putBoolean("isSignatureCaptured", isSignatureCaptured);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onPostSurveyResponsesTaskCompleted(String result) {
        progressDialog.dismiss();

        isSurveySubmitted = true;

        Log.d("SURVEY RESPONSE", result);

        String[] split = result.split("=");
        clientSurveyId = split[split.length - 1];

        Log.d("clientSurveyId", clientSurveyId);

        mViewPager.setCurrentItem(0);

        SignatureFragment signatureFragment = (SignatureFragment) mSectionsPagerAdapter.getItem(0);
        signatureFragment.submitSignature();
    }

    @Override
    public void onPostImageTaskCompleted(String result) {
        progressDialog.dismiss();

        isSignatureSubmitted = true;

        Log.d("SIGNATURE RESPONSE", result);

        mViewPager.setCurrentItem(1);

        // Submit photos here
    }

    @Override
    public void onBackPressed() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Cancel this survey?");
        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();

                // Delete the folder containing any related files
                File surveyDir = new File(FileHelper.getAbsoluteFilePath(getFolderHash(), ""));
                if (surveyDir.exists())
                {
                    Log.d("DELETING SURVEY DIR", surveyDir.getAbsolutePath());
                    FileHelper.deleteAllFiles(surveyDir);
                }

                finish();
            }
        });
        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        }).show();
    }

    public void generateFolderHash() {
        HashFunction hf = Hashing.md5();
        HashCode hc = hf.newHasher().putLong(System.currentTimeMillis()).hash();

        folderHash = hc.toString();

        Log.d("FOLDER HASH", folderHash);
    }

    public Location getLocation() {
        if(currentLocation == null)
        {
            Location falseLocation = new Location(LocationManager.GPS_PROVIDER);
            falseLocation.setLatitude(0);
            falseLocation.setLongitude(0);
            currentLocation = falseLocation;
        }

        String lat = currentLocation.getLatitude() + "";
        String lon = currentLocation.getLongitude() + "";
        String msg = "Location Details: \nLatitude: " + lat + "\nLongitude: " + lon;

        Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
        return currentLocation;
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {
        // Storing these in the adapter instead of just newing them up in getItem so we can call
        // any methods we might need down the road.
        SignatureFragment signatureFragment;
        PhotosFragment photosFragment;
        SurveyFragment surveyFragment;

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            switch (position) {
                case 0:
                    if (signatureFragment == null)
                        signatureFragment = new SignatureFragment("Signature", "Disclaimer");

                    return signatureFragment;
                case 1:
                    if (photosFragment == null)
                        photosFragment = new PhotosFragment("Photos", "Client Photo(s)");

                    return photosFragment;
                case 2:
                    if (surveyFragment == null)
                        surveyFragment = new SurveyFragment("Survey", SurveyFlowActivity.this.surveyListing.getTitle());

                    return surveyFragment;
                default:
                    return null;
            }
        }

        @Override
        public int getCount() {
            return 3;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            switch (position) {
                case 0:
                    return "Signature";
                case 1:
                    return "Photos";
                case 2:
                    return "Survey";
                default:
                    return "";
            }
        }
    }


    //Required LocationListener methods
    @Override
    protected void onResume()
    {
        super.onRestart();
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000,10, this);
    }

    @Override
    protected void onPause()
    {
        super.onPause();
        locationManager.removeUpdates(this);
    }

    @Override
    public void onLocationChanged(Location location) {
        String latString = Double.toString(location.getLatitude());
        String lonString = Double.toString(location.getLongitude());

        if (latitudeField != null) latitudeField.setText(latString);
        if (longitudeField != null) longitudeField.setText(lonString);
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

}
