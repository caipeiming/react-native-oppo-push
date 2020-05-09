package com.example.rn.bottom;

import android.graphics.Color;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.core.view.ViewCompat;

import com.example.R;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.bottomnavigation.LabelVisibilityMode;

public class RCTBottomNavigationView extends BottomNavigationView implements BottomNavigationView.OnNavigationItemSelectedListener {
    private ThemedReactContext context;

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
    }

    private final Runnable measureAndLayout = () -> {
        measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    public RCTBottomNavigationView(ThemedReactContext context) {
        super(context);
        this.context = context;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        this.init();
    }

    private void init() {
        Menu menu = getMenu();
        if (menu.size() > 0) {
            return;
        }
        this.inflateMenu(R.menu.navigation);
        this.setBackgroundColor(Color.parseColor("white"));
        setOnNavigationItemSelectedListener(this);
        requestLayout();
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
        Menu menu = getMenu();
        if (menu == null) {
            return false;
        }
        int position = -1;
        for (int i = 0; i < menu.size(); i++) {
            MenuItem item = menu.getItem(i);
            if (item == menuItem) {
                position = i;
            }
        }
        if (position == -1) {
            return false;
        }
        WritableMap eventMap = Arguments.createMap();
        eventMap.putInt("position", position);
        context.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "onMenuItemPress",
                eventMap);
        return true;
    }
}
