
package top.cpming.rn.push.oppo;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class RNOppoPushModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNOppoPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNOppoPush";
    }
}