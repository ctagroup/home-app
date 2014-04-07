package edu.weber.housing1000.Fragments;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.io.File;
import java.util.ArrayList;

import edu.weber.housing1000.Helpers.REST.RESTHelper;
import edu.weber.housing1000.Helpers.REST.SurveyService;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SignatureActivity;
import edu.weber.housing1000.SurveyFlowActivity;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Header;
import retrofit.client.Response;
import retrofit.mime.MultipartTypedOutput;
import retrofit.mime.TypedOutput;

/**
 * Created by Blake on 2/11/14.
 */
public class SignatureFragment extends SurveyAppFragment {
    public static final int RESULT_SIGNATURE_SAVED = 1;

    private SurveyFlowActivity myActivity;
    private boolean signatureSubmitted;

    private ImageView signatureImageView;
    private TextView tapHereToSignTextView;

    private byte[] signatureImageBytes;
    private String signaturePath;

    public static SignatureFragment newInstance(Context context)
    {
        SignatureFragment fragment = new SignatureFragment();

        Bundle args = new Bundle();
        args.putString("name", context.getString(R.string.fragment_signature_name));
        args.putString("title", context.getString(R.string.fragment_signature_title));
        fragment.setArguments(args);

        fragment.updateName();

        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (savedInstanceState != null) {
            signatureImageBytes = savedInstanceState.getByteArray("signatureImageBytes");
            signaturePath = savedInstanceState.getString("signaturePath");
            signatureSubmitted = savedInstanceState.getBoolean("signatureSubmitted");
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

        final InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(getView().getWindowToken(), 0);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_signature, container, false);

        RelativeLayout signatureLayout = (RelativeLayout) rootView.findViewById(R.id.signatureLayout);
        signatureImageView = (ImageView) rootView.findViewById(R.id.signatureImageView);
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

        outState.putBoolean("signatureSubmitted", signatureSubmitted);
    }

    /**
     * Loads the signature image from the byte array that is in memory
     */
    private void loadImage() {
        try {
            Bitmap signature = BitmapFactory.decodeByteArray(signatureImageBytes, 0, signatureImageBytes.length);

            signatureImageView.setImageBitmap(signature);
            tapHereToSignTextView.setVisibility(View.GONE);
            myActivity.setIsSignatureCaptured(true);
        } catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public void submitSignature() {
        if (!signatureSubmitted) {
            MultipartTypedOutput multipartTypedOutput = new MultipartTypedOutput();

            Log.d("Signature path:", signaturePath);
            File signatureFile = new File(signaturePath);

            myActivity.showProgressDialog(getActivity().getString(R.string.please_wait), getActivity().getString(R.string.submitting_signature), "Dialog");

            if (signatureFile.exists()) {

                ArrayList<String> files = new ArrayList<>();

                files.add(signaturePath);

                for (TypedOutput image : RESTHelper.generateTypedOutputFromImages(files, myActivity.getClientSurveyId())) {
                    multipartTypedOutput.addPart(image.fileName(), image);
                }

                RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(getActivity(), null);

                SurveyService service = restAdapter.create(SurveyService.class);

                service.postImage(multipartTypedOutput, new Callback<String>() {
                    @Override
                    public void success(String s, Response response) {
                        if (s != null) {
                            Log.d("SUCCESS", s);
                        }

                        myActivity.onPostSignatureTaskCompleted(response);
                        signatureSubmitted = true;
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        String errorBody = (String) error.getBodyAs(String.class);

                        if (errorBody != null) {
                            Log.e("FAILURE", errorBody);
                            myActivity.onPostSignatureTaskCompleted(error.getResponse());
                        } else {
                            myActivity.onPostSignatureTaskCompleted(error.getResponse());
                        }
                    }
                });

            } else {
                new AlertDialog.Builder(getActivity()).setTitle(getActivity().getString(R.string.no_signature)).setMessage(getActivity().getString(R.string.error_missing_signature)).show();
            }
        }
        else
        {
            myActivity.onPostSignatureTaskCompleted(new Response("", 200, "", new ArrayList<Header>(), null));
        }
    }

}
