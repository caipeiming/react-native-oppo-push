package com.example.rn.bottom;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

import javax.annotation.Nullable;

public class RCTBottomNavigationViewManager extends SimpleViewManager<RCTBottomNavigationView> {

    public static final String REACT_CLASS = "RCTBottomNavigationView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTBottomNavigationView createViewInstance(ThemedReactContext reactContext) {
        return new RCTBottomNavigationView(reactContext);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onMenuItemPress",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onMenuItemPress"))
                )
                .build();
    }
}
