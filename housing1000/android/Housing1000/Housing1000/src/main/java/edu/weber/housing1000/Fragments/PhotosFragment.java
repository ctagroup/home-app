package edu.weber.housing1000.Fragments;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.util.SparseBooleanArray;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.GridView;
import android.widget.TextView;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

import edu.weber.housing1000.Helpers.EncryptionHelper;
import edu.weber.housing1000.Helpers.FileHelper;
import edu.weber.housing1000.Helpers.ImageHelper;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import edu.weber.housing1000.Helpers.REST.SurveyService;
import edu.weber.housing1000.ImageAdapter;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyFlowActivity;
import edu.weber.housing1000.Utils;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.MultipartTypedOutput;
import retrofit.mime.TypedOutput;

/**
 * Created by Blake on 2/11/14.
 */
public class PhotosFragment extends SurveyAppFragment {
    private static final int TAKE_PICTURE = 1111;   // Activity result for taking a picture

    SurveyFlowActivity myActivity;  // Parent activity

    GridView photosGridView;    // Holds the photos
    TextView noPhotosTextView; // Text that is shown when no photos are present

    ImageAdapter imageAdapter; // Adapter that keeps track of saved photos

    public PhotosFragment() {
    } // Default constructor - Needed to restore state

    public PhotosFragment(String name, String actionBarTitle) {
        super(name, actionBarTitle);

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

        myActivity = (SurveyFlowActivity) getActivity();

    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        if (myActivity == null)
            myActivity = (SurveyFlowActivity) getActivity();
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

        // Pull the images list from the saved state
        if (savedInstanceState != null)
            imageAdapter = new ImageAdapter(myActivity, savedInstanceState.getStringArrayList("images"));
        else
            imageAdapter = new ImageAdapter(myActivity);
        photosGridView.setAdapter(imageAdapter);
        photosGridView.setChoiceMode(GridView.CHOICE_MODE_MULTIPLE_MODAL);
        photosGridView.setMultiChoiceModeListener(new MultiChoiceListener());

        if (imageAdapter.getCount() > 0)
            noPhotosTextView.setVisibility(View.GONE);

//        photosGridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
//            public void onItemClick(AdapterView<?> parent, View v, int position, long id) {
////                v.setSelected(!v.isSelected());
////                v.setPressed(!v.isPressed());
//                //Toast.makeText(myActivity, "" + position, Toast.LENGTH_SHORT).show();
//            }
//        });

        return rootView;
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.menu_fragment_photos, menu);

        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_camera:
                dispatchTakePictureIntent(TAKE_PICTURE);
                return true;
            default:
                break;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        outState.putStringArrayList("images", imageAdapter.getImages());
    }

    /**
     * Opens up the camera to take a picture
     *
     * @param actionCode Activity result to return
     */
    private void dispatchTakePictureIntent(int actionCode) {
        if (Utils.isIntentAvailable(myActivity.getApplicationContext(), MediaStore.ACTION_IMAGE_CAPTURE)) {
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

            startActivityForResult(takePictureIntent, actionCode);
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == TAKE_PICTURE) {
            try {
                Bitmap photo = (Bitmap) data.getExtras().get("data");
                Bitmap sPhoto = ImageHelper.ScaleImage(photo);

                // Set up the file names
                String imageName = "photo_" + String.valueOf(imageAdapter.getCount()) + ".png";
                String encryptedName = "photo_" + String.valueOf(imageAdapter.getCount()) + ".secure";

                ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
                sPhoto.compress(Bitmap.CompressFormat.PNG, 100, byteArray);
                byte[] byteImage = byteArray.toByteArray();

                byte[] encryptedImage = EncryptionHelper.encrypt(byteImage);

                FileHelper.writeFileToExternalStorage(encryptedImage, myActivity.getFolderHash(), encryptedName);

                byte[] encryptedFileBytes = FileHelper.readFileFromExternalStorage(myActivity.getFolderHash(), encryptedName);

                // Decrypt the photo - for testing
                //byte[] decryptedImageBytes = EncryptionHelper.decrypt(encryptedFileBytes);
                //FileHelper.writeFileToExternalStorage(decryptedImageBytes, myActivity.getFolderHash(), imageName);

                // Add the file path to the imageAdapter
                imageAdapter.addImagePath(FileHelper.getAbsoluteFilePath(myActivity.getFolderHash(), encryptedName));

                Log.d("PHOTO ADDED", (String) imageAdapter.getItem(imageAdapter.getCount() - 1));
                Log.d("PHOTO COUNT", String.valueOf(imageAdapter.getCount()));

                imageAdapter.notifyDataSetChanged();
                if (imageAdapter.getCount() > 0)
                    noPhotosTextView.setVisibility(View.GONE);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void submitPhotos() {
        if (imageAdapter.getCount() > 0) {
            MultipartTypedOutput multipartTypedOutput = new MultipartTypedOutput();

            myActivity.showProgressDialog("Please Wait", "Submitting photo(s)...", "PhotoSubmit");

            for (TypedOutput image : RESTHelper.generateTypedOutputFromImages(imageAdapter.getImages(), myActivity.getClientSurveyId())) {
                multipartTypedOutput.addPart(image.fileName(), image);
            }

            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(getActivity(), null);

            SurveyService service = restAdapter.create(SurveyService.class);

            service.postImage(multipartTypedOutput, new Callback<String>() {
                @Override
                public void success(String s, Response response) {
                    if (s != null) {
                        Log.d("SUCCESS", s);
                    }

                    myActivity.onPostPhotoTaskCompleted(response);
                }

                @Override
                public void failure(RetrofitError error) {
                    String errorBody = (String) error.getBodyAs(String.class);

                    if (errorBody != null) {
                        Log.e("FAILURE", errorBody);
                        myActivity.onPostPhotoTaskCompleted(error.getResponse());
                    } else {
                        myActivity.onPostPhotoTaskCompleted(error.getResponse());
                    }
                }
            });
        }
        else
        {
            myActivity.onPostPhotoTaskCompleted(null);
        }
    }

    public class MultiChoiceListener implements GridView.MultiChoiceModeListener {
        @Override
        public void onItemCheckedStateChanged(android.view.ActionMode mode, int position, long id, boolean checked) {
            int selectCount = photosGridView.getCheckedItemCount();
            switch (selectCount) {
                case 1:
                    mode.setSubtitle("One item selected");
                    break;
                default:
                    mode.setSubtitle("" + selectCount + " items selected");
                    break;
            }
        }

        @Override
        public boolean onCreateActionMode(android.view.ActionMode mode, Menu menu) {
            mode.setTitle("Select Items");
            mode.setSubtitle("One item selected");
            mode.getMenuInflater().inflate(R.menu.menu_actionmode_photo, menu);
            return true;
        }

        @Override
        public boolean onPrepareActionMode(android.view.ActionMode mode, Menu menu) {
            return true;
        }

        @Override
        public boolean onActionItemClicked(android.view.ActionMode mode, MenuItem item) {
            switch (item.getItemId()) {
                case R.id.action_delete_photo:
                    SparseBooleanArray selected = photosGridView.getCheckedItemPositions();
                    Log.d("SELECTED IMAGE COUNT", String.valueOf(photosGridView.getCheckedItemCount()));
                    for (int i = 0; i < selected.size(); i++) {
                        if (selected.get(selected.keyAt(i))) {
                            Log.d("REMOVING IMAGE", String.valueOf(selected.keyAt(i)));
                            imageAdapter.removeImage(selected.keyAt(i));
                        }
                    }
                    mode.finish();
                    imageAdapter.notifyDataSetChanged();
                    if (imageAdapter.getCount() == 0) {
                        noPhotosTextView.setVisibility(View.VISIBLE);
                    }
                    break;
            }
            return true;
        }

        @Override
        public void onDestroyActionMode(android.view.ActionMode mode) {

        }
    }

}
