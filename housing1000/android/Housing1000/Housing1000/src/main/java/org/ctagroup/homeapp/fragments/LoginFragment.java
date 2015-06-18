package org.ctagroup.homeapp.fragments;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;

import org.ctagroup.homeapp.R;

/**
 * Login fragment for chat
 */
public class LoginFragment extends Fragment {

    public static LoginFragment getInstance() {
        LoginFragment fragment = new LoginFragment();
        return fragment;
    }

    public LoginFragment() {
    }

    public interface LoginFragmentListener {
        void onLogin(String name, String userId);
    }

    LoginFragmentListener mLoginFragmentListener;
    EditText mEditTextEmail;
    EditText mEditTextName;
    Button mButtonLogin;

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        if (activity instanceof LoginFragmentListener) {
            mLoginFragmentListener = (LoginFragmentListener) activity;
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_login, container, false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mEditTextEmail = (EditText) view.findViewById(R.id.editText_email);
        mEditTextName = (EditText) view.findViewById(R.id.editText_name);
        mButtonLogin = (Button) view.findViewById(R.id.button_login);

        mButtonLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (validate()) {
                    login(mEditTextName.getText().toString(),
                            mEditTextEmail.getText().toString());
                }
            }
        });
    }

    private void login(String name, String email) {
        mLoginFragmentListener.onLogin(name, email);
        setImeVisibility(mEditTextEmail, false);
    }

    private boolean validate() {
        if (TextUtils.isEmpty(mEditTextName.getText())) {
            mEditTextName.setError("enter a name");
            return false;
        } else {
            String name = mEditTextName.getText().toString();
            if (null == name || name.equals("")) {
                mEditTextName.setError("enter a name");
                return false;
            }
        }

        if (TextUtils.isEmpty(mEditTextEmail.getText())) {
            mEditTextEmail.setError("enter an email");
            return false;
        } else {
            String email = mEditTextEmail.getText().toString();
            if (null == email || email.equals("")) {
                mEditTextEmail.setError("enter an email");
                return false;
            }
        }
        return true;
    }

    public static void setImeVisibility(View view, final boolean visible) {
        if (view == null) {
            return;
        }
        ImeRunnable runnable = new ImeRunnable(view);
        if (visible) {
            view.post(runnable);
        } else {
            view.removeCallbacks(runnable);
            InputMethodManager imm = (InputMethodManager) view.getContext()
                    .getSystemService(Context.INPUT_METHOD_SERVICE);

            if (imm != null) {
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
        }
    }

    private static class ImeRunnable implements Runnable {

        View view;

        public ImeRunnable(View view) {
            this.view = view;
        }

        @Override
        public void run() {
            InputMethodManager imm = (InputMethodManager) view.getContext()
                    .getSystemService(Context.INPUT_METHOD_SERVICE);

            if (imm != null) {
                imm.showSoftInput(view, 0);
            }
        }
    }

}
