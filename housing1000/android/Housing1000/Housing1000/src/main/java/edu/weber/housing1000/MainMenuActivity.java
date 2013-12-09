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
import edu.weber.housing1000.db.SurveyDbAdapter;
import edu.weber.housing1000.rest.RestHelper;
import edu.weber.housing1000.rest.XmlSurvey;

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

        hmsId = getIntent().getIntExtra(SurveyDbAdapter.SURVEYS_FIELD_HMS_ID, -1);
        surveyId = getIntent().getLongExtra(SurveyDbAdapter.SURVEYS_FIELD_ID, -1);

        Button clientButton = (Button) findViewById(R.id.clientButton);
        Button interviewButton = (Button) findViewById(R.id.interviewButton);
        Button cameraButton = (Button) findViewById(R.id.cameraButton);
        Button submitButton = (Button) findViewById(R.id.SubmitBtn);

        clientButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(MainMenuActivity.this, ClientInfoActivity.class);
                //intent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                intent.putExtras(getIntent());
                startActivity(intent);
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
                AlertDialog.Builder builder = new AlertDialog.Builder(MainMenuActivity.this);
                builder.setMessage(R.string.submit_survey_message).setTitle(R.string.survey_title);
                final AlertDialog dialog = builder.create();
                dialog.show();
                Handler handler = new Handler();
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        XmlSurvey survey = new XmlSurvey(surveyId, getApplicationContext());
                        survey.createXMLSurvey();
                        String[] fileList = context.fileList();
                        for ( String filename : fileList){
                            if(filename.contains(Integer.toString(hmsId))){
                                int result = RestHelper.postFile(filename, context);
                                if (result == 200){
                                    context.deleteFile(filename);
                                }
                            }
                        }
                        dialog.dismiss();
                        Intent intent = new Intent(MainMenuActivity.this, SelectPageActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        startActivity(intent);
                    }
                });
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
            try {
                FileOutputStream out = openFileOutput("picture_"+hmsId+".jpg", Context.MODE_PRIVATE);
                ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
                photo.compress(Bitmap.CompressFormat.JPEG, 100, byteArray);
                byte[] byteImage = byteArray.toByteArray();
                byte[] key = EncryptionHelper.keyGen();
                byte[] encryptedImage = EncryptionHelper.encrypt(key, byteImage);

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
