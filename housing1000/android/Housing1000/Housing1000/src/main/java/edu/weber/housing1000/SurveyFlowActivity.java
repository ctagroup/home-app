package edu.weber.housing1000;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.astuetz.PagerSlidingTabStrip;
import com.google.common.hash.HashCode;
import com.google.common.hash.HashFunction;
import com.google.common.hash.Hashing;

import java.io.File;
import java.io.IOException;

import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Fragments.PhotosFragment;
import edu.weber.housing1000.Fragments.ProgressDialogFragment;
import edu.weber.housing1000.Fragments.SignatureFragment;
import edu.weber.housing1000.Fragments.SurveyAppFragment;
import edu.weber.housing1000.Fragments.SurveyFragment;
import edu.weber.housing1000.Helpers.FileHelper;
import edu.weber.housing1000.Helpers.GPSTracker;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import retrofit.client.Response;

public class SurveyFlowActivity extends ActionBarActivity {
    public static final String EXTRA_SURVEY = "survey";

    GPSTracker gps;

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
    private String folderHash;                          //The name of the survey folder (for files)
    private String clientSurveyId;                      //Client survey id for image submission
    private Location currentLocation;
    private TextView latitudeField;
    private TextView longitudeField;
    private LocationManager locationManager;

    private ProgressDialogFragment progressDialogFragment;

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

        //GPS TESTING
        /*Intent intent = new Intent(this, GeolocationActivity.class);
        startActivityForResult(intent, 1);*/
        gps = new GPSTracker(this);

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
        mViewPager.setOffscreenPageLimit(3);

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

    public void onPostSurveyResponsesTaskCompleted(String result) {
        dismissDialog();

        isSurveySubmitted = true;

        Log.d("SURVEY RESPONSE", result);

        String[] split = result.split("=");
        clientSurveyId = split[split.length - 1];
        clientSurveyId = clientSurveyId.replace("\n", "");

        Log.d("clientSurveyId", clientSurveyId);

        // Submit the photos
        Fragment f = this.getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));
        mViewPager.setCurrentItem(1, true);

        ((PhotosFragment) f).submitPhotos();
    }

    public void onPostPhotoTaskCompleted(Response response) {
        //Check the result here

        dismissDialog();

        isPhotoSubmitted = true;

        if (response != null)
        {
            try {
                Log.d("PHOTOS RESPONSE", RESTHelper.convertStreamToString(response.getBody().in()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // Submit signature
        Fragment f = this.getSupportFragmentManager().findFragmentByTag(getFragmentTag(0));
        mViewPager.setCurrentItem(0, true);

        ((SignatureFragment) f).submitSignature();

    }

    public void onPostSignatureTaskCompleted(Response response) {
        //Check the result here

        dismissDialog();

        isSignatureSubmitted = true;

        if (response != null)
        {
            try {
                Log.d("SIGNATURE RESPONSE", RESTHelper.convertStreamToString(response.getBody().in()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        showSendSuccessMessage();
    }

    private void showSendSuccessMessage()
    {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Success!");
        builder.setMessage("The survey response and image(s) have been successfully sent.");
        builder.setNeutralButton("Okay", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();

                // Delete the folder containing any related files
                deleteAllFolderFiles();

                finish();
            }
        });
        builder.show();
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
                deleteAllFolderFiles();

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

    private void deleteAllFolderFiles()
    {
        File surveyDir = new File(FileHelper.getAbsoluteFilePath(getFolderHash(), ""));
        if (surveyDir.exists()) {
            Log.d("DELETING SURVEY DIR", surveyDir.getAbsolutePath());
            FileHelper.deleteAllFiles(surveyDir);
        }
    }

    public void generateFolderHash() {
        HashFunction hf = Hashing.md5();
        HashCode hc = hf.newHasher().putLong(System.currentTimeMillis()).hash();

        folderHash = hc.toString();

        Log.d("FOLDER HASH", folderHash);
    }

    public Location getLocation() {
        if(gps.canGetLocation()) {
            currentLocation = gps.getLocation();

            String message = "Location Details" +
                    "\nLatitude: " + gps.getLatitude() +
                    "\nLongitude: " + gps.getLongitude() +
                    "\nTime: " + gps.getTime();
            Toast.makeText(this, message, Toast.LENGTH_LONG).show();
        }
        gps.stopUsingGPS();
        return currentLocation;
    }

    public void showProgressDialog(String title, String message, String tag)
    {
        progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
        progressDialogFragment.show(getSupportFragmentManager(), tag);
    }

    public void dismissDialog(){
        if (progressDialogFragment != null) {
            progressDialogFragment.dismiss();
        }
    }

    private String getFragmentTag(int pos){
        return "android:switcher:"+R.id.pager+":"+pos;
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {
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

}
