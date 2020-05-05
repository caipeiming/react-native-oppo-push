
package top.cpming.rn.push.oppo;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.heytap.msp.push.HeytapPushManager;
import com.heytap.msp.push.callback.ICallBackResultService;

public class RNOppoPushModule extends ReactContextBaseJavaModule {
    private final String TAG = "RNOppoPushModule";
    /**
     * 后台为每个应用分配的id，用于唯一标识一个应用，在程序代码中用不到
     */
    private String appId;
    /**
     * appKey，用于向push服务器进行注册，开发者应当谨慎保存，避免泄漏
     */
    private String appKey;
    /**
     * appSecret，用于进行注册和消息加解密，开发者应当谨慎保存，避免泄漏
     */
    private String appSecret;

    private final ReactApplicationContext reactContext;

    public RNOppoPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        try {
            ApplicationInfo ai = reactContext.getPackageManager().getApplicationInfo(reactContext.getPackageName(), PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            this.appId = bundle.getString("oppo_app_id");
            this.appKey = bundle.getString("oppo_app_key");
            this.appSecret = bundle.getString("oppo_app_secret");
        } catch (Exception e) {
            Log.e(TAG, "获取 appId, appKey, appSecret 失败：" + e.getMessage());
        }
    }

    @Override
    public String getName() {
        return "RNOppoPush";
    }

    /************************************************************************************
     * ***************************callbacks from mcs************************************
     ***********************************************************************************/
    private ICallBackResultService mPushCallback = new ICallBackResultService() {
        @Override
        public void onRegister(int code, String s) {
            WritableMap response = Arguments.createMap();
            response.putString("event", "onRegister");
            response.putInt("code", code);
            response.putString("data", s);
            sendEvent(response);
            if (code == 0) {
                showResult("注册成功", "registerId:" + s);
            } else {
                showResult("注册失败", "code=" + code + ",msg=" + s);
            }
        }

        @Override
        public void onUnRegister(int code) {
            WritableMap response = Arguments.createMap();
            response.putString("event", "onUnRegister");
            response.putInt("code", code);
            sendEvent(response);
            if (code == 0) {
                showResult("注销成功", "code=" + code);
            } else {
                showResult("注销失败", "code=" + code);
            }
        }

        @Override
        public void onGetPushStatus(final int code, int status) {
            WritableMap response = Arguments.createMap();
            response.putString("event", "onGetPushStatus");
            response.putInt("code", code);
            response.putInt("data", status);
            sendEvent(response);
            if (code == 0 && status == 0) {
                showResult("Push状态正常", "code=" + code + ",status=" + status);
            } else {
                showResult("Push状态错误", "code=" + code + ",status=" + status);
            }
        }

        @Override
        public void onGetNotificationStatus(final int code, final int status) {
            WritableMap response = Arguments.createMap();
            response.putString("event", "onGetNotificationStatus");
            response.putInt("code", code);
            response.putInt("data", status);
            sendEvent(response);
            if (code == 0 && status == 0) {
                showResult("通知状态正常", "code=" + code + ",status=" + status);
            } else {
                showResult("通知状态错误", "code=" + code + ",status=" + status);
            }
        }

        @Override
        public void onSetPushTime(final int code, final String s) {
            WritableMap response = Arguments.createMap();
            response.putString("event", "onSetPushTime");
            response.putInt("code", code);
            response.putString("data", s);
            sendEvent(response);
            showResult("SetPushTime", "code=" + code + ",result:" + s);
        }
    };

    private void showResult(String name, String str) {
        if (BuildConfig.DEBUG) {
            Log.e(TAG, name + " => " + str);
        }
    }

    @ReactMethod
    public void init() {
        //初始化push，调用注册接口
        showResult("oppo_app_id", this.appId);
        showResult("oppo_app_key", this.appKey);
        showResult("oppo_app_secret", this.appSecret);
        try {
            this.showResult("初始化注册", "调用register接口");
            HeytapPushManager.init(this.reactContext, true);
            HeytapPushManager.register(this.reactContext, appKey, appSecret, mPushCallback);    //setPushCallback接口也可设置callback
            HeytapPushManager.requestNotificationPermission();
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, e.getMessage());
        }
    }

    /**
     * 应用注册
     */
    @ReactMethod
    public void getRegister() {
        HeytapPushManager.getRegister();
    }

    /**
     * 应用注销
     */
    @ReactMethod
    public void unRegister() {
        HeytapPushManager.unRegister();
    }

    /**
     * 是否支持 OPPO PUSH
     *
     * @param promise
     */
    @ReactMethod
    public void isSupportPush(Promise promise) {
        promise.resolve(HeytapPushManager.isSupportPush());
    }

    /**
     * 通知栏设置
     */
    @ReactMethod
    public void openNotificationSettings() {
        HeytapPushManager.openNotificationSettings();
    }

    /**
     * 获取OPPO PUSH推送服务状态
     */
    @ReactMethod
    public void getPushStatus() {
        HeytapPushManager.getPushStatus();
    }

    /**
     * 获取通知栏状态，从callbackresultservice回调结果
     */
    @ReactMethod
    public void getNotificationStatus() {
        HeytapPushManager.getNotificationStatus();
    }

    /**
     * 暂停接收OPPO PUSH服务推送的消息
     */
    @ReactMethod
    public void pausePush() {
        HeytapPushManager.pausePush();
    }

    /**
     * 恢复接收OPPO PUSH服务推送的消息，这时服务器会把暂停时期的推送消息重新推送过来
     */
    @ReactMethod
    public void resumePush() {
        HeytapPushManager.resumePush();
    }

    /**
     * 获取OPPO PUSH推送服务MCS版本（例如"1701"）
     *
     * @param promise
     */
    @ReactMethod
    public void getPushVersionCode(Promise promise) {
        int code = HeytapPushManager.getPushVersionCode();
        promise.resolve(code);
    }

    /**
     * 获取OPPO PUSH推送服务MCS名称（例如"1.7.1"）
     *
     * @param promise
     */
    @ReactMethod
    public void getPushVersionName(Promise promise) {
        String name = HeytapPushManager.getPushVersionName();
        promise.resolve(name);
    }

    /**
     * 获取OPPO PUSH推送服务SDK版本（例如"2.1.0"）
     *
     * @param promise
     */
    @ReactMethod
    public void getSDKVersion(Promise promise) {
        String version = HeytapPushManager.getSDKVersion();
        promise.resolve(version);
    }

    private void sendEvent(WritableMap response) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("OPPO_Push_Response", response);
    }
}