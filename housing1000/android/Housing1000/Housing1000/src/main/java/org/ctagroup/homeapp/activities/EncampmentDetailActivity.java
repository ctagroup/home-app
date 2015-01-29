package org.ctagroup.homeapp.activities;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;

import org.ctagroup.homeapp.R;
import org.ctagroup.homeapp.Utils;
import org.ctagroup.homeapp.data.EncampmentSite;
import org.ctagroup.homeapp.fragments.EncampDetailsFragment;

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
