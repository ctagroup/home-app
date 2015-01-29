package org.ctagroup.homeapp.activities;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.KeyEvent;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.view.View;
import android.widget.TextView;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.ctagroup.homeapp.ConnectivityChangeReceiver;
import org.ctagroup.homeapp.SurveyService;
import org.ctagroup.homeapp.data.TokenResponse;
import org.ctagroup.homeapp.data.UserInfo;
import org.ctagroup.homeapp.fragments.ProgressDialogFragment;
import org.ctagroup.homeapp.helpers.ErrorHelper;
import org.ctagroup.homeapp.R;
import org.ctagroup.homeapp.Utils;
import org.ctagroup.homeapp.helpers.Logger;
import org.ctagroup.homeapp.helpers.RESTHelper;
import org.ctagroup.homeapp.helpers.SharedPreferencesHelper;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class LoginActivity extends ActionBarActivity
{
    private EditText usernameField;
    private EditText passwordField;
    private ProgressDialogFragment progressDialogFragment;

    @Override
    public void onStart() {
        super.onStart();
        Utils.notifyIfSavedSurveysWereSubmitted(this);
    }

    /**
     * Called when the activity is first created.
     * @param savedInstanceState If the activity is being re-initialized after
     * previously being shut down then this Bundle contains the data it most
     * recently supplied in onSaveInstanceState(Bundle). <b>Note: Otherwise it is null.</b>
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {

            /* This is probably overkill, but just in case the app has saved surveys and connectivity was changed while the
             * app was dead, rather than wait for another change in connectivity, we just always check to see if there are
             * saved surveys to submit on startup of the login screen.*/
            if(Utils.isOnline(this)) {
                ConnectivityChangeReceiver.submitSavedSurveys(this);
            }

            setContentView(R.layout.main);
            Utils.setActionBarColorToDefault(this);

            //declare the login button
            Button loginButton = (Button) findViewById(R.id.loginButton);
            usernameField = (EditText) findViewById(R.id.usernameTextBox);
            passwordField = (EditText) findViewById(R.id.passwordLoginTextBox);

            passwordField.setOnEditorActionListener(new TextView.OnEditorActionListener() {
                @Override
                public boolean onEditorAction(TextView textView, int i, KeyEvent keyEvent) {
                    if (i == EditorInfo.IME_ACTION_GO) {
                        loginValidation();
                    }

                    return true;
                }
            });

            passwordField.setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View view, int i, KeyEvent keyEvent) {
                    if (i == KeyEvent.KEYCODE_ENTER && keyEvent.getAction() == KeyEvent.ACTION_DOWN)
                        loginValidation();
                    return false;
                }
            });

            //on click action to the login button
            loginButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    loginValidation();
                }
            });

            //CLEAR BUTTON CODE
            //declare the clear button
            Button clearButton = (Button) findViewById(R.id.clearButton);
            clearButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    //declare the text fields
                    EditText usernameField = (EditText) findViewById(R.id.usernameTextBox);
                    EditText passwordField = (EditText) findViewById(R.id.passwordLoginTextBox);

                    usernameField.setText("");
                    passwordField.setText("");

                    usernameField.setBackgroundColor(Color.WHITE);
                    passwordField.setBackgroundColor(Color.WHITE);

                    usernameField.requestFocus();
                }
            });
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this,ex.getMessage());
        }

    }//close public void

    public void loginValidation() {

        if(Utils.isOnline(this)) {
            try {
                //this code will grab the fields from username and password
                String username, password;

                //declare the text boxes


                //get the text from the boxes
                username = usernameField.getText().toString();
                password = passwordField.getText().toString();
                boolean proceed = true;

                //the following will color the background on failed login and will set the proceed flag
                if (username.equals("")) {
                    usernameField.requestFocus();
                    usernameField.setBackgroundColor(Color.rgb(255, 102, 51));
                    proceed = false;
                } else {
                    usernameField.setBackgroundColor(Color.WHITE);
                }

                if (password.equals("")) {
                    passwordField.setBackgroundColor(Color.rgb(255, 102, 51));
                    proceed = false;

                    if (!username.equals("")) {
                        passwordField.requestFocus();
                    }
                } else {
                    passwordField.setBackgroundColor(Color.WHITE);
                }

                //if both fields have text in them then proceed, at this time, the username check is disabled
                if (proceed) {
                    getLoginToken(username, password);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
                ErrorHelper.showError(this, ex.getMessage());
            }
        }
        else {
            Utils.showNoInternetDialog(this, false);
        }
    }

    /**
     * Does a post with the username and password and parses the response to get the authentication token.
     * @param username The username
     * @param password The password
     */
    private void getLoginToken(final String username, final String password) {
        // Start the loading dialog
        showProgressDialog(getString(R.string.please_wait), "Logging in...", "");

        RestAdapter restAdapter = RESTHelper.setUpRestAdapterWithoutAuthorizationToken(this, null);

        SurveyService service = restAdapter.create(SurveyService.class);

        final String grantType = "password";
        service.getToken(grantType, username, password, new Callback<TokenResponse>() {
            @Override
            public void success(TokenResponse tokenResponse, Response response) {
                Logger.d("HOUSING 1000", "Callback was successful");

                onGetTokenTaskCompleted(isValidToken(tokenResponse), tokenResponse.getAccessToken());
            }

            @Override
            public void failure(RetrofitError error) {
                Logger.d("HOUSING 1000", "Callback failed: " + error.toString());
                error.printStackTrace();
                onGetTokenTaskCompleted(false, null);
            }
        });
    }

    /**
     * Either move on or display an error message, depending on if a token was received
     * @param successful Whether it was successful or not
     */
    private void onGetTokenTaskCompleted(final boolean successful, final String token) {
        usernameField.setText("");
        passwordField.setText("");

        if(successful) {
            Logger.d("HOUSING 1000", "Successfully retrieved token.");

            //Set the shared preference for the token so that other activities can access it
            SharedPreferencesHelper.setAccessToken(this, token);

            getUserInfo();
        }
        else {
            Logger.w("HOUSING 1000", "There was a problem retrieving the token.");
            dismissDialog();
            ErrorHelper.showError(this, getString(R.string.msg_error_logging_in));
        }
    }

    private void getUserInfo() {

        RestAdapter restAdapter = RESTHelper.setUpRestAdapter(this, null);

        SurveyService service = restAdapter.create(SurveyService.class);

        service.getUserInfo(new Callback<UserInfo>() {
            @Override
            public void success(UserInfo userInfo, Response response) {
                Logger.d("HOUSING 1000", "Callback was successful");

                onGetUserInfoTaskCompleted(true, userInfo);
            }

            @Override
            public void failure(RetrofitError error) {
                Logger.d("HOUSING 1000", "Callback failed: " + error.toString());
                error.printStackTrace();
                onGetUserInfoTaskCompleted(false, null);
            }
        });

    }

    private void onGetUserInfoTaskCompleted(final boolean successful, final UserInfo userInfo) {
        dismissDialog();

        if(successful) {
            Logger.d("HOUSING 1000", "Successfully retrieved user info: " + userInfo.toString());

            SharedPreferencesHelper.setDataFromUserInfo(this, userInfo);

            Intent intent = new Intent(LoginActivity.this, SelectPageActivity.class);
            startActivityForResult(intent, 1);
        }
        else {
            Logger.w("HOUSING 1000", "There was a problem retrieving user info.");

            ErrorHelper.showError(this, getString(R.string.msg_error_logging_in));
        }
    }

    /**
     * Validates that a token was received, we are inside the issue date and expired date range, and that the token type is 'bearer'
     * @param tokenResponse The token
     * @return whether it is valid or not
     */
    private boolean isValidToken(TokenResponse tokenResponse) {
        Logger.d("HOUSING 1000", "Token response: " + tokenResponse.toString());

        boolean successful = true;

        Date rightNow = new Date();
        Date dateIssuedAsDate;
        Date dateExpiresAsDate = null;
        try {
            DateFormat formatter = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz");
            dateIssuedAsDate = formatter.parse(tokenResponse.getDateIssued());
            dateExpiresAsDate = formatter.parse(tokenResponse.getDateExpires());

            tokenResponse.setDateIssuedAsDate(dateIssuedAsDate);
            tokenResponse.setDateExpiresAsDate(dateExpiresAsDate);
        }
        catch(ParseException e) {
            e.printStackTrace();
            Logger.w("HOUSING 1000", "Authentication failed because there was a problem parsing the token expire/issued dates.");
            successful = true;
        }

        if(tokenResponse.getAccessToken() != null && "".equals(tokenResponse.getAccessToken())) {
            successful = false;
            Logger.w("HOUSING 1000", "Authentication failed because no token was received.");
        }
        if(!"bearer".equalsIgnoreCase(tokenResponse.getTokenType())) {
            successful = false;
            Logger.w("HOUSING 1000", "Authentication failed because the token is not of a 'bearer' type.");
        }
        /*if(dateIssuedAsDate.compareTo(rightNow) > 0) {
            successful = false;
            Log.w("HOUSING 1000", "Authentication failed because the token has an issue date that is later than today.");
        }*/
        if(dateExpiresAsDate != null && dateExpiresAsDate.compareTo(rightNow) < 0) {
            successful = false;
            Logger.w("HOUSING 1000", "Authentication failed because the token has an expires date that has already happened.");
        }

        return successful;
    }

    /**
     * Show a progress dialog for logging in.
     * @param title The title
     * @param message The message
     * @param tag The tag
     */
    private void showProgressDialog(String title, String message, String tag) {
        progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
        progressDialogFragment.show(getSupportFragmentManager(), tag);
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

