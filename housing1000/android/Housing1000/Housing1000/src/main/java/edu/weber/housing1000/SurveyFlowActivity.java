package edu.weber.housing1000;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.ActionBar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.MenuItem;

import com.astuetz.PagerSlidingTabStrip;
import com.google.common.hash.HashCode;
import com.google.common.hash.HashFunction;
import com.google.common.hash.Hashing;

import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Fragments.PhotosFragment;
import edu.weber.housing1000.Fragments.SignatureFragment;
import edu.weber.housing1000.Fragments.SurveyAppFragment;
import edu.weber.housing1000.Fragments.SurveyFragment;
import edu.weber.housing1000.Helpers.REST.PostResponses;

public class SurveyFlowActivity extends ActionBarActivity implements PostResponses.OnPostSurveyResponsesTaskCompleted {
    public static final String EXTRA_SURVEY = "survey";

    private SurveyListing surveyListing;

    private ProgressDialog progressDialog;

    private String folderHash;

    /**
     * The {@link android.support.v4.view.PagerAdapter} that will provide
     * fragments for each of the sections. We use a
     * {@link FragmentPagerAdapter} derivative, which will keep every
     * loaded fragment in memory. If this becomes too memory intensive, it
     * may be best to switch to a
     * {@link android.support.v4.app.FragmentStatePagerAdapter}.
     */
    SectionsPagerAdapter mSectionsPagerAdapter;
    ViewPager.OnPageChangeListener mPageChangeListener;

    /**
     * The {@link ViewPager} that will host the section contents.
     */
    ViewPager mViewPager;

    public ProgressDialog getProgressDialog()
    {
        return progressDialog;
    }

    public void setProgressDialog(ProgressDialog value)
    {
        progressDialog = value;
    }

    public String getFolderHash()
    {
        return folderHash;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey_flow);

        if (savedInstanceState != null)
        {
            surveyListing = (SurveyListing) savedInstanceState.getSerializable("surveyListing");
            folderHash = savedInstanceState.getString("folderHash");
        }
        else
        {
            // Grab the survey listing from the extras
            surveyListing = (SurveyListing) getIntent().getSerializableExtra(EXTRA_SURVEY);
            generateFolderHash();
        }

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.pager);
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
        PagerSlidingTabStrip tabs = (PagerSlidingTabStrip) findViewById(R.id.tabs);
        tabs.setShouldExpand(true);
        tabs.setViewPager(mViewPager);

        tabs.setOnPageChangeListener(mPageChangeListener);

        mViewPager.setCurrentItem(1);
        mViewPager.setCurrentItem(0);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        outState.putSerializable("surveyListing", surveyListing);
        outState.putString("folderHash", folderHash);
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

    public SurveyListing getSurveyListing()
    {
        return surveyListing;
    }

    @Override
    public void onPostSurveyResponsesTaskCompleted(String result) {
        progressDialog.dismiss();

        Log.d("SERVER RESPONSE", result);

        String[] split = result.split("=");
        String clientSurveyId = split[split.length - 1];

        Log.d("clientSurveyId", clientSurveyId);

        mViewPager.setCurrentItem(0);
    }

    @Override
    public void onBackPressed()
    {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Cancel this survey?");
        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
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

    public void generateFolderHash()
    {
        HashFunction hf = Hashing.md5();
        HashCode hc = hf.newHasher().putLong(System.currentTimeMillis()).hash();

        folderHash = hc.toString();

        Log.d("FOLDER HASH", folderHash);
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            switch (position)
            {
                case 0:
                    return new SignatureFragment("Signature", "Disclaimer");
                case 1:
                    return new PhotosFragment("Photos", "Client Photo(s)");
                case 2:
                    return new SurveyFragment("Survey", SurveyFlowActivity.this.surveyListing.getTitle());
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
            switch (position)
            {
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
