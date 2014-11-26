package edu.weber.housing1000.fragments;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import edu.weber.housing1000.data.DisclaimerResponse;
import edu.weber.housing1000.helpers.ErrorHelper;
import edu.weber.housing1000.helpers.FileHelper;
import edu.weber.housing1000.helpers.RESTHelper;
import edu.weber.housing1000.SurveyService;
import edu.weber.housing1000.R;
import edu.weber.housing1000.activities.SignatureActivity;
import edu.weber.housing1000.activities.SurveyFlowActivity;
import edu.weber.housing1000.sqlite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Header;
import retrofit.client.Response;
import retrofit.mime.MultipartTypedOutput;
import retrofit.mime.TypedOutput;

/**
 * @author Blake
 */
public class SignatureFragment extends SurveyAppFragment {

    private static final int RESULT_SIGNATURE_SAVED = 1;
    private static final int RESULT_INITIAL_SAVED = 2;

    private final String initial1Filename = "initial1.secure";
    private final String initial2Filename = "initial2.secure";

    private SurveyFlowActivity myActivity;
    private boolean signatureSubmitted;

    private ImageView signatureImageView;
    private ImageView initial1ImageView;
    private ImageView initial2ImageView;

    private TextView tapHereToSignTextView;
    private TextView tapHereToInitial1TextView;
    private TextView tapHereToInitial2TextView;

    private ScrollView disclaimerScrollView;
    private Button finishButton;
    private EditText editTextPrintedName;

    private byte[] signatureImageBytes;
    private byte[] initialImageBytes;

    private String signaturePath;
    private String initialPath;

    private boolean signatureObtained = false;
    private boolean initialsObtained = false;
    private boolean initialedFirstSpot = false;
    private boolean printedNameObtained = false;

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
            initialImageBytes = savedInstanceState.getByteArray("initialImageBytes");
            initialPath = savedInstanceState.getString("initialPath");
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

        if(getView() != null) {
            final InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(getView().getWindowToken(), 0);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_signature, container, false);

