package edu.weber.housing1000.activities;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;

import edu.weber.housing1000.R;
import edu.weber.housing1000.Utils;
import edu.weber.housing1000.data.EncampmentSite;
import edu.weber.housing1000.fragments.EncampDetailsFragment;

/**
 * @author David Horton
 */
public class EncampmentDetailActivity extends ActionBarActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_encampment);
        Utils.setActionBarColorToDefault(this);

        Bundle b = getIntent().getExtras();
        EncampmentSite site = (EncampmentSite) b.getSerializable(EncampmentActivity.ENCAMP_DETAILS_BUNDLE_TAG);

        if (savedInstanceState == null) {
            EncampDetailsFragment detailsFragment = new EncampDetailsFragment();

            Bundle arguments = new Bundle();
            arguments.putSerializable(EncampmentActivity.ENCAMP_DETAILS_BUNDLE_TAG, site);
            detailsFragment.setArguments(arguments);

            getSupportFragmentManager().beginTransaction()
                    .add(R.id.encampmentContainer, detailsFragment, "EncampDetailsFragment")
                    .commit();
        }
    }
}
