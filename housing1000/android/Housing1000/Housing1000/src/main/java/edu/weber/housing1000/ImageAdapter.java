package edu.weber.housing1000;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;

import edu.weber.housing1000.Helpers.EncryptionHelper;
import edu.weber.housing1000.Helpers.FileHelper;

/**
 * Created by Blake on 2/18/14.
 * This is an adapter for the GridView in the PhotosFragment
 * It keeps track of the file names of the saved photos so they can be dynamically loaded
 * as the GridView requests them
 */
public class ImageAdapter extends BaseAdapter {
    ArrayList<String> images;
    private Context mContext;

    public ImageAdapter(Context c) {
        mContext = c;
        images = new ArrayList<String>();
    }

    public ImageAdapter(Context c, ArrayList<String> images) {
        mContext = c;
        this.images = images;
    }

    public void addImagePath(String path) {
        images.add(path);
    }

    public void removeImagePath(String path) {
        images.remove(path);
    }

    public void removeImagePath(long index) {
        images.remove(index);
    }

    public int getCount() {
        return images.size();
    }

    public Object getItem(int position) {
        return images.get(position);
    }

    public long getItemId(int position) {
        return 0;
    }

    public ArrayList<String> getImages() {
        return images;
    }

    // create a new ImageView for each item referenced by the Adapter
    public View getView(int position, View convertView, ViewGroup parent) {
        CheckableImageView imageView;

        // If it's not recycled, initialize some attributes
        if (convertView == null) {
            imageView = new CheckableImageView(mContext);
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            imageView.setPadding(8, 8, 8, 8);
        } else {
            imageView = (CheckableImageView) convertView;
        }

        Bitmap image = null;

        try {
            File imageFile = new File(images.get(position));

            Log.d("LOADING IMAGE", imageFile.getAbsolutePath());
            if (imageFile.exists()) {
                // Set up the stream, read the file, decrypt it
                FileInputStream fStream = new FileInputStream(imageFile);
                byte[] imageBytes = FileHelper.readFile(imageFile);
                byte[] decryptedBytes = EncryptionHelper.decrypt(imageBytes);

                image = BitmapFactory.decodeByteArray(decryptedBytes, 0, decryptedBytes.length);

                fStream.close();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        if (image != null)
            imageView.setImageBitmap(image);
        return imageView;
    }

}
