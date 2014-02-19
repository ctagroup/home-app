package edu.weber.housing1000.Fragments;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.GridView;
import android.widget.ListView;
import android.widget.TextView;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;

import edu.weber.housing1000.Helpers.EncryptionHelper;
import edu.weber.housing1000.Helpers.FileHelper;
import edu.weber.housing1000.Helpers.ImageHelper;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyFlowActivity;
import edu.weber.housing1000.Utils;

/**
 * Created by Blake on 2/11/14.
 */
public class PhotosFragment extends SurveyAppFragment {
    private static final int TAKE_PICTURE = 1111;

    SurveyFlowActivity myActivity;

    GridView photosGridView;
    TextView noPhotosTextView;

    ArrayList<String> photos;

    public PhotosFragment() {}

    public PhotosFragment(String name, String actionBarTitle) {
        super(name, actionBarTitle);

        photos = new ArrayList<String>();
    }

    @Override
    public void onResume() {
        super.onResume();

        final InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(getActivity().INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(getView().getWindowToken(), 0);
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        myActivity = (SurveyFlowActivity) activity;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setHasOptionsMenu(true);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_photos, container, false);

        photosGridView = (GridView) rootView.findViewById(R.id.photosGridView);
        noPhotosTextView = (TextView) rootView.findViewById(R.id.noPhotosTextView);

        return rootView;
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.menu_fragment_photos, menu);

        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId())
        {
            case R.id.action_camera:
                dispatchTakePictureIntent(TAKE_PICTURE);
                return true;
            default:
                break;
        }

        return super.onOptionsItemSelected(item);
    }

    private void dispatchTakePictureIntent(int actionCode) {
        if(Utils.isIntentAvailable(getActivity().getApplicationContext(), MediaStore.ACTION_IMAGE_CAPTURE)){
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            startActivityForResult(takePictureIntent, actionCode);
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == TAKE_PICTURE) {
            Bitmap photo = (Bitmap) data.getExtras().get("data");
            Bitmap sPhoto = ImageHelper.ScaleImage(photo);
            try {
                String imageName = "photo_" + String.valueOf(photos.size()) + ".jpg";
                String encryptedName = "photo_" + String.valueOf(photos.size()) + ".secure";

                ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
                sPhoto.compress(Bitmap.CompressFormat.JPEG, 100, byteArray);
                byte[] byteImage = byteArray.toByteArray();
                byte[] key = EncryptionHelper.keyGen();
                byte[] encryptedImage = EncryptionHelper.encrypt(key, byteImage);

                FileHelper.writeFileToExternalStorage(encryptedImage, myActivity.getFolderHash(), encryptedName);

                byte[] encryptedFileBytes = FileHelper.readFileFromExternalStorage(myActivity.getFolderHash(), encryptedName);

                // Decrypt the photo - for testing
                byte[] decryptedImageBytes = EncryptionHelper.decrypt(key, encryptedFileBytes);
                FileHelper.writeFileToExternalStorage(decryptedImageBytes, myActivity.getFolderHash(), imageName);

                photos.add(encryptedName);

                Log.d("PHOTO ADDED", encryptedName);
                Log.d("PHOTO COUNT", String.valueOf(photos.size()));

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
