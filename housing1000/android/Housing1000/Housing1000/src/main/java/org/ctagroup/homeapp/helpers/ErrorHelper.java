package org.ctagroup.homeapp.helpers;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;

import org.ctagroup.homeapp.R;
import org.ctagroup.homeapp.Utils;

/**
 * @author PLW
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

    public static void showAlert(Context context, String sAlert)
    {
        final AlertDialog.Builder alertDialog = new AlertDialog.Builder(context);

        alertDialog.setMessage(sAlert);
        alertDialog.setTitle((R.string.notice));
        alertDialog.setPositiveButton(R.string.okay, null);
        alertDialog.setCancelable(true);
        Utils.centerDialogMessageAndShow(alertDialog);

        alertDialog.setPositiveButton(R.string.okay, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
    }

    public static void showSuccess(Context context, String sSuccess)
    {
        final AlertDialog.Builder alertDialog = new AlertDialog.Builder(context);

        alertDialog.setMessage(sSuccess);
        alertDialog.setTitle((R.string.success));
        alertDialog.setPositiveButton(R.string.okay, null);
        alertDialog.setCancelable(true);
        Utils.centerDialogMessageAndShow(alertDialog);

        alertDialog.setPositiveButton(R.string.okay, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
    }
}
