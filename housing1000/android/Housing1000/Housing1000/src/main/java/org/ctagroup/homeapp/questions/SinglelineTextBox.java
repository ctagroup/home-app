package org.ctagroup.homeapp.questions;

import android.content.Context;
import android.graphics.Rect;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.ActionBarActivity;
import android.text.InputFilter;
import android.text.InputType;
import android.text.Spanned;
import android.view.MotionEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import org.ctagroup.homeapp.fragments.DatePickerFragment;

/**
 * @author Blake
 */
public class SinglelineTextBox extends Question {
    InputFilter[] enableInput = new InputFilter[]
            {
                    new InputFilter() {
                        public CharSequence filter(CharSequence src, int start,
                                                   int end, Spanned dst, int dstart, int dend) {
                            return src;
                        }
                    }
            };

    InputFilter[] disableInput = new InputFilter[]
            {
                    new InputFilter() {
                        public CharSequence filter(CharSequence src, int start,
                                                   int end, Spanned dst, int dstart, int dend) {
                            return src.length() < 1 ? dst.subSequence(dstart, dend) : "";
                        }
                    }
            };

    @Override
    public View createView(Context context) {
        LinearLayout qLayout = new LinearLayout(context);

        TextView textView = new TextView(context);
        textView.setText(getText());
        textView.setTextSize(getTextSize());
        qLayout.addView(textView);
        qLayout.setOrientation(LinearLayout.VERTICAL);

        final EditText editText = new EditText(context);
        LinearLayout.LayoutParams editTextParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        editText.setLayoutParams(editTextParams);

        //Add question input validation
        if(getTextBoxDataType() != null) {
            switch (getTextBoxDataType().toLowerCase()) {
                case "datetime":
                    editText.setInputType(InputType.TYPE_NULL);
                    // Disable any text input from the keyboard by setting a filter
                    editText.setFilters(new InputFilter[]
                            {
                                    new InputFilter() {
                                        public CharSequence filter(CharSequence src, int start,
                                                                   int end, Spanned dst, int dstart, int dend) {
                                            return src.length() < 1 ? dst.subSequence(dstart, dend) : "";
                                        }
                                    }
                            });

                    // Set up the click listener
                    editText.setOnTouchListener(new View.OnTouchListener() {
                        @Override
                        public boolean onTouch(View v, MotionEvent event) {
                            if (event.getAction() == MotionEvent.ACTION_UP) {
                                EditText et = (EditText) v;
                                // Get the screen coordinates of the EditText
                                final int screenCords[] = new int[2];
                                et.getLocationOnScreen(screenCords);
                                // Set up a rectangle based on the EditText
                                Rect rect = new Rect(screenCords[0], screenCords[1], screenCords[0] + et.getWidth(), screenCords[1] + et.getHeight());

                                // If the click position is within the EditText rectangle, show a date picker
                                if (rect.contains((int) event.getRawX(), (int) event.getRawY())) {
                                    createDatePicker(v);
                                    return true;
                                }
                            }
                            event.setAction(MotionEvent.ACTION_CANCEL); //prevent the keyboard from coming up
                            return false;
                        }
                    });
                    break;
                case "int":
                    editText.setInputType(InputType.TYPE_CLASS_NUMBER);
                    break;
                case "string":
                    editText.setInputType(InputType.TYPE_CLASS_TEXT);
                    break;
                default:
                    editText.setInputType(InputType.TYPE_CLASS_TEXT);
                    break;
            }
        }
        //If the text box data type is null, default to TYPE_CLASS_TEXT
        else {
            editText.setInputType(InputType.TYPE_CLASS_TEXT);
        }

        qLayout.addView(editText);

        setView(qLayout);
        return getView();
    }

    @Override
    public String getAnswer() {
        String answer = "";
        LinearLayout layout = (LinearLayout) myView;

        for (int i = 0; i < layout.getChildCount(); i++) {
            View childView = layout.getChildAt(i);
            if (childView instanceof EditText) {
                EditText editText = (EditText) childView;

                answer = editText.getText().toString();
            }
        }

        return answer;
    }

    @Override
    public void setAnswer(String answer) {
        clearAnswer();

        if (answer != null) {
            LinearLayout layout = (LinearLayout) myView;

            for (int i = 0; i < layout.getChildCount(); i++) {
                View childView = layout.getChildAt(i);
                if (childView instanceof EditText) {
                    EditText editText = (EditText) childView;
                    if (getTextBoxDataType().equals("DateTime")) {
                        // This is needed because text input was disabled for the date EditTexts
                        editText.setFilters(enableInput);
                        editText.setText(answer);
                        editText.setFilters(disableInput);
                    } else {
                        editText.setText(answer);
                    }

                }
            }
        }
    }

    @Override
    public void clearAnswer() {
        LinearLayout layout = (LinearLayout) myView;

        for (int i = 0; i < layout.getChildCount(); i++) {
            View childView = layout.getChildAt(i);
            if (childView instanceof EditText) {
                EditText editText = (EditText) childView;
                editText.setText(null);
            }
        }
    }

    public void createDatePicker(View v) {
        ActionBarActivity mActivity = (ActionBarActivity) v.getContext();
        //DialogFragment newFragment = new DatePickerFragment();
        DatePickerFragment newFragment = new DatePickerFragment();
        newFragment.setter(v);
        newFragment.show(mActivity.getSupportFragmentManager(), "datePicker");
    }
}
