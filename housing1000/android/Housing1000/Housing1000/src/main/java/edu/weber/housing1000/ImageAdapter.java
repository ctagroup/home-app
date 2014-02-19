package edu.weber.housing1000;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.GridView;
import android.widget.ImageView;

import java.io.File;
import java.io.FileInputStream;
import java.lang.reflect.Array;
import java.util.ArrayList;

import edu.weber.housing1000.Helpers.EncryptionHelper;
import edu.weber.housing1000.Helpers.FileHelper;

/**
 * Created by Blake on 2/18/14.
 */
public class ImageAdapter extends BaseAdapter {
    private Context mContext;
    ArrayList<String> images;

    public ImageAdapter(Context c) {
        mContext = c;
        images = new ArrayList<String>();
    }

    public ImageAdapter(Context c, ArrayList<String> images)
    {
        mContext = c;
        this.images = images;
    }

    public void addImagePath(String path) {
        images.add(path);
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

    public ArrayList<String> getImages()
    {
        return images;
    }

    // create a new ImageView for each item referenced by the Adapter
    public View getView(int position, View convertView, ViewGroup parent) {
        ImageView imageView;
        if (convertView == null) {  // if it's not recycled, initialize some attributes
            imageView = new ImageView(mContext);
            //imageView.setLayoutParams(new GridView.LayoutParams(120, 120));
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            imageView.setPadding(8, 8, 8, 8);
        } else {
            imageView = (ImageView) convertView;
        }

        Bitmap image = null;

        try
        {
            File imageFile = new File(images.get(position));

            Log.d("LOADING IMAGE", imageFile.getAbsolutePath());
            if (imageFile.exists())
            {
                FileInputStream fStream = new FileInputStream(imageFile);
                byte[] imageBytes = FileHelper.readFile(imageFile);
                byte[] decryptedBytes = EncryptionHelper.decrypt(imageBytes);

                image = BitmapFactory.decodeByteArray(decryptedBytes, 0, decryptedBytes.length);

                fStream.close();
            }
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
        }

        if (image != null)
            imageView.setImageBitmap(image);
        return imageView;
    }

}
