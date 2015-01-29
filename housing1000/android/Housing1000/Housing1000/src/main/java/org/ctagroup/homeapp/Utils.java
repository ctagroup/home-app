package org.ctagroup.homeapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.res.Configuration;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.view.Gravity;
import android.view.Surface;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.TextView;

import java.util.List;

import org.ctagroup.homeapp.R;

import org.ctagroup.homeapp.helpers.SharedPreferencesHelper;


public class Utils {
    private static int viewIdCounter = 1;

    public static int getNewViewId(Context context) {

        return viewIdCounter++;
    }

    public static boolean isIntentAvailable(Context context, String action) {

        final PackageManager packageManager = context.getPackageManager();
        final Intent intent = new Intent(action);
        List<ResolveInfo> list =
                packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
        return list.size() > 0;
    }

    public static void lockScreenOrientation(Activity activity) {

        WindowManager windowManager = (WindowManager) activity.getSystemService(Context.WINDOW_SERVICE);
        Configuration configuration = activity.getResources().getConfiguration();
        int rotation = windowManager.getDefaultDisplay().getRotation();

        // Search for the natural position of the device
        if (configuration.orientation == Configuration.ORIENTATION_LANDSCAPE &&
                (rotation == Surface.ROTATION_0 || rotation == Surface.ROTATION_180) ||
                configuration.orientation == Configuration.ORIENTATION_PORTRAIT &&
                        (rotation == Surface.ROTATION_90 || rotation == Surface.ROTATION_270)) {
            // Natural position is Landscape
            switch (rotation) {
                case Surface.ROTATION_0:
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                    break;
                case Surface.ROTATION_90:
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT);
                    break;
                case Surface.ROTATION_180:
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE);
                    break;
                case Surface.ROTATION_270:
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    break;
            }
        } else {
            // Natural position is Portrait
            switch (rotation) {
                case Surface.ROTATION_0:
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    break;
                case Surface.ROTATION_90:
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                    break;
                case Surface.ROTATION_180:
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT);
                    break;
                case Surface.ROTATION_270:
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE);
                    break;
            }
        }
    }

    public static void setActionBarColorToDefault(ActionBarActivity activity) {

        ActionBar actionBar = activity.getSupportActionBar();
        ColorDrawable color = new ColorDrawable(activity.getResources().getColor(R.color.action_bar));
        Drawable bottom = activity.getResources().getDrawable(R.drawable.actionbar_bottom);
        LayerDrawable ld = new LayerDrawable(new Drawable[] { color, bottom });
        actionBar.setBackgroundDrawable(ld);
    }

    public static boolean isOnline(Context context) {

        ConnectivityManager cm =
                (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        if (netInfo != null && netInfo.isConnectedOrConnecting()) {
            return true;
        }
        return false;
    }

    public static void showNoInternetDialog(final Activity activity, boolean finishActivityAfterDismiss) {

        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle(activity.getString(R.string.no_connection));
        builder.setMessage(activity.getString(R.string.error_internet_connection));
        if (finishActivityAfterDismiss) {
            builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
                @Override
                public void onCancel(DialogInterface dialog) {
                    activity.finish();
                }
            });
        }
        centerDialogMessageAndShow(builder);
    }

    public static void centerDialogMessageAndShow(AlertDialog.Builder builder) {

        Dialog dialog = builder.show();
        TextView textView = (TextView)dialog.findViewById(android.R.id.message);
        textView.setGravity(Gravity.CENTER);
        dialog.show();
    }

    public static void hideSoftKeyboard(Activity activity) {

        InputMethodManager imm = (InputMethodManager) activity.getSystemService(
                Context.INPUT_METHOD_SERVICE);
        View v = activity.getCurrentFocus();

        if(v == null)
            return;

        imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
    }

    public static void notifyIfSavedSurveysWereSubmitted(final Context context) {

        Long numberOffline = SharedPreferencesHelper.getNumberOfflineSurveysSubmitted(context);

        if(numberOffline > 0) {
            AlertDialog.Builder builder = new AlertDialog.Builder(context)
                    .setTitle(context.getString(R.string.success))
                    .setMessage(context.getString(R.string.message_when_saved_surveys_submitted) + " " + numberOffline)
                    .setOnCancelListener(new DialogInterface.OnCancelListener() {
                        @Override
                        public void onCancel(DialogInterface dialog) {
                            SharedPreferencesHelper.resetNumberOfflineSurveysSubmitted(context);
                        }
                    })
                    .setPositiveButton(context.getString(R.string.okay), new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            SharedPreferencesHelper.resetNumberOfflineSurveysSubmitted(context);
                        }
                    });

            Utils.centerDialogMessageAndShow(builder);
        }
    }

}
