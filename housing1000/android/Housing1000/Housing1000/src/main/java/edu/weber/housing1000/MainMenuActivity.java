package edu.weber.housing1000;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;

import edu.weber.housing1000.Helpers.EncryptionHelper;
import edu.weber.housing1000.Helpers.FileHelper;
import edu.weber.housing1000.Helpers.ImageHelper;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;

public class MainMenuActivity extends Activity{

    int hmsId = -1;
    long surveyId = -1;
    private final  Context context = this;
    private static final int TAKE_PICTURE = 533430123;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_menu);

        hmsId = -1;
        surveyId = -1;

        Button clientButton = (Button) findViewById(R.id.clientButton);
        Button interviewButton = (Button) findViewById(R.id.interviewButton);
        Button cameraButton = (Button) findViewById(R.id.cameraButton);
        Button submitButton = (Button) findViewById(R.id.SubmitBtn);

        clientButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                //Intent intent = new Intent(MainMenuActivity.this, ClientInfoActivity.class);
                //intent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                //intent.putExtras(getIntent());
                //startActivity(intent);
            }
        });

        interviewButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(MainMenuActivity.this, InterviewerInfoActivity.class);
                //intent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                intent.putExtras(getIntent());
                startActivity(intent);
            }
        });

        cameraButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View view)
            {
                dispatchTakePictureIntent(TAKE_PICTURE);
            }
        });

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // This was broken, so it is removed
            }
        });
    }



    private void dispatchTakePictureIntent(int actionCode) {
        if(Utils.isIntentAvailable(getApplicationContext(), MediaStore.ACTION_IMAGE_CAPTURE)){
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            startActivityForResult(takePictureIntent, actionCode);
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == TAKE_PICTURE) {
            Bitmap photo = (Bitmap) data.getExtras().get("data");
            Bitmap sPhoto = ImageHelper.ScaleImage(photo);
            try {
                FileOutputStream out = openFileOutput("picture_"+hmsId+".jpg", Context.MODE_PRIVATE);
                ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
                sPhoto.compress(Bitmap.CompressFormat.JPEG, 100, byteArray);
                byte[] byteImage = byteArray.toByteArray();
                byte[] key = EncryptionHelper.keyGen();
                byte[] encryptedImage = EncryptionHelper.encrypt(key, byteImage);

                FileHelper.writeFileToExternalStorage(encryptedImage,"encryptedPhoto");

                byte[] encryptedFileBytes = FileHelper.readFileFromExternalStorage("encryptedPhoto");
                byte[] decryptedImageBytes = EncryptionHelper.decrypt(key,encryptedFileBytes);
                FileHelper.writeFileToExternalStorage(decryptedImageBytes, "decryptedPhoto.jpg");

                /*byte[] decryptedImage = EncryptionHelper.decrypt(key, encryptedImage);
                Bitmap test = BitmapFactory.decodeByteArray(decryptedImage, 0, decryptedImage.length);
                test.compress(Bitmap.CompressFormat.JPEG, 100, out);
                out.flush();
                out.close();
                String url = MediaStore.Images.Media.insertImage(getContentResolver(), test, "title", null);
                android.util.Log.v("log_tag", "url: " + url);*/

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
