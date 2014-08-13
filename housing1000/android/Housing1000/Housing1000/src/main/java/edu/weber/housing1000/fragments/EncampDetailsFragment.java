package edu.weber.housing1000.fragments;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import edu.weber.housing1000.R;
import edu.weber.housing1000.activities.EncampmentActivity;
import edu.weber.housing1000.data.EncampmentSite;

/**
 * @author David Horton
 */
public class EncampDetailsFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_encamp_details, container, false);

        ActionBar ab = ((android.support.v7.app.ActionBarActivity) this.getActivity()).getSupportActionBar();
        ab.setTitle("Site Details");

        EncampmentSite site = (EncampmentSite) getArguments().getSerializable(EncampmentActivity.ENCAMP_DETAILS_BUNDLE_TAG);

        //Set all of the edit texts on this screen
        TextView txt_councilDistrict = (TextView)rootView.findViewById(R.id.txt_encamp_details_council);
        txt_councilDistrict.setText(formatSiteDetail(Long.toString(site.getCouncilDistrict())));
        TextView txt_dispatchId = (TextView)rootView.findViewById(R.id.txt_encamp_details_dispatch);
        txt_dispatchId.setText(formatSiteDetail(site.getDispatchId()));
        TextView txt_encampmentLocation = (TextView)rootView.findViewById(R.id.txt_encamp_details_location);
        txt_encampmentLocation.setText(formatSiteDetail(site.getEncampLocation()));
        TextView txt_siteId = (TextView)rootView.findViewById(R.id.txt_encamp_details_id);
        txt_siteId.setText(formatSiteDetail(Long.toString(site.getEncampSiteId())));
        TextView txt_size = (TextView)rootView.findViewById(R.id.txt_encamp_details_size);
        txt_size.setText(formatSiteDetail(site.getEncampSize()));
        TextView txt_type = (TextView)rootView.findViewById(R.id.txt_encamp_details_type);
        txt_type.setText(formatSiteDetail(site.getEncampType()));
        TextView txt_environmentImpact = (TextView)rootView.findViewById(R.id.txt_encamp_details_impact);
        txt_environmentImpact.setText(formatSiteDetail(site.getEnvironmentImpact()));
        TextView txt_publicVisibility = (TextView)rootView.findViewById(R.id.txt_encamp_details_visibility);
        txt_publicVisibility.setText(formatSiteDetail(site.getPublicVisibility()));
        TextView txt_siteCode = (TextView)rootView.findViewById(R.id.txt_encamp_details_code);
        txt_siteCode.setText(formatSiteDetail(site.getSiteCode()));
        TextView txt_inactive = (TextView)rootView.findViewById(R.id.txt_encamp_details_inactive);
        txt_inactive.setText(site.isInactive() ? "Yes" : "No");

        return rootView;
    }

    private String formatSiteDetail(String detail) {
        String formattedDetail = "";

        if(detail == null) {
            formattedDetail = "N/A";
        }
        else if("".equals(detail)) {
            formattedDetail = "N/A";
        }
        else {
            formattedDetail = detail;
        }

        return formattedDetail;
    }

}
