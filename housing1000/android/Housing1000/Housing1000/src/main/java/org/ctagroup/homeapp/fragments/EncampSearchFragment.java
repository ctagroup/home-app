package org.ctagroup.homeapp.fragments;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;

import org.ctagroup.homeapp.R;
import org.ctagroup.homeapp.SurveyService;
import org.ctagroup.homeapp.Utils;
import org.ctagroup.homeapp.activities.EncampmentActivity;
import org.ctagroup.homeapp.data.EncampmentSite;
import org.ctagroup.homeapp.helpers.RESTHelper;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * @author David Horton
 */
public class EncampSearchFragment extends Fragment {

    private ArrayAdapter<EncampmentSite> adapter;
    private ArrayList<EncampmentSite> encampmentSites;
    private ProgressDialogFragment progressDialogFragment;
    private ListView encampmentListView;
    private TextView noResultsText;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_encamp_search, container, false);

        encampmentListView = (ListView)rootView.findViewById(R.id.encampList);
        noResultsText = (TextView)rootView.findViewById(R.id.empty_enamp_list_item);
        encampmentListView.setEmptyView(noResultsText);

        encampmentSites = new ArrayList<>();
        adapter = new ArrayAdapter<>(this.getActivity().getBaseContext(), R.layout.survey_list_item, encampmentSites);
        encampmentListView.setAdapter(adapter);

        ActionBar ab = ((android.support.v7.app.ActionBarActivity) this.getActivity()).getSupportActionBar();
        ab.setTitle("Search Results");

        if (savedInstanceState == null) {
            if (Utils.isOnline(this.getActivity())) {
                String searchString = getArguments().getString(EncampmentActivity.ENCAMP_SEARCH_BUNDLE_TAG);
                getSearchResults(searchString);
            }
            else {
                Utils.showNoInternetDialog(this.getActivity(), true);
            }
        } else {
            encampmentSites = savedInstanceState.getParcelableArrayList("encampmentSites");

            adapter.notifyDataSetChanged();

            if(encampmentSites.size() == 0) {
                noResultsText.setVisibility(View.VISIBLE);
            }
        }

        return rootView;
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        encampmentListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                listener.onEncampmentSelected(encampmentSites.get(i));
            }
        });

        noResultsText.setVisibility(View.GONE);
    }

    private void getSearchResults(String searchString) {

        // Start the loading dialog
        showProgressDialog(getString(R.string.please_wait), "Performing encampment search...", "");

        RestAdapter restAdapter = RESTHelper.setUpRestAdapter(this.getActivity(), null);

        SurveyService service = restAdapter.create(SurveyService.class);

        service.searchEncampment(searchString, new Callback<ArrayList<EncampmentSite>>() {
            @Override
            public void success(ArrayList<EncampmentSite> encampments, Response response) {
                encampmentSites.addAll(encampments);
                adapter.notifyDataSetChanged();
                dismissDialog();

                if(encampments.size() == 0) {
                    noResultsText.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                dismissDialog();
                error.printStackTrace();
                noResultsText.setVisibility(View.VISIBLE);
            }
        });
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putParcelableArrayList("encampmentSites", encampmentSites);
    }


    /**
     * A listener for communicating with the container activity
     */
    public interface EncampSearchFragmentListener {
        public void onEncampmentSelected(EncampmentSite selectedSite);
    }

    private EncampSearchFragmentListener listener;

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        listener = (EncampSearchFragmentListener) activity;
    }

    @Override
    public void onDetach() {
        super.onDetach();
        listener = null;
    }

    /**
     * @param title Title displayed
     * @param message Message displayed
     * @param tag The tag for the dialog
     */
    private void showProgressDialog(String title, String message, String tag) {
        progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
        progressDialogFragment.show(this.getActivity().getSupportFragmentManager(), tag);
    }

    /**
     * Dismiss the logging in dialog
     */
    private void dismissDialog() {
        if (progressDialogFragment != null) {
            progressDialogFragment.dismiss();
        }
    }
}
