package edu.weber.housing1000;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.ActivityInfo;
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
import edu.weber.housing1000.Helpers.ErrorHelper;
import edu.weber.housing1000.Helpers.FileHelper;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import retrofit.client.Response;

public class SurveyFlowActivity extends ActionBarActivity {
    public static final String EXTRA_SURVEY = "survey";

    //private GPSTracker gps;

    private boolean isSignatureCaptured;

    private PagerSlidingTabStrip mTabs;                         //Tabs of the view
    private SectionsPagerAdapter mSectionsPagerAdapter;         //Keeps track of the fragments
    private CustomViewPager mViewPager;                         //View object that holds the fragments

    private SurveyListing surveyListing;
    private String folderHash;                          //The name of the survey folder (for files)
    private String clientSurveyId;                      //Client survey id for image submission
    //private Location currentLocation;

    private ProgressDialogFragment progressDialogFragment;

    public String getFolderHash() {
        return folderHash;
    }

    public String getClientSurveyId() {
        return clientSurveyId;
    }

    public void setSubmittingResponse(boolean value) {
        try {
            if (value) {
                Utils.lockScreenOrientation(this);
            } else {
                setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    public boolean getIsSignatureCaptured() {
        if (isSignatureCaptured && mTabs.getVisibility() != View.VISIBLE) {
            mTabs.setVisibility(View.VISIBLE);
        } else if (!isSignatureCaptured) {
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
        Utils.setActionBarColorToDefault(this);

        //gps = new GPSTracker(this);

        // Restore state after being recreated
        if (savedInstanceState != null) {
            surveyListing = (SurveyListing) savedInstanceState.getSerializable("surveyListing");
            folderHash = savedInstanceState.getString("folderHash");
            //currentLocation = savedInstanceState.getParcelable("currentLocation");
            isSignatureCaptured = savedInstanceState.getBoolean("isSignatureCaptured");
            clientSurveyId = savedInstanceState.getString("clientSurveyId");
        } else {
            // Grab the survey listing from the extras
            surveyListing = (SurveyListing) getIntent().getSerializableExtra(EXTRA_SURVEY);
            generateFolderHash();

            progressDialogFragment = (ProgressDialogFragment) getSupportFragmentManager().findFragmentByTag("Dialog");
        }

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (CustomViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);
        mViewPager.setOffscreenPageLimit(3);

        ViewPager.OnPageChangeListener mPageChangeListener = new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int i, float v, int i2) {

            }

            @Override
            public void onPageSelected(int i) {
                final ActionBar actionBar = getSupportActionBar();

                String actionBarTitle = ((SurveyAppFragment) mSectionsPagerAdapter.getItem(i)).getActionBarTitle();

                actionBar.setTitle(actionBarTitle != null ? actionBarTitle : getResources().getString(R.string.app_name));

                if (i == 0) {
//                    getLocation();

//                    String message = "Location Details" +
//                            "\nLatitude: " + gps.getLatitude() +
//                            "\nLongitude: " + gps.getLongitude() +
//                            "\nTime: " + gps.getTime();
//                    Toast.makeText(SurveyFlowActivity.this, message, Toast.LENGTH_SHORT).show();
                }
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
        mTabs.setIndicatorColorResource(R.color.tab_selected);

        // Set the page change listener for the tabs
        mTabs.setOnPageChangeListener(mPageChangeListener);

        if (savedInstanceState == null || mViewPager.getCurrentItem() == 0) {
            // Force a page change update
            mViewPager.setCurrentItem(1);
            mViewPager.setCurrentItem(0);
        }

        getIsSignatureCaptured();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        try {
            // Store the survey listing and folder hash
            outState.putSerializable("surveyListing", surveyListing);
            outState.putString("folderHash", folderHash);
            if (SelectPageActivity.LOCATION != null)
                outState.putParcelable("currentLocation", SelectPageActivity.LOCATION);
            outState.putBoolean("isSignatureCaptured", isSignatureCaptured);
            outState.putString("clientSurveyId", clientSurveyId);
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    @Override
    protected void onPause() {
        super.onPause();

        // Dismiss any dialogs to prevent WindowLeaked exceptions
        dismissDialog();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        return id == R.id.action_settings || super.onOptionsItemSelected(item);
    }

    public void onPostSurveyResponsesTaskCompleted(Response response) {
        dismissDialog();

        if (response != null && response.getStatus() == 201) {
            String result = "";

            try {
                result = RESTHelper.convertStreamToString(response.getBody().in());
            } catch (IOException e) {
                e.printStackTrace();
            }

            Log.d("SURVEY RESPONSE", result);

            String[] split = result.split("=");
            clientSurveyId = split[split.length - 1];
            clientSurveyId = clientSurveyId.replace("\n", "");

            Log.d("clientSurveyId", clientSurveyId);

            // Submit the photos
            Fragment f = this.getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));

            mViewPager.setCurrentItem(1, true);

            ((PhotosFragment) f).submitPhotos();
        } else if (response != null) {
            setSubmittingResponse(false);

            ErrorHelper.showError(this,getString(R.string.error_problem_submitting_survey));
        } else // survey response has already been submitted, move on to photos
        {
            // Submit the photos
            Fragment f = this.getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));

            mViewPager.setCurrentItem(1, true);

            ((PhotosFragment) f).submitPhotos();
        }
    }

    public void onPostPhotoTaskCompleted(Response response) {
        dismissDialog();

        if (response != null && response.getStatus() == 200) {
            try {
                if (response.getBody() != null)
                    Log.d("PHOTOS RESPONSE", RESTHelper.convertStreamToString(response.getBody().in()));
            } catch (IOException e) {
                e.printStackTrace();
            }

            // Submit signature
            Fragment f = this.getSupportFragmentManager().findFragmentByTag(getFragmentTag(0));
            mViewPager.setCurrentItem(0, true);

            ((SignatureFragment) f).submitSignature();
        } else {
            setSubmittingResponse(false);

            ErrorHelper.showError(this,getString(R.string.error_problem_submitting_photos));
        }
    }

    public void onPostSignatureTaskCompleted(Response response) {
        dismissDialog();

        if (response != null && response.getStatus() == 200) {
            try {
                if (response.getBody() != null)
                    Log.d("SIGNATURE RESPONSE", RESTHelper.convertStreamToString(response.getBody().in()));
            } catch (IOException e) {
                e.printStackTrace();
            }

            showSendSuccessMessage();
        } else {
            setSubmittingResponse(false);

            ErrorHelper.showError(this, getString(R.string.error_problem_submitting_signature));
        }
    }

    private void showSendSuccessMessage() {
        setSubmittingResponse(false);

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getString(R.string.success));
        builder.setMessage(getString(R.string.success_survey_response));
        builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                dialog.dismiss();

                // Delete the folder containing any related files
                deleteAllFolderFiles();

                finish();
            }
        });
        Utils.centerDialogMessageAndShow(builder);
    }

    @Override
    public void onBackPressed() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage(getString(R.string.cancel_this_survey));
        builder.setPositiveButton(getString(R.string.yes), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();

                // Delete the folder containing any related files
                deleteAllFolderFiles();

                finish();
            }
        });
        builder.setNegativeButton(getString(R.string.no), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        Utils.centerDialogMessageAndShow(builder);
    }

    private void deleteAllFolderFiles() {
        File surveyDir = new File(FileHelper.getAbsoluteFilePath(getFolderHash(), ""));
        if (surveyDir.exists()) {
            Log.d("DELETING SURVEY DIR", surveyDir.getAbsolutePath());
            FileHelper.deleteAllFiles(surveyDir);
        }
    }

    private void generateFolderHash() {
        HashFunction hf = Hashing.md5();
        HashCode hc = hf.newHasher().putLong(System.currentTimeMillis()).hash();

        folderHash = hc.toString();

        Log.d("FOLDER HASH", folderHash);
    }

