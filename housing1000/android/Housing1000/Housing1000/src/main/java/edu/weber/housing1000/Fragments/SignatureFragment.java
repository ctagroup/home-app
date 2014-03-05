package edu.weber.housing1000.Fragments;

import android.app.Activity;
import android.app.AlertDialog;
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
import java.io.IOException;
import java.io.OutputStream;

import edu.weber.housing1000.Helpers.EncryptionHelper;
import edu.weber.housing1000.Helpers.FileHelper;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import edu.weber.housing1000.Helpers.REST.SurveyService;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SignatureActivity;
import edu.weber.housing1000.SurveyFlowActivity;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.MultipartTypedOutput;
import retrofit.mime.TypedFile;
import retrofit.mime.TypedOutput;

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

    ProgressDialogFragment progressDialogFragment;

    // Needs a default constructor to be recreated
    public SignatureFragment() { }

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
        Log.d("Signature path:", signaturePath);
        File signatureFile = new File(signaturePath);

        if (signatureFile.exists())
        {
            myActivity.showProgressDialog("Please Wait", "Submitting signature...", "SignatureSubmit");

            final byte[] signatureBytes = EncryptionHelper.decryptImage(signatureFile);

            FileHelper.writeFileToExternalStorage(signatureBytes, myActivity.getFolderHash(), myActivity.getClientSurveyId() + "_signature.png" );
            File decryptedSignature = new File(FileHelper.getAbsoluteFilePath(myActivity.getFolderHash(),myActivity.getClientSurveyId() + "_signature.png"));
            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(getActivity(), null);

            TypedOutput typedOutput = new TypedOutput() {
                @Override
                public String fileName() {
                    return myActivity.getClientSurveyId() + "_signature.png";
                }

                @Override
                public String mimeType() {
                    return "image/png";
                }

                @Override
                public long length() {
                    return signatureBytes.length;
                }

                @Override
                public void writeTo(OutputStream out) throws IOException {
                    out.write(signatureBytes);
                }
            };

            SurveyService service = restAdapter.create(SurveyService.class);
            File file = new File(signatureFile, "MySignatureFile");
            TypedFile typedFile = new TypedFile("image/png",decryptedSignature);

            //MultipartTypedOutput multipartTypedOutput = new MultipartTypedOutput();
            //multipartTypedOutput.addPart("MySignature", typedOutput);
            //multipartTypedOutput.addPart(myActivity.getClientSurveyId() + "_signature.jpg\r\n", typedOutput);

            //TypedByteArray typedByteArray = new TypedByteArray("image/jpeg", signatureBytes);
            service.postImage(typedFile, new Callback<String>() {
                @Override
                public void success(String s, Response response) {
                    if (s != null)
                    {
                        Log.d("SUCCESS", s);
                    }

                    myActivity.onPostSignatureTaskCompleted(response);
                }

                @Override
                public void failure(RetrofitError error) {
                    String errorBody = (String) error.getBodyAs(String.class);

                    if (errorBody != null)
                    {
                        Log.e("FAILURE", errorBody);
                        myActivity.onPostSignatureTaskCompleted(error.getResponse());
                    }
                    else
                    {
                        myActivity.onPostSignatureTaskCompleted(error.getResponse());
                    }
                }
            });

        }
        else
        {
            new AlertDialog.Builder(getActivity()).setTitle("No Signature").setMessage("The signature seems to be missing!\nPlease sign the survey and resubmit.").show();
        }
    }

    public void dismissSubmissionDialog()
    {
        if (progressDialogFragment != null)
            progressDialogFragment.dismiss();
    }
}
