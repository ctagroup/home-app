package org.ctagroup.homeapp.activities;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import org.ctagroup.homeapp.R;
import org.ctagroup.homeapp.Utils;
import org.ctagroup.homeapp.helpers.Logger;
import org.ctagroup.homeapp.helpers.SharedPreferencesHelper;

public class SelectPageActivity extends ActionBarActivity {
    private final Context context = this;

    @Override
    public void onStart() {
        super.onStart();
        Utils.notifyIfSavedSurveysWereSubmitted(this);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.select_page);
        Utils.setActionBarColorToDefault(this);

        String userFullName = SharedPreferencesHelper.getUserFullName(this);
        String welcomeText = userFullName != null && !"".equals(userFullName) ? "Hi, " + userFullName : "";
        TextView textViewWelcomeMessage = (TextView) findViewById(R.id.textViewWelcomeMessage);
        textViewWelcomeMessage.setText(welcomeText);

        //Check if GPS is enabled
        LocationManager locationmanager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);

        if(!locationmanager.isProviderEnabled(LocationManager.GPS_PROVIDER))
        {
            AlertDialog.Builder alertDialog = new AlertDialog.Builder(context);

            alertDialog.setTitle("GPS Disabled");
            alertDialog.setMessage("GPS is not enabled. Do you want to go to the settings menu?");

            alertDialog.setPositiveButton("Settings",
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                            context.startActivity(intent);
                            dialog.dismiss();
                        }
                    });

            alertDialog.setNegativeButton("Cancel",
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.cancel();
                        }
                    });

            alertDialog.show();
            Logger.d("GPS Disabled: ", "Please Enable GPS");
        }

    }

    public void startPitActivity(View v) {
        Intent intent = new Intent(SelectPageActivity.this, PitActivity.class);
        startActivity(intent);
    }

    public void startSurveyListActivity(View v) {
        Intent intent = new Intent(SelectPageActivity.this, SurveyListActivity.class);
        startActivity(intent);
    }

    public void startEncampmentActivity(View v) {
        Intent intent = new Intent(SelectPageActivity.this, EncampmentActivity.class);
        startActivity(intent);

    }
    public void startChatActivity(View v) {
        Intent intent = new Intent(SelectPageActivity.this, ChatActivity.class);
        startActivity(intent);
    }

    @Override
    public void onBackPressed() {
        logoutPrompt();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_select_page, menu);

        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId())
        {
            case R.id.action_logout:
                logoutPrompt();
                return true;
            default:
                break;
        }

        return super.onOptionsItemSelected(item);
    }

    private void logoutPrompt() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage(getString(R.string.logout_message));
        builder.setPositiveButton(getString(R.string.yes), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                //Clear the token and user info. This is how we know the user chose to logout and should be prompted to log back in before using the app
                SharedPreferencesHelper.setAccessToken(context, "");
                SharedPreferencesHelper.clearDataFromUserInfo(context);

                Intent intent = new Intent(context, LoginActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
                finish();
            }
        });
        builder.setNegativeButton(getString(R.string.no), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        Utils.centerDialogMessageAndShow(builder);
    }

}

