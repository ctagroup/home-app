package edu.weber.housing1000;

import android.content.Context;
import android.widget.Checkable;
import android.widget.ImageView;

/**
 * Created by Blake on 2/19/14.
 */
public class CheckableImageView extends ImageView implements Checkable {
    private boolean checked = false;

    public CheckableImageView(Context context) {
        super(context);
    }

    @Override
    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    @Override
    public boolean isChecked() {
        return checked;
    }

    @Override
    public void toggle() {
        setChecked(!checked);
    }
}
