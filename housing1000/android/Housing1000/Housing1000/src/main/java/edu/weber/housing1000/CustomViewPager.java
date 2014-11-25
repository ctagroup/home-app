package edu.weber.housing1000;

import android.content.Context;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.view.MotionEvent;

import edu.weber.housing1000.activities.SurveyFlowActivity;

/**
 * @author Blake
 */
public class CustomViewPager extends ViewPager {
    private SurveyFlowActivity myActivity;

    public CustomViewPager(Context context) {
        super(context);
        if (!isInEditMode())
            myActivity = (SurveyFlowActivity) context;
    }

    public CustomViewPager(Context context, AttributeSet attrs) {
        super(context, attrs);
        if (!isInEditMode())
            myActivity = (SurveyFlowActivity) context;
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent arg0) {
        return myActivity.getIsDisclaimerFinished() && super.onInterceptTouchEvent(arg0);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (myActivity.getIsDisclaimerFinished())
            return super.onTouchEvent(event);

        return false;
    }
}
