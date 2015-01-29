package org.ctagroup.homeapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;

import org.ctagroup.homeapp.helpers.SharedPreferencesHelper;

/**
 * This is the main activity for the app. It simply forwards on to the SelectPageActivity if
 * the user has been logged in or to the LoginActivity if they haven't.
 *
 * @author David Horton
 */
public class MainLauncherActivity extends ActionBarActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        final String username = SharedPreferencesHelper.getAccessToken(this);

        //If the token is null or empty string then we assume that they aren't logged in
        final boolean needsToLogin = (username == null || "".equals(username));

        Intent intent;
        if(needsToLogin) {
            intent = new Intent(this, LoginActivity.class);
        }
        else {
            intent = new Intent(this, SelectPageActivity.class);
        }

        startActivity(intent);
        finish();
    }

}
