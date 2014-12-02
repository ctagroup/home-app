package edu.weber.housing1000.helpers;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import edu.weber.housing1000.data.UserInfo;

/**
 * An utility class for retrieving and storing shared preferences
 *
 * @author David Horton
 */
public class SharedPreferencesHelper {

    private static final String PREF_TOKEN = "CTA_ACCESS_TOKEN";
    private static final String PREF_OFFLINE_SURVEYS_COUNT = "CTA_OFFLINE_SURVEYS";
    private static final String PREF_USER_ID = "CTA_USER_ID";
    private static final String PREF_USER_FULL_NAME = "CTA_USER_FULL_NAME";
    private static final String PREF_USER_ORGANIZATION = "CTA_USER_ORGANIZATION";

    private static SharedPreferences getSharedPreferences(Context ctx) {
        return PreferenceManager.getDefaultSharedPreferences(ctx);
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

    /**
     * For keeping track of how many surveys were submitted in an offline state
     * @param ctx The current context
     * @return The number of surveys that were last submitted in an offline state
     */
    public static Long getNumberOfflineSurveysSubmitted(Context ctx) {
        return getSharedPreferences(ctx).getLong(PREF_OFFLINE_SURVEYS_COUNT, 0);
    }

    /**
     * Increment the number of surveys that have been currently submitted while offline
     * @param ctx The current context
     */
    public static void incrementNumberOfflineSurveysSubmitted(Context ctx) {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.putLong(PREF_OFFLINE_SURVEYS_COUNT, getNumberOfflineSurveysSubmitted(ctx) + 1);
        editor.apply();
    }

    /**
     * Set the number of surveys submitted back to zero (typically once a message has been displayed to the user)
     * @param ctx The current context
     */
    public static void resetNumberOfflineSurveysSubmitted(Context ctx) {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.putLong(PREF_OFFLINE_SURVEYS_COUNT, 0);
        editor.apply();
    }

    /**
     * Store data
     * @param ctx The current context
     * @param userInfo The user info returned from the API
     */
    public static void setDataFromUserInfo(Context ctx, UserInfo userInfo) {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.putLong(PREF_USER_ID, userInfo.getId());
        editor.putString(PREF_USER_FULL_NAME, userInfo.getName());
        editor.putString(PREF_USER_ORGANIZATION, userInfo.getOrganization());
        editor.apply();
    }

    /**
     * Clear all data collected from the user info
     * @param ctx The current context
     */
    public static void clearDataFromUserInfo(Context ctx) {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.remove(PREF_USER_ID);
        editor.remove(PREF_USER_FULL_NAME);
        editor.remove(PREF_USER_ORGANIZATION);
        editor.apply();
    }

    /**
     * Get the ID of the currently logged in user
     * @param ctx The current context
     * @return The user's ID
     */
    public static Long getUserId(Context ctx) {
        return getSharedPreferences(ctx).getLong(PREF_USER_ID, 0);
    }

    /**
     * Get the currently logged in user's full name
     * @param ctx The current context
     * @return The user's full name
     */
    public static String getUserFullName(Context ctx) {
        return getSharedPreferences(ctx).getString(PREF_USER_FULL_NAME, "");
    }

    /**
     * Get the organization that the user is registered with
     * @param ctx The current context
     * @return The user's organization
     */
    public static String getUserOrganization(Context ctx) {
        return getSharedPreferences(ctx).getString(PREF_USER_ORGANIZATION, "");
    }

}
