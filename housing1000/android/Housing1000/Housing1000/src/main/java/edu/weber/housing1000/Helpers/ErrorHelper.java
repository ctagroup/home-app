package edu.weber.housing1000.Helpers;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;

import edu.weber.housing1000.R;
import edu.weber.housing1000.Utils;

/**
 * Created by PLW on 4/5/2014.
 */
public class ErrorHelper {
    public static void showError(Context context, String sError)
    {
        final AlertDialog.Builder errorDialog = new AlertDialog.Builder(context);

        errorDialog.setMessage(sError);
        errorDialog.setTitle((R.string.uh_oh));
        errorDialog.setPositiveButton(R.string.okay, null);
        errorDialog.setCancelable(true);
        Utils.centerDialogMessageAndShow(errorDialog);

        errorDialog.setPositiveButton(R.string.okay, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
    }
}
