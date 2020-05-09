package com.example.rn.bottom;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class RCTBottomNavigationModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    public RCTBottomNavigationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "BottomNavigationModule";
    }
}
