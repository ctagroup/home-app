package edu.weber.housing1000.helpers;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

/**
 * An utility class for retrieving and storing shared preferences
 *
 * @author David Horton
 */
public class SharedPreferencesHelper {

    private static final String PREF_USER_NAME= "CTA_USERNAME";
    private static final String PREF_TOKEN = "CTA_ACCESS_TOKEN";

    private static SharedPreferences getSharedPreferences(Context ctx) {
        return PreferenceManager.getDefaultSharedPreferences(ctx);
    }

    /**
     * @param ctx The current context
     * @param userName The username to save
     */
    public static void setUserName(Context ctx, String userName) {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.putString(PREF_USER_NAME, userName);
        editor.apply();
    }

    /**
     * @param ctx The current context
     * @return The saved username
     */
    public static String getUserName(Context ctx) {
        return getSharedPreferences(ctx).getString(PREF_USER_NAME, "");
    }

    /**
     * @param ctx The current context
     * @param token The token to save
     */
    public static void setAccessToken(Context ctx, String token) {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.putString(PREF_TOKEN, token);
        editor.apply();
    }

    /**
     * @param ctx The current context
     * @return The saved token
     */
    public static String getAccessToken(Context ctx) {
        return getSharedPreferences(ctx).getString(PREF_TOKEN, "");
    }

}