        final String DATE_FORMAT_NOW = "MM/dd/yyyy";
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_NOW);
        TextView textViewDateSigned = (TextView) rootView.findViewById(R.id.textViewDateSignedDate);
        textViewDateSigned.setText(sdf.format(cal.getTime()));

        disclaimerScrollView = (ScrollView) rootView.findViewById(R.id.disclaimerScrollView);

        editTextPrintedName = (EditText) rootView.findViewById(R.id.editTextPrintedName);
        editTextPrintedName.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i2, int i3) {}

            @Override
            public void onTextChanged(CharSequence s, int i, int i2, int i3) {
                if(!TextUtils.isEmpty(s)) {
                    printedNameObtained = true;

                    if(signatureObtained && initialsObtained) {
                        finishButton.setVisibility(View.VISIBLE);
                    }
                }
                else {
                    printedNameObtained = false;
                    finishButton.setVisibility(View.GONE);
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {}
        });

        finishButton = (Button) rootView.findViewById(R.id.btn_finish_disclaimer);
        finishButton.setVisibility(View.GONE);
        finishButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finishButton.setVisibility(View.GONE);
                editTextPrintedName.setEnabled(false);
                myActivity.setIsDisclaimerFinished(true);
            }
        });

        RelativeLayout signatureLayout = (RelativeLayout) rootView.findViewById(R.id.signatureLayout);
        signatureImageView = (ImageView) rootView.findViewById(R.id.signatureImageView);

        RelativeLayout initial1Layout = (RelativeLayout) rootView.findViewById(R.id.initial1Layout);
        initial1ImageView = (ImageView) rootView.findViewById(R.id.initial1ImageView);

        RelativeLayout initial2Layout = (RelativeLayout) rootView.findViewById(R.id.initial2Layout);
        initial2ImageView = (ImageView) rootView.findViewById(R.id.initial2ImageView);

        tapHereToSignTextView = (TextView) rootView.findViewById(R.id.tapHereToSignTextView);
        tapHereToInitial1TextView = (TextView) rootView.findViewById(R.id.tapHereToInitial1TextView);
        tapHereToInitial2TextView = (TextView) rootView.findViewById(R.id.tapHereToInitial2TextView);

        signatureLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(myActivity, SignatureActivity.class);
                intent.putExtra("folderHash", myActivity.getFolderHash());
                intent.putExtra("imageBitmapExtra", "signatureBitmap");
                intent.putExtra("imagePathExtra", "signaturePath");
                intent.putExtra("imageFilename", "signature.secure");
                intent.putExtra("resultCode", RESULT_SIGNATURE_SAVED);
                startActivityForResult(intent, RESULT_SIGNATURE_SAVED);
            }
        });

        initial1Layout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!initialsObtained || initialedFirstSpot) {
                    initialedFirstSpot = true;
                    Intent intent = new Intent(myActivity, SignatureActivity.class);
                    intent.putExtra("folderHash", myActivity.getFolderHash());
                    intent.putExtra("imageBitmapExtra", "initialBitmap");
                    intent.putExtra("imagePathExtra", "initialPath");
                    intent.putExtra("imageFilename", initial1Filename);
                    intent.putExtra("resultCode", RESULT_INITIAL_SAVED);
                    startActivityForResult(intent, RESULT_INITIAL_SAVED);
                }
                else {
                    initialedFirstSpot = true;
                    changeInitialsFilename();
                    loadInitialsImage();
                }
            }
        });

        initial2Layout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!initialsObtained || !initialedFirstSpot) {
                    initialedFirstSpot = false;
                    Intent intent = new Intent(myActivity, SignatureActivity.class);
                    intent.putExtra("folderHash", myActivity.getFolderHash());
                    intent.putExtra("imageBitmapExtra", "initialBitmap");
                    intent.putExtra("imagePathExtra", "initialPath");
                    intent.putExtra("imageFilename", initial2Filename);
                    intent.putExtra("resultCode", RESULT_INITIAL_SAVED);
                    startActivityForResult(intent, RESULT_INITIAL_SAVED);
                }
                else {
                    initialedFirstSpot = false;
                    changeInitialsFilename();
                    loadInitialsImage();
                }
            }
        });

        if(signatureImageBytes != null) {
            signatureObtained = true;
            loadSignatureImage();
        }

        if(initialImageBytes != null) {
            initialsObtained = true;
            loadInitialsImage();
        }

        if(!TextUtils.isEmpty(editTextPrintedName.getText())) {
            printedNameObtained = true;
        }

        scrollToBottomAndShowFinishButtonIfFinished();

        return rootView;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (resultCode == RESULT_SIGNATURE_SAVED) {
            signatureImageBytes = data.getByteArrayExtra("signatureBitmap");
            signaturePath = data.getStringExtra("signaturePath");
            signatureObtained = true;
            loadSignatureImage();
        }
        else if(resultCode == RESULT_INITIAL_SAVED) {
            initialImageBytes = data.getByteArrayExtra("initialBitmap");
            initialPath = data.getStringExtra("initialPath");
            initialsObtained = true;
            tapHereToInitial1TextView.setText(getActivity().getString(R.string.tap_here_to_initial_instead));
            tapHereToInitial2TextView.setText(getActivity().getString(R.string.tap_here_to_initial_instead));
            loadInitialsImage();
        }

        if(signatureImageBytes != null) {
            signatureObtained = true;
        }

        if(initialImageBytes != null) {
            initialsObtained = true;
        }

        if(!TextUtils.isEmpty(editTextPrintedName.getText())) {
            printedNameObtained = true;
        }

        scrollToBottomAndShowFinishButtonIfFinished();

    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        if (signatureImageBytes != null)
            outState.putByteArray("signatureImageBytes", signatureImageBytes);
        if (signaturePath != null)
            outState.putString("signaturePath", signaturePath);
        if (initialImageBytes != null)
            outState.putByteArray("initialImageBytes", initialImageBytes);
        if (initialPath != null)
            outState.putString("initialPath", initialPath);

        outState.putBoolean("signatureSubmitted", signatureSubmitted);
    }

    /**
     * Loads the signature image from the byte array that is in memory
     */
    private void loadSignatureImage() {
        try {
            Bitmap signature = BitmapFactory.decodeByteArray(signatureImageBytes, 0, signatureImageBytes.length);

            signatureImageView.setImageBitmap(signature);
            tapHereToSignTextView.setVisibility(View.GONE);
        } catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

    /**
     * Loads the initial image from the byte array that is in memory
     */
    private void loadInitialsImage() {
        try {
            Bitmap initials = BitmapFactory.decodeByteArray(initialImageBytes, 0, initialImageBytes.length);

            if(initialedFirstSpot) {
                initial1ImageView.setImageBitmap(initials);
                tapHereToInitial1TextView.setVisibility(View.GONE);
                initial2ImageView.setImageBitmap(null);
                tapHereToInitial2TextView.setVisibility(View.VISIBLE);
            }
            else {
                initial2ImageView.setImageBitmap(initials);
                tapHereToInitial2TextView.setVisibility(View.GONE);
                initial1ImageView.setImageBitmap(null);
                tapHereToInitial1TextView.setVisibility(View.VISIBLE);
            }
        } catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

    /**
     * This is for keeping track of which initial spot they have chosen. When they switch, we update the filename to reflect that.
     * The filename is what gets passed to the backend, which is what renders the PDF, to tell it which spot they initialed.
     */
    private void changeInitialsFilename() {

        String filename;
        if(initialedFirstSpot) {
            filename = initial1Filename;
        }
        else {
            filename = initial2Filename;
        }

        File oldInitials = new File(initialPath);
        File newInitials = new File(FileHelper.getAbsoluteFilePath(myActivity.getFolderHash(), filename, myActivity));
        boolean successful = oldInitials.renameTo(newInitials);

        if(!successful) {
            ErrorHelper.showError(myActivity, getString(R.string.msg_error_changing_initials));
        }
        else {
            initialPath = FileHelper.getAbsoluteFilePath(myActivity.getFolderHash(), filename, myActivity);
        }

        //TODO update it in the database also?
    }

    public void submitDisclaimerInfo() {

        final String printedName = editTextPrintedName.getText().toString();

        DisclaimerResponse disclaimerResponse = new DisclaimerResponse(Long.valueOf(myActivity.getClientSurveyId()), 1, printedName, new Date());

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

        RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(getActivity(), gson);

        SurveyService service = restAdapter.create(SurveyService.class);

        service.postDisclaimerData(disclaimerResponse, new Callback<String>() {
            @Override
            public void success(String s, retrofit.client.Response response) {
                if (s != null) {
                    Log.d("SUCCESS", s);
                }

                submitSignatureImages();
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
    }

    private void submitSignatureImages() {
        if (!signatureSubmitted) {
            MultipartTypedOutput multipartTypedOutput = new MultipartTypedOutput();

            Log.d("Signature path:", signaturePath);
            File signatureFile = new File(signaturePath);

            Log.d("Initial path:", initialPath);
            File initialFile = new File(initialPath);

            myActivity.showProgressDialog(getActivity().getString(R.string.please_wait), getActivity().getString(R.string.submitting_signature), "Dialog");

            if (!signatureFile.exists()) {
                new AlertDialog.Builder(getActivity()).setTitle(getActivity().getString(R.string.no_signature)).setMessage(getActivity().getString(R.string.error_missing_signature)).show();
            }
            else if(!initialFile.exists()) {
                new AlertDialog.Builder(getActivity()).setTitle(getActivity().getString(R.string.no_initials)).setMessage(getActivity().getString(R.string.error_missing_initials)).show();
            }
            else {

                ArrayList<String> files = new ArrayList<>();

                files.add(signaturePath);
                files.add(initialPath);

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

            }
        }
        else
        {
            myActivity.onPostSignatureTaskCompleted(new Response("", 200, "", new ArrayList<Header>(), null));
        }
    }


    public void scrollToBottomAndShowFinishButtonIfFinished() {

        if(initialsObtained && signatureObtained && printedNameObtained && !myActivity.getIsDisclaimerFinished()) {
            finishButton.setVisibility(View.VISIBLE);

            disclaimerScrollView.post(new Runnable() {
                @Override
                public void run() {
                    disclaimerScrollView.fullScroll(View.FOCUS_DOWN);
                }
            });
        }
    }

    /**
     * In the case of no internet connection on submission, save the signature path to submit later
     * @param surveyDataId The id of the survey to go along with this signature
     */
    public void saveSignatureAndInitialPathsToDatabase(long surveyDataId) {
        DatabaseConnector databaseConnector = new DatabaseConnector(myActivity.getBaseContext());
        databaseConnector.saveSubmittedImagePaths(true, myActivity.getFolderHash(), surveyDataId, signaturePath);
        databaseConnector.saveSubmittedImagePaths(true, myActivity.getFolderHash(), surveyDataId, initialPath); //TODO how to tell the database that this is an initial image?
    }

}
