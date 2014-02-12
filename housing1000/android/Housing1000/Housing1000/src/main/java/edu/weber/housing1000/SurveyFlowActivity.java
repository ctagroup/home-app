package edu.weber.housing1000;

import java.util.ArrayList;
import java.util.Locale;

import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.ActionBar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.app.FragmentPagerAdapter;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
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

public class SurveyFlowActivity extends ActionBarActivity {
    public static final String EXTRA_SURVEY = "survey";

    private SurveyListing surveyListing;
    private ViewPager.SimpleOnPageChangeListener mPageChangeListener;

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey_flow);

        ActionBar ab = getSupportActionBar();
        ab.setTitle("Housing 1000");

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

        // Set the page change listener
        //mViewPager.setOnPageChangeListener(mPageChangeListener);

        // Bind the tabs to the ViewPager
        PagerSlidingTabStrip tabs = (PagerSlidingTabStrip) findViewById(R.id.tabs);
        tabs.setViewPager(mViewPager);

        //tabs.setOnPageChangeListener(mPageChangeListener);

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
    public boolean onCreateOptionsMenu(Menu menu) {
        
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.survey_flow, menu);
        return true;
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
