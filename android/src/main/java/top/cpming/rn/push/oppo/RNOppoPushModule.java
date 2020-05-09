
package top.cpming.rn.push.oppo;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.heytap.msp.push.HeytapPushManager;
import com.heytap.msp.push.callback.ICallBackResultService;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class RNOppoPushModule extends ReactContextBaseJavaModule {
    private final String TAG = "RNOppoPushModule";
    private final int OT_REGISTER = 1;
    private final int OT_UN_REGISTER = 2;
    private final int OT_GET_PUSH_STATUS = 3;
    private final int OT_GET_NOTIFICATION_STATUS = 4;
    private final int OT_SET_PUSH_TIME = 5;
    private final int OT_ERROR = 6;

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
        HeytapPushManager.init(this.reactContext, true);
    }

    private void checkOrCreateChannel(String channelId, String channelName, String channelDescription, Uri soundUri, int importance, long[] vibratePattern) {
        NotificationManager manager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }
        if (manager == null) {
            return;
        }
        NotificationChannel channel = manager.getNotificationChannel(channelId);
        if (channel == null) {
            channel = new NotificationChannel(channelId, channelName, importance);
            channel.setDescription(channelDescription);
            channel.enableLights(true);
            channel.enableVibration(true);
            channel.setVibrationPattern(vibratePattern);

            if (soundUri != null) {
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .build();

                channel.setSound(soundUri, audioAttributes);
            } else {
                channel.setSound(null, null);
            }

            manager.createNotificationChannel(channel);
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
            response.putInt("type", OT_REGISTER);
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
            response.putInt("type", OT_UN_REGISTER);
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
            response.putInt("type", OT_GET_PUSH_STATUS);
            response.putInt("code", code);
            response.putInt("status", status);
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
            response.putInt("type", OT_GET_NOTIFICATION_STATUS);
            response.putInt("code", code);
            response.putInt("status", status);
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
            response.putInt("type", OT_SET_PUSH_TIME);
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
        try {
            ApplicationInfo ai = reactContext.getPackageManager().getApplicationInfo(reactContext.getPackageName(), PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            this.appId = String.valueOf(bundle.get("oppo_app_id"));
            this.appKey = bundle.getString("oppo_app_key", "");
            this.appSecret = bundle.getString("oppo_app_secret", "");
            if (this.appId == null || this.appId.trim().equals("")) {
                throw new Exception("请在 AndroidManifest.xml 文件中添加 <meta-data android:name=\"oppo_app_id\" android:value=\"您的应用在 OPPO 推送平台的 AppId\"/>");
            }
            if (this.appKey == null || this.appKey.trim().equals("")) {
                throw new Exception("请在 AndroidManifest.xml 文件中添加 <meta-data android:name=\"oppo_app_key\" android:value=\"您的应用在 OPPO 推送平台的 AppKey\"/>");
            }
            if (this.appSecret == null || this.appSecret.trim().equals("")) {
                throw new Exception("请在 AndroidManifest.xml 文件中添加 <meta-data android:name=\"oppo_app_secret\" android:value=\"您的应用在 OPPO 推送平台的 AppSecret\"/>");
            }
            //初始化push，调用注册接口
            showResult("oppo_app_id", this.appId);
            showResult("oppo_app_key", this.appKey);
            showResult("oppo_app_secret", this.appSecret);
            this.showResult("初始化注册", "调用register接口");
            HeytapPushManager.register(this.reactContext, appKey, appSecret, mPushCallback);    //setPushCallback接口也可设置callback

            // 创建通道
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (bundle.get("oppo_channel_id") == null) {
                    throw new Exception("请在 AndroidManifest.xml 文件中添加 <meta-data android:name=\"oppo_channel_id\" android:value=\"您的应用在 OPPO 推送平台配置的通道ID\"/>");
                }
                String channelId = String.valueOf(bundle.get("oppo_channel_id"));
                String channelName = bundle.getString("oppo_channel_name", "");
                String channelDescription = bundle.getString("oppo_channel_description", "");
                long[] vibratePattern = new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400};
                this.checkOrCreateChannel(channelId, channelName, channelDescription, null, NotificationCompat.PRIORITY_HIGH, vibratePattern);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, e.getMessage());
            // 错误
            WritableMap response = Arguments.createMap();
            response.putInt("type", OT_ERROR);
            response.putString("message", e.getMessage());
            sendEvent(response);
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
     * 弹出通知栏权限弹窗（仅一次）
     */
    @ReactMethod
    public void requestNotificationPermission() {
        HeytapPushManager.requestNotificationPermission();
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

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("OT_REGISTER", OT_REGISTER);
        constants.put("OT_UN_REGISTER", OT_UN_REGISTER);
        constants.put("OT_GET_PUSH_STATUS", OT_GET_PUSH_STATUS);
        constants.put("OT_GET_NOTIFICATION_STATUS", OT_GET_NOTIFICATION_STATUS);
        constants.put("OT_SET_PUSH_TIME", OT_SET_PUSH_TIME);
        constants.put("OT_ERROR", OT_ERROR);
        return constants;
    }
}