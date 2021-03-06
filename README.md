
# react-native-oppo-push

[![npm version](https://img.shields.io/npm/v/react-native-oppo-push.svg)](https://www.npmjs.com/package/react-native-oppo-push)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

react-native-oppo-push 使用 [OPPO PUSH 客户端SDK接口文档（2.1.0版本）](https://open.oppomobile.com/wiki/doc#id=10704)，适配最新 Android 10（Android Q）的 OPPO 手机厂商推送，系统级触达，无拦截，亿级推送能力。

## 安装

```
$ yarn add react-native-oppo-push
```

### Link

- **React Native 0.60+**

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) 在构建应用时已自动链接此模块。 

- **React Native <= 0.59**

```bash
$ react-native link react-native-oppo-push
```

### Android 配置

在 `AndroidManifest.xml` 文件中添加以下配置：

```
<application
    ...
    android:allowBackup="true"
    ...>
    <meta-data android:name="oppo_app_id" android:value="在 OPPO 推送平台的 AppId" />
    <meta-data android:name="oppo_app_key" android:value="在 OPPO 推送平台的 AppKey" />
    <meta-data android:name="oppo_app_secret" android:value="在 OPPO 推送平台的 AppSecret" />
    <meta-data android:name="oppo_channel_id" android:value="在 OPPO 推送平台配置的通道ID" />
    <meta-data android:name="oppo_channel_name" android:value="在 OPPO 推送平台配置的通道名称" />
    <meta-data android:name="oppo_channel_description" android:value="在 OPPO 推送平台配置的通道描述" />
    ...
</application>
```

Android 8.0（API ≥ 26），需要配置通道，[参考 OPPO 文档](https://open.oppomobile.com/wiki/doc#id=10289)

## 使用

```javascript
import { OppoPush,
    OPPOPushEmitter,
    OT_REGISTER,
    OT_UN_REGISTER,
    OT_GET_PUSH_STATUS,
    OT_GET_NOTIFICATION_STATUS,
    OT_SET_PUSH_TIME,
    OT_ERROR } from "react-native-oppo-push";
```

## API 和使用示例

  - [init](#init)
  - [getRegister](#getRegister)
  - [unRegister](#unRegister)
  - [requestNotificationPermission](#requestNotificationPermission)
  - [isSupportPush](#isSupportPush)
  - [openNotificationSettings](#openNotificationSettings)
  - [getPushStatus](#getPushStatus)
  - [getNotificationStatus](#getNotificationStatus)
  - [pausePush](#pausePush)
  - [resumePush](#resumePush)
  - [getPushVersionCode](#getPushVersionCode)
  - [getPushVersionName](#getPushVersionName)
  - [getSDKVersion](#getSDKVersion)
  - [setPushTime](#setPushTime)
  - [constants](#constants)
  - [OPPOPushEmitter](#OPPOPushEmitter)

### `init`

初始化 OPPO PUSH 服务，创建默认通道。

**定义**:

```js
init(): void
```

**Example**:

```js
OppoPush.init();
```

### `getRegister`

获取注册OPPO PUSH推送服务的注册ID

**定义**:

```js
getRegister(): void
```

**Example**:

```js
OppoPush.getRegister();
```

### `unRegister`

注销注册OPPO PUSH推送服务

**定义**:

```js
unRegister(): void
```

**Example**:

```js
OppoPush.unRegister();
```

### `requestNotificationPermission`

弹出通知栏权限弹窗（仅一次）

**定义**:

```js
requestNotificationPermission(): void
```

**Example**:

```js
OppoPush.requestNotificationPermission();
```

### `isSupportPush`

判断手机平台是否支持 OPPO PUSH 服务

**定义**:

```js
isSupportPush(): Promise
```

**Returns**:

`Promise` 对象。如果支持，为 `true`，否则为 `false`

**Example**:

```js
OppoPush.isSupportPush().then(data => {
    console.log("【isSupportPush】" + data);
});
```

### `openNotificationSettings`

打开通知栏设置界面

**定义**:

```js
openNotificationSettings(): void
```

**Example**:

```js
OppoPush.openNotificationSettings();
```

### `getPushStatus`

获取 OPPO PUSH 推送服务状态

**定义**:

```js
getPushStatus(): void
```

**Example**:

```js
OppoPush.getPushStatus();
```

### `getNotificationStatus`

获取通知栏状态

**定义**:

```js
getNotificationStatus(): void
```

**Example**:

```js
OppoPush.getNotificationStatus();
```

### `pausePush`

暂停接收 OPPO PUSH 服务推送的消息

**定义**:

```js
pausePush(): void
```

**Example**:

```js
OppoPush.pausePush();
```

### `resumePush`

恢复接收OPPO PUSH服务推送的消息，这时服务器会把暂停时期的推送消息重新推送过来

**定义**:

```js
resumePush(): void
```

**Example**:

```js
OppoPush.resumePush();
```

### `getPushVersionCode`

获取OPPO PUSH推送服务MCS版本（例如"1701"）

**定义**:

```js
getPushVersionCode(): Promise
```

**Returns**:

包含的 OPPO PUSH 的MCS版本的 `Promise` 对象，例如 `1701`

**Example**:

```js
OppoPush.getPushVersionCode().then(code => {
    console.log(code);
});
```

### `getPushVersionName`

获取 OPPO PUSH 推送服务MCS名称（例如"1.7.1"）

**定义**:

```js
getPushVersionName(): Promise
```

**Returns**:

包含的 OPPO PUSH 的MCS名称的 `Promise` 对象，例如 `"1.7.1"`

**Example**:

```js
OppoPush.getPushVersionName().then(name => {
    console.log(name);
});
```

### `getSDKVersion`

获取 OPPO PUSH 推送服务SDK版本（例如"2.1.0"）

**定义**:

```js
getSDKVersion(): Promise
```

**Returns**:

包含的 OPPO PUSH 的 SDK 版本的 `Promise` 对象，例如 `"2.1.0"`

**Example**:

```js
OppoPush.getSDKVersion().then(sdk => {
    console.log(sdk);
});
```

### `setPushTime`

设置允许推送时间

**定义**:

```js
setPushTime(params: object): void
```

**Returns**:

`Promise` 对象

**Example**:

```js
let params = {
    weekDays: [0, 1, 5],    // 周日为0，周一为1,以此类推
    startHour: 0,           // 开始小时，24小时制
    startMin: 0,            // 开始分钟
    endHour: 23,            // 结束小时，24小时制
    endMin: 59              // 结束分钟
};
OppoPush.setPushTime(params).catch(error => {
    console.log(error);
});
```

### `constants`

该常量用于事件订阅返回的数据类型

**定义**:

```js
OT_REGISTER                     // 注册
OT_UN_REGISTER                  // 注销
OT_GET_PUSH_STATUS              // 推送状态
OT_GET_NOTIFICATION_STATUS      // 通知状态
OT_SET_PUSH_TIME                // 设置推送时间
OT_ERROR                        // 错误
```

### `OPPOPushEmitter`

用于事件订阅

**Example**:

```js
export default class App extends Component {
    constructor(props) {
        super(props);
        this.onOPPOPushListener = this._onOPPOPushListener.bind(this);
    }
    
    componentDidMount() {
        OPPOPushEmitter.on("OPPO_Push_Response", this.onOPPOPushListener);
    }

    componentWillUnmount() {
        OPPOPushEmitter.removeListener('OPPO_Push_Response', this.onOPPOPushListener);
    }
    
    _onOPPOPushListener(data) {
        let text = "";
        if (data != null) {
            let {code, data, status, message, type} = data;
            switch(type) {
                case OT_REGISTER:
                    if (code == 0) {
                        text = "【注册成功】registerId：" + data;
                    } else {
                        text = "【注册失败】code=" + code;
                    }
                    break;
                case OT_UN_REGISTER:
                    if (code == 0) {
                        text = "【注销成功】code=" + code;
                    } else {
                        text = "【注销失败】code=" + code;
                    }
                    break;
                case OT_GET_PUSH_STATUS:
                    if (code == 0 && status == 0) {
                        text = `【Push状态正常】code=${code},status=${status}`;
                    } else {
                        text = `【Push状态错误】code=${code},status=${status}`;
                    }
                    break;
                case OT_GET_NOTIFICATION_STATUS:
                    if (code == 0 && status == 0) {
                        text = `【通知状态正常】code=${code},status=${status}`;
                    } else {
                        text = `【通知状态错误】code=${code},status=${status}`;
                    }
                    break;
                case OT_SET_PUSH_TIME:
                    text = `【SetPushTime】code=${code},result:${data}`;
                    break;
                case OT_ERROR:
                    text = message;
                    break;
            }
        }
        console.log(text);
    }
}
```

## Demo

- Demo 代码参考 [example](https://github.com/caipeiming/react-native-oppo-push/tree/master/example)

- 安卓手机也可以直接下载并安装已编译的 [apk](https://github.com/caipeiming/react-native-oppo-push/releases)