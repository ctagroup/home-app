package edu.weber.housing1000.test;

import android.test.ActivityInstrumentationTestCase2;
import edu.weber.housing1000.*;

public class HelloAndroidActivityTest extends ActivityInstrumentationTestCase2<LoginActivity> {

    public HelloAndroidActivityTest() {
        super(LoginActivity.class);
    }

    public void testActivity() {
        LoginActivity activity = getActivity();
        assertNotNull(activity);
    }
}

