package edu.weber.housing1000;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import de.akquinet.android.androlog.Log;

//imports added by James
import android.widget.Button;
import android.widget.EditText;
import android.view.View;


public class LoginActivity extends Activity
{

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

        // Initializes the logging
        Log.init();

        // Log a message (only on dev platform)
        Log.i(this, "onCreate");

        setContentView(R.layout.main);
        
        //declare the login button
        Button loginButton = (Button) findViewById(R.id.loginButton);

        //this code is to the focus is on the email field on application start up
        EditText emailFocus = (EditText) findViewById(R.id.usernameTextBox);
        emailFocus.requestFocus();

        //on click action to the login button
        loginButton.setOnClickListener(new View.OnClickListener() 
        {
            public void onClick(View v) 
            {
            	//this code will grab the fields from email and password
                String emailIs, passwordIs;

                //declare the text boxes
                EditText emailField = (EditText) findViewById(R.id.usernameTextBox);
                EditText passwordField = (EditText) findViewById(R.id.passwordLoginTextBox);

                //get the text from the boxes
                emailIs = emailField.getText().toString();
                passwordIs = passwordField.getText().toString();
                boolean proceed = true;

                //the following will color the background on failed login and will set the proceed flag
                if (emailIs.equals(""))
                {
                    emailField.requestFocus();
                    emailField.setBackgroundColor(Color.rgb(255,102,51));
                    proceed = false;
                }
                else
                {
                    emailField.setBackgroundColor(Color.WHITE);
                }

                if (passwordIs.equals(""))
                {
                    passwordField.setBackgroundColor(Color.rgb(255,102,51));
                    proceed = false;

                    if (!emailIs.equals(""))
                    {
                        passwordField.requestFocus();
                    }
                }
                else
                {
                    passwordField.setBackgroundColor(Color.WHITE);
                }

                //if both fields have text in them then proceed, at this time, the email check is disabled
                if (proceed)
                {
                    //go to the next activity(screen)
                    //Intent intent = new Intent(LoginActivity.this, ClientInfoActivity.class);
                    //startActivityForResult(intent, 1);

                    Intent intent = new Intent(LoginActivity.this, SelectPageActivity.class);
                    startActivityForResult(intent, 1);
                }
            }
        });

        //CLEAR BUTTON CODE
        //declare the clear button
        Button clearButton = (Button) findViewById(R.id.clearButton);
        clearButton.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                //declate the text fields
                EditText emailField = (EditText) findViewById(R.id.usernameTextBox);
                EditText passwordField = (EditText) findViewById(R.id.passwordLoginTextBox);

                emailField.setText("");
                passwordField.setText("");

                emailField.setBackgroundColor(Color.WHITE);
                passwordField.setBackgroundColor(Color.WHITE);

                emailField.requestFocus();
            }
        });


    }//close public void

}

