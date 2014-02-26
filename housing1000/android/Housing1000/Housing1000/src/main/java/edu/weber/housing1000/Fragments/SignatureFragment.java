package edu.weber.housing1000.Fragments;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import edu.weber.housing1000.Helpers.REST.PostResponses;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SignatureActivity;
import edu.weber.housing1000.SurveyFlowActivity;

/**
 * Created by Blake on 2/11/14.
 */
public class SignatureFragment extends SurveyAppFragment {
    public static final int RESULT_SIGNATURE_SAVED = 1;

    SurveyFlowActivity myActivity;

    ImageView signatureImageView;
    RelativeLayout signatureLayout;
    TextView tapHereToSignTextView;

    byte[] signatureImageBytes;
    String signaturePath;

    public SignatureFragment() {
    }

    public SignatureFragment(String name, String actionBarTitle) {
        super(name, actionBarTitle);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (savedInstanceState != null) {
            signatureImageBytes = savedInstanceState.getByteArray("signatureImageBytes");
            signaturePath = savedInstanceState.getString("signaturePath");
        }
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        myActivity = (SurveyFlowActivity) activity;
    }

    @Override
    public void onResume() {
        super.onResume();

        final InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(getActivity().INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(getView().getWindowToken(), 0);
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_signature, container, false);

        signatureImageView = (ImageView) rootView.findViewById(R.id.signatureImageView);
        signatureLayout = (RelativeLayout) rootView.findViewById(R.id.signatureLayout);
        tapHereToSignTextView = (TextView) rootView.findViewById(R.id.tapHereToSignTextView);

        signatureLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(myActivity, SignatureActivity.class);
                intent.putExtra("folderHash", myActivity.getFolderHash());
                startActivityForResult(intent, RESULT_SIGNATURE_SAVED);
            }
        });

        if (signatureImageBytes != null)
            loadImage();

        return rootView;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (resultCode == RESULT_SIGNATURE_SAVED) {
            signatureImageBytes = data.getByteArrayExtra("bitmap");
            signaturePath = data.getStringExtra("signaturePath");
            loadImage();
        }

    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        if (signatureImageBytes != null)
            outState.putByteArray("signatureImageBytes", signatureImageBytes);
        if (signaturePath != null)
            outState.putString("signaturePath", signaturePath);
    }

    /**
     * Loads the signature image from the byte array that is in memory
     */
    public void loadImage() {
        Bitmap signature = BitmapFactory.decodeByteArray(signatureImageBytes, 0, signatureImageBytes.length);

        signatureImageView.setImageBitmap(signature);
        tapHereToSignTextView.setVisibility(View.GONE);
        myActivity.setIsSignatureCaptured(true);
    }

    public void submitSignature() {

        //TODO: Use a DialogFragment instead of a ProgressDialog.  This is needed because the app
        // will crash if you show a ProgressDialog from a listener

        // Start the survey submission dialog
//        ProgressDialog progressDialog = new ProgressDialog(myActivity);
//        progressDialog.setTitle("Please Wait");
//        progressDialog.setMessage("Submitting signature...");
//        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
//        progressDialog.setIndeterminate(true);
//        progressDialog.setCancelable(false);
//
//        myActivity.setProgressDialog(progressDialog);
//        myActivity.getProgressDialog().show();

        //PostResponses.PostSurveyResponsesTask task = new PostResponses.PostSurveyResponsesTask(myActivity, myActivity, surveyResponse);
        //task.execute("https://staging.ctagroup.org/Survey/api");
    }
}
