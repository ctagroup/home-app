package edu.weber.housing1000.fragments;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
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
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.TextView;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;

import edu.weber.housing1000.helpers.EncryptionHelper;
import edu.weber.housing1000.helpers.FileHelper;
import edu.weber.housing1000.helpers.ImageHelper;
import edu.weber.housing1000.helpers.RESTHelper;
import edu.weber.housing1000.SurveyService;
import edu.weber.housing1000.ImageAdapter;
import edu.weber.housing1000.R;
import edu.weber.housing1000.activities.SurveyFlowActivity;
import edu.weber.housing1000.Utils;
import edu.weber.housing1000.sqllite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Header;
import retrofit.client.Response;
import retrofit.mime.MultipartTypedOutput;
import retrofit.mime.TypedOutput;

/**
 * Created by Blake on 2/11/14.
 */
public class PhotosFragment extends SurveyAppFragment {
    private static final int TAKE_PICTURE = 1111;   // Activity result for taking a picture

    private SurveyFlowActivity myActivity;  // Parent activity
    private boolean photosSubmitted;

    private GridView photosGridView;    // Holds the photos
    private TextView noPhotosTextView; // Text that is shown when no photos are present

    private ImageAdapter imageAdapter; // Adapter that keeps track of saved photos

    public static PhotosFragment newInstance(Context context)
    {
        PhotosFragment fragment = new PhotosFragment();

        Bundle args = new Bundle();
        args.putString("name", context.getString(R.string.fragment_photos_name));
        args.putString("title", context.getString(R.string.fragment_photos_title));
        fragment.setArguments(args);

        fragment.updateName();

        return fragment;
    }

    @Override
    public void onResume() {
        super.onResume();

        final InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(getView().getWindowToken(), 0);
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        myActivity = (SurveyFlowActivity) getActivity();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setHasOptionsMenu(true);

        if (savedInstanceState != null)
        {
            photosSubmitted = savedInstanceState.getBoolean("photosSubmitted");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_photos, container, false);

        photosGridView = (GridView) rootView.findViewById(R.id.photosGridView);
        noPhotosTextView = (TextView) rootView.findViewById(R.id.noPhotosTextView);

        // Pull the images list from the saved state
        if (savedInstanceState != null) {
            imageAdapter = new ImageAdapter(myActivity, savedInstanceState.getStringArrayList("images"));
        }
        else {
            imageAdapter = new ImageAdapter(myActivity);
        }

        photosGridView.setAdapter(imageAdapter);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            photosGridView.setChoiceMode(GridView.CHOICE_MODE_MULTIPLE_MODAL);
            photosGridView.setMultiChoiceModeListener(new MultiChoiceListener());
        }
        else
        {
            photosGridView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
                @Override
                public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                    final int selectedImage = position;
                    AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
                    builder.setTitle(getActivity().getString(R.string.delete_question_mark));
                    builder.setMessage(getActivity().getString(R.string.delete_this_photo));
                    builder.setPositiveButton(getString(R.string.yes), new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            imageAdapter.removeImage(selectedImage);
                            imageAdapter.notifyDataSetChanged();
                            if (imageAdapter.getCount() == 0) {
                                noPhotosTextView.setVisibility(View.VISIBLE);
                            }

                            dialog.dismiss();
                        }
                    });
                    builder.setNegativeButton(getString(R.string.no), new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.dismiss();
                        }
                    });
                    builder.show();
                    return true;
                }
            });
        }

        if (imageAdapter.getCount() > 0)
            noPhotosTextView.setVisibility(View.GONE);

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
                dispatchTakePictureIntent();
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
        outState.putBoolean("photosSubmitted", photosSubmitted);
    }

    /**
     * Opens up the camera to take a picture
     *
     */
    private void dispatchTakePictureIntent() {
        if (Utils.isIntentAvailable(myActivity.getApplicationContext(), MediaStore.ACTION_IMAGE_CAPTURE)) {
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

            startActivityForResult(takePictureIntent, PhotosFragment.TAKE_PICTURE);
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == TAKE_PICTURE) {
            try {
                Bitmap photo = (Bitmap) data.getExtras().get("data");
                Bitmap sPhoto = ImageHelper.ScaleImage(photo);

                // Set up the file names
                String encryptedName = "photo_" + String.valueOf(imageAdapter.getCount()) + ".secure";

                ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
                sPhoto.compress(Bitmap.CompressFormat.PNG, 100, byteArray);
                byte[] byteImage = byteArray.toByteArray();

                byte[] encryptedImage = EncryptionHelper.encrypt(byteImage);

                FileHelper.writeFileToExternalStorage(encryptedImage, myActivity.getFolderHash(), encryptedName, getActivity());

                // Add the file path to the imageAdapter
                imageAdapter.addImagePath(FileHelper.getAbsoluteFilePath(myActivity.getFolderHash(), encryptedName, getActivity()));

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

    /**
     * In the case of no internet connection on submission, save the photo paths to submit later
     * @param surveyDataId The id of the survey to go along with these photos
     */
    public void savePhotoPathsToDatabase(long surveyDataId) {
        DatabaseConnector databaseConnector = new DatabaseConnector(myActivity.getBaseContext());
        databaseConnector.saveSubmittedImagePaths(false, myActivity.getFolderHash(), surveyDataId, imageAdapter.getImages().toArray(new String[imageAdapter.getImages().size()]));
    }

    public void submitPhotos() {
        if (imageAdapter.getCount() > 0 && !photosSubmitted) {
            MultipartTypedOutput multipartTypedOutput = new MultipartTypedOutput();

            myActivity.showProgressDialog(getActivity().getString(R.string.please_wait), getActivity().getString(R.string.submitting_photos), "Dialog");

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
                    photosSubmitted = true;
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
            myActivity.onPostPhotoTaskCompleted(new Response("", 200, "", new ArrayList<Header>(), null));
        }
    }

    @TargetApi(Build.VERSION_CODES.HONEYCOMB)
    private class MultiChoiceListener implements GridView.MultiChoiceModeListener {
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
                    if (selected != null) {
                        for (int i = 0; i < selected.size(); i++) {
                            if (selected.get(selected.keyAt(i))) {
                                Log.d("REMOVING IMAGE", String.valueOf(selected.keyAt(i)));
                                imageAdapter.removeImage(selected.keyAt(i));
                            }
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
