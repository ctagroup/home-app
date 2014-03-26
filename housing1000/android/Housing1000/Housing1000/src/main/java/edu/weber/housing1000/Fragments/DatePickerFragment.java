package edu.weber.housing1000.Fragments;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.text.InputFilter;
import android.text.Spanned;
import android.view.View;
import android.widget.DatePicker;
import android.widget.EditText;

import java.util.Calendar;

import edu.weber.housing1000.Utils;

/**
 * Created by Blake on 3/23/2014.
 */
public class DatePickerFragment extends DialogFragment
        implements DatePickerDialog.OnDateSetListener {

    EditText editText;
    InputFilter[] allowAll;
    InputFilter[] disableAll;

    public DatePickerFragment() {
        super();

    }

    public DatePickerFragment(View v) {
        super();

        editText = (EditText) v;

        allowAll = new InputFilter[]
                {
                        new InputFilter() {
                            public CharSequence filter(CharSequence src, int start,
                                                       int end, Spanned dst, int dstart, int dend) {
                                return src;
                            }
                        }
                };

        disableAll = new InputFilter[]
                {
                        new InputFilter() {
                            public CharSequence filter(CharSequence src, int start,
                                                       int end, Spanned dst, int dstart, int dend) {
                                return src.length() < 1 ? dst.subSequence(dstart, dend) : "";
                            }
                        }
                };
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        // Use the current date as the default date in the picker
        final Calendar c = Calendar.getInstance();
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);

        // Disable screen orientation changes
        Utils.lockScreenOrientation(getActivity());

        // Create a new instance of DatePickerDialog and return it
        return new DatePickerDialog(getActivity(), this, year, month, day);
    }

    public void onDateSet(DatePicker view, int year, int month, int day) {
        // Enable text changes in the EditText
        editText.setFilters(allowAll);
        month = month + 1;
        editText.setText((month <= 9 ? "0" : "") + String.valueOf(month) + "/" + (day <= 9 ? "0" : "") + String.valueOf(day) + "/" + String.valueOf(year));

        // Disable text changes in the EditText
        editText.setFilters(disableAll);
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        super.onDismiss(dialog);

        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
    }
}
