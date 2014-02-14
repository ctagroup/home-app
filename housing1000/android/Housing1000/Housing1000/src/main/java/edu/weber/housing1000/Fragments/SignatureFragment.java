package edu.weber.housing1000.Fragments;

import android.animation.Animator;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;

import edu.weber.housing1000.R;
import edu.weber.housing1000.SignatureActivity;

/**
 * Created by Blake on 2/11/14.
 */
public class SignatureFragment extends SurveyAppFragment {
    public static final int RESULT_SIGNATURE_SAVED = 1;

    ImageView signatureImageView;
    ImageButton signHereImageButton;

    byte[] signatureImageBytes;

    public SignatureFragment(String name) {
        super(name);

        setActionBarTitle("Disclaimer...");
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (savedInstanceState != null)
        {
            signatureImageBytes = savedInstanceState.getByteArray("signatureImageBytes");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_signature, container, false);

        signatureImageView = (ImageView) rootView.findViewById(R.id.signatureImageView);
        signHereImageButton = (ImageButton) rootView.findViewById(R.id.signHereImageButton);

        signHereImageButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), SignatureActivity.class);

                startActivityForResult(intent, RESULT_SIGNATURE_SAVED);
            }
        });

        if (signatureImageBytes != null)
            loadImage();

        return rootView;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (resultCode == RESULT_SIGNATURE_SAVED)
        {
            signatureImageBytes = data.getByteArrayExtra("bitmap");
            loadImage();
        }

    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        if (signatureImageBytes != null)
            outState.putByteArray("signatureImageBytes", signatureImageBytes);
    }

    public void loadImage()
    {
        Bitmap signature = BitmapFactory.decodeByteArray(signatureImageBytes, 0, signatureImageBytes.length);

        signatureImageView.setImageBitmap(signature);
        signHereImageButton.setImageResource(R.drawable.signature_line);
    }
}
