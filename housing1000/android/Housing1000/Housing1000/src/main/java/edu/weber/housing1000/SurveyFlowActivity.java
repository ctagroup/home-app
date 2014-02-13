package edu.weber.housing1000;

import java.util.ArrayList;
import java.util.Locale;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.ActionBar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.app.FragmentPagerAdapter;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.astuetz.PagerSlidingTabStrip;

import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Fragments.PhotosFragment;
import edu.weber.housing1000.Fragments.SignatureFragment;
import edu.weber.housing1000.Fragments.SurveyAppFragment;
import edu.weber.housing1000.Fragments.SurveyFragment;
import edu.weber.housing1000.Helpers.REST.PostResponses;

public class SurveyFlowActivity extends ActionBarActivity implements PostResponses.OnPostSurveyResponsesTaskCompleted {
    public static final String EXTRA_SURVEY = "survey";

    private SurveyListing surveyListing;
    private ViewPager.OnPageChangeListener mPageChangeListener;

    private ProgressDialog progressDialog;

    /**
     * The {@link android.support.v4.view.PagerAdapter} that will provide
     * fragments for each of the sections. We use a
     * {@link FragmentPagerAdapter} derivative, which will keep every
     * loaded fragment in memory. If this becomes too memory intensive, it
     * may be best to switch to a
     * {@link android.support.v4.app.FragmentStatePagerAdapter}.
     */
    SectionsPagerAdapter mSectionsPagerAdapter;

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey_flow);

        final ActionBar ab = getSupportActionBar();
        //ab.setTitle(getResources().getString(R.string.app_name));

        // Grab the survey listing from the extras
        surveyListing = (SurveyListing) getIntent().getSerializableExtra(EXTRA_SURVEY);

        // Set up the action bar.
        final ActionBar actionBar = getSupportActionBar();

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        mSectionsPagerAdapter.addFragment(new SignatureFragment("Signature"));
        mSectionsPagerAdapter.addFragment(new PhotosFragment("Photos"));
        mSectionsPagerAdapter.addFragment(new SurveyFragment("Survey"));

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        mPageChangeListener = new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int i, float v, int i2) {

            }

            @Override
            public void onPageSelected(int i) {
                String actionBarTitle = ((SurveyAppFragment)mSectionsPagerAdapter.getItem(i)).getActionBarTitle();

                ab.setTitle(actionBarTitle != null ? actionBarTitle : getResources().getString(R.string.app_name));
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

        mPageChangeListener.onPageSelected(mViewPager.getCurrentItem());

//        // For each of the sections in the app, add a tab to the action bar.
//        for (int i = 0; i < mSectionsPagerAdapter.getCount(); i++) {
//            // Create a tab with text corresponding to the page title defined by
//            // the adapter. Also specify this Activity object, which implements
//            // the TabListener interface, as the callback (listener) for when
//            // this tab is selected.
//            actionBar.addTab(
//                    actionBar.newTab()
//                            .setText(mSectionsPagerAdapter.getPageTitle(i))
//                            .setTabListener(this));
//        }
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

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        private ArrayList<SurveyAppFragment> fragmentsList;

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);

            fragmentsList = new ArrayList<SurveyAppFragment>();
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            return fragmentsList.get(position);
        }

        @Override
        public int getCount() {
            return fragmentsList.size();
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return fragmentsList.get(position).getName();
        }

        public void addFragment(SurveyAppFragment fragment)
        {
            fragmentsList.add(fragment);
        }

        public void removeFragment(SurveyAppFragment fragment)
        {
            fragmentsList.remove(fragment);
        }
    }

}
