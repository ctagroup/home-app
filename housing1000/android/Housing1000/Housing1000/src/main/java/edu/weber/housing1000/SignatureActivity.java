package edu.weber.housing1000;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.*;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.MediaStore.Images;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup.LayoutParams;
import android.view.Window;
import android.widget.Button;
import android.widget.LinearLayout;
import edu.weber.housing1000.data.Survey;
import edu.weber.housing1000.db.SurveyDbAdapter;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;

public class SignatureActivity extends Activity {

    LinearLayout mContent;
    signature mSignature;
    Button mClear, mGetSign, mCancel;
    private Bitmap mBitmap;
    View mView;
    String filename;
    int hmsId = -1;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.signature);

        // Setting this to -1 until the RestHelper is taken off of the main thread
        // Side note: any IO/slow operations need to be done on a separate thread
        hmsId = -1;
        //hmsId = RestHelper.getHmsId();
        SurveyDbAdapter db = new SurveyDbAdapter(getApplicationContext());
        db.open();
        final long surveyId = db.insertSurvey(new Survey(hmsId, Survey.Status.CREATED));
        db.close();

        mGetSign = (Button) findViewById(R.id.getsign);
        mContent = (LinearLayout) findViewById(R.id.signatureLinearLayout);
        mSignature = new signature(this, null);
        mSignature.setBackgroundColor(Color.WHITE);
        mContent.addView(mSignature, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        mClear = (Button) findViewById(R.id.clear);
        mGetSign.setEnabled(false);
        mCancel = (Button) findViewById(R.id.cancel);
        mView = mContent;
        filename = "signature_"+hmsId+".jpg";

        mClear.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                Log.v("log_tag", "Panel Cleared");
                mSignature.clear();
                mGetSign.setEnabled(false);
            }
        });

        mGetSign.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(SignatureActivity.this, MainMenuActivity.class);
                intent.putExtra(SurveyDbAdapter.SURVEYS_FIELD_HMS_ID, hmsId);
                intent.putExtra(SurveyDbAdapter.SURVEYS_FIELD_ID, surveyId);
                startActivity(intent);
                Log.v("log_tag", "Panel Saved");
                mView.setDrawingCacheEnabled(true);
                mSignature.save(mView);
                finish();
            }
        });

        mCancel.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                Log.v("log_tag", "Panel Canceled");
                finish();
            }
        });

    }

    @Override
    protected void onDestroy() {
        Log.w("GetSignature", "onDestroy");
        super.onDestroy();
    }

    public class signature extends View {
        private static final float STROKE_WIDTH = 5f;
        private static final float HALF_STROKE_WIDTH = STROKE_WIDTH / 2;
        private Paint paint = new Paint();
        private Path path = new Path();

        private float lastTouchX;
        private float lastTouchY;
        private final RectF dirtyRect = new RectF();

        public signature(Context context, AttributeSet attrs) {
            super(context, attrs);
            paint.setAntiAlias(true);
            paint.setColor(Color.BLACK);
            paint.setStyle(Paint.Style.STROKE);
            paint.setStrokeJoin(Paint.Join.ROUND);
            paint.setStrokeWidth(STROKE_WIDTH);
        }

        public void save(View v) {
            Log.v("log_tag", "Width: " + v.getWidth());
            Log.v("log_tag", "Height: " + v.getHeight());
            if (mBitmap == null) {
                mBitmap = Bitmap.createBitmap(mContent.getWidth(), mContent.getHeight(), Bitmap.Config.RGB_565);
            }
            Canvas canvas = new Canvas(mBitmap);
            try {
                v.draw(canvas);
                ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
                mBitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArray);
                byte[] byteImage = byteArray.toByteArray();
                byte[] key = EncryptionHelper.keyGen();
                byte[] encryptedImage = EncryptionHelper.encrypt(key, byteImage);

                // Check to see if we can write to external storage
                if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()))
                {
                    try {

                        // Get the external storage directory
                        File sdCard = Environment.getExternalStorageDirectory();
                        // Set up the directory that we are saving to
                        File dir = new File (sdCard.getAbsolutePath() + "/.housing1000");
                        File nomedia = new File (sdCard.getAbsolutePath() + "/.housing1000/.nomedia");
                        nomedia.mkdirs();
                        File file = new File(dir, filename);

                        Log.d("HOUSING 1000", "Saving encrypted file to " + file.getAbsolutePath() );

                        // Write the file
                        FileOutputStream f = new FileOutputStream(file);
                        ObjectOutputStream oos = new ObjectOutputStream(f);
                        oos.writeObject(encryptedImage);
                        oos.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                // Decrypt the image, write it to disk -- for testing
                byte[] decryptedImage = EncryptionHelper.decrypt(key, encryptedImage);

                // Check to see if we can write to external storage
                if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()))
                {
                    try {

                        // Get the external storage directory
                        File sdCard = Environment.getExternalStorageDirectory();
                        // Set up the directory that we are saving to
                        File dir = new File (sdCard.getAbsolutePath() + "/.housing1000");
                        File nomedia = new File (sdCard.getAbsolutePath() + "/.housing1000/.nomedia");
                        nomedia.mkdirs();
                        File file = new File(dir, "decrypted.jpg");

                        Log.d("HOUSING 1000", "Saving decrypted file to " + file.getAbsolutePath() );

                        Bitmap bMap = BitmapFactory.decodeByteArray(decryptedImage, 0, decryptedImage.length);

                        // Write the file
                        FileOutputStream f = new FileOutputStream(file);
                        bMap.compress(Bitmap.CompressFormat.PNG, 100, f);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                /*byte[] decryptedImage = EncryptionHelper.decrypt(key, encryptedImage);
                Bitmap test = BitmapFactory.decodeByteArray(decryptedImage,0,decryptedImage.length);
                test.compress(Bitmap.CompressFormat.JPEG, 100, mFileOutStream);
                mFileOutStream.flush();
                mFileOutStream.close();
                String url = Images.Media.insertImage(getContentResolver(), test, "title", null);
                Log.v("log_tag", "url: " + url);*/

            } catch (Exception e) {
                Log.v("log_tag", e.toString());
            }
        }

        public void clear() {
            path.reset();
            invalidate();
        }

        @Override
        protected void onDraw(Canvas canvas) {
            canvas.drawPath(path, paint);
        }

        @Override
        public boolean onTouchEvent(MotionEvent event) {
            float eventX = event.getX();
            float eventY = event.getY();
            mGetSign.setEnabled(true);

            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    path.moveTo(eventX, eventY);
                    lastTouchX = eventX;
                    lastTouchY = eventY;
                    return true;

                case MotionEvent.ACTION_MOVE:

                case MotionEvent.ACTION_UP:

                    resetDirtyRect(eventX, eventY);
                    int historySize = event.getHistorySize();
                    for (int i = 0; i < historySize; i++) {
                        float historicalX = event.getHistoricalX(i);
                        float historicalY = event.getHistoricalY(i);
                        expandDirtyRect(historicalX, historicalY);
                        path.lineTo(historicalX, historicalY);
                    }
                    path.lineTo(eventX, eventY);
                    break;

                default:
                    return false;
            }

            invalidate((int) (dirtyRect.left - HALF_STROKE_WIDTH),
                    (int) (dirtyRect.top - HALF_STROKE_WIDTH),
                    (int) (dirtyRect.right + HALF_STROKE_WIDTH),
                    (int) (dirtyRect.bottom + HALF_STROKE_WIDTH));

            lastTouchX = eventX;
            lastTouchY = eventY;

            return true;
        }

        private void expandDirtyRect(float historicalX, float historicalY) {
            if (historicalX < dirtyRect.left) {
                dirtyRect.left = historicalX;
            } else if (historicalX > dirtyRect.right) {
                dirtyRect.right = historicalX;
            }

            if (historicalY < dirtyRect.top) {
                dirtyRect.top = historicalY;
            } else if (historicalY > dirtyRect.bottom) {
                dirtyRect.bottom = historicalY;
            }
        }

        private void resetDirtyRect(float eventX, float eventY) {
            dirtyRect.left = Math.min(lastTouchX, eventX);
            dirtyRect.right = Math.max(lastTouchX, eventX);
            dirtyRect.top = Math.min(lastTouchY, eventY);
            dirtyRect.bottom = Math.max(lastTouchY, eventY);
        }
    }
}