//    public Location getLocation() {
//        if (gps.canGetLocation()) {
//            currentLocation = gps.getLocation();
//        }
//        gps.stopUsingGPS();
//        return currentLocation;
//    }

    public void showProgressDialog(String title, String message, String tag) {
        progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
        progressDialogFragment.show(getSupportFragmentManager(), tag);
    }

    private void dismissDialog() {
        if (progressDialogFragment != null && progressDialogFragment.isAdded()) {
            progressDialogFragment.dismiss();
            progressDialogFragment = null;
        }
    }

    private String getFragmentTag(int pos) {
        return "android:switcher:" + R.id.pager + ":" + pos;
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
                        signatureFragment = SignatureFragment.newInstance(getBaseContext());

                    return signatureFragment;
                case 1:
                    if (photosFragment == null)
                        photosFragment = PhotosFragment.newInstance(getBaseContext());

                    return photosFragment;
                case 2:
                    if (surveyFragment == null)
                        surveyFragment = SurveyFragment.newInstance(getBaseContext(), SurveyFlowActivity.this.surveyListing.getTitle());

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
                    return getString(R.string.fragment_signature_name);
                case 1:
                    return getString(R.string.fragment_photos_name);
                case 2:
                    return getString(R.string.fragment_survey_name);
                default:
                    return "";
            }
        }
    }

}
