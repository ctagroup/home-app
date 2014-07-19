package edu.weber.housing1000.activities;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
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

import edu.weber.housing1000.authentication.AuthenticationService;
import edu.weber.housing1000.authentication.TokenResponse;
import edu.weber.housing1000.fragments.ProgressDialogFragment;
import edu.weber.housing1000.helpers.ErrorHelper;
import edu.weber.housing1000.R;
import edu.weber.housing1000.Utils;
import edu.weber.housing1000.helpers.RESTHelper;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class LoginActivity extends ActionBarActivity
{
    private EditText usernameField;
    private EditText passwordField;
    private ProgressDialogFragment progressDialogFragment;

    /**
     * Called when the activity is first created.
     * @param savedInstanceState If the activity is being re-initialized after
     * previously being shut down then this Bundle contains the data it most
     * recently supplied in onSaveInstanceState(Bundle). <b>Note: Otherwise it is null.</b>
     */
    @Override
    public void onCreate(Bundle savedInstanceState) 
    {
        super.onCreate(savedInstanceState);
        try {
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

            //this code is to the focus is on the username field on application start up
            usernameField.requestFocus();

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

    public void loginValidation()
    {
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
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    /**
     * Does a post with the username and password and parses the response to get the authentication token.
     * @param username
     * @param password
     */
    private void getLoginToken(String username, String password) {
        // Start the loading dialog
        showProgressDialog(getString(R.string.please_wait), "Logging in...", "");

        RestAdapter restAdapter = RESTHelper.setUpRestAdapterWithoutAuthorizationToken(this, null);

        AuthenticationService service = restAdapter.create(AuthenticationService.class);

        final String grantType = "password";

        service.getToken(grantType, username, password, new Callback<TokenResponse>() {
            @Override
            public void success(TokenResponse tokenResponse, Response response) {
                Log.d("HOUSING 1000", "Callback was successful");

                //Set the static field for the token so that other activities can access it
                TokenResponse.setACCESS_TOKEN(tokenResponse.getAccessToken());

                onGetTokenTaskCompleted(isValidToken(tokenResponse));
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d("HOUSING 1000", "Callback failed: " + error.toString());
                error.printStackTrace();
                onGetTokenTaskCompleted(false);
            }
        });
    }

    /**
     * Either move on or display an error message, depending on if a token was received
     * @param successful
     */
    private void onGetTokenTaskCompleted(final boolean successful) {
        dismissDialog();
        usernameField.setText("");
        passwordField.setText("");

        if(successful) {
            Log.d("HOUSING 1000", "Successfully retrieved token.");

            Intent intent = new Intent(LoginActivity.this, SelectPageActivity.class);
            startActivityForResult(intent, 1);
        }
        else {
            Log.w("HOUSING 1000", "There was a problem retrieving the token.");

            ErrorHelper.showError(this, "Incorrect username or password");
        }
    }

    /**
     * Validates that a token was received, we are inside the issue date and expired date range, and that the token type is 'bearer'
     * @param tokenResponse
     * @return whether it is valid or not
     */
    private boolean isValidToken(TokenResponse tokenResponse) {
        Log.d("HOUSING 1000", "Token response: " + tokenResponse.toString());

        boolean successful = true;

        Date rightNow = new Date();
        Date dateIssuedAsDate = null;
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
            Log.w("HOUSING 1000", "Authentication failed because there was a problem parsing the token expire/issued dates.");
            successful = true;
        }

        if(tokenResponse.getAccessToken() != null && "".equals(tokenResponse.getAccessToken())) {
            successful = false;
            Log.w("HOUSING 1000", "Authentication failed because no token was received.");
        }
        if(!"bearer".equalsIgnoreCase(tokenResponse.getTokenType())) {
            successful = false;
            Log.w("HOUSING 1000", "Authentication failed because the token is not of a 'bearer' type.");
        }
        if(dateIssuedAsDate.compareTo(rightNow) > 0) {
            successful = false;
            Log.w("HOUSING 1000", "Authentication failed because the token has an issue date that is later than today.");
        }
        if(dateExpiresAsDate.compareTo(rightNow) < 0) {
            successful = false;
            Log.w("HOUSING 1000", "Authentication failed because the token has an expires date that has already happened.");
        }

        return successful;
    }

    /**
     * Show a progress dialog for logging in.
     * @param title
     * @param message
     * @param tag
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

