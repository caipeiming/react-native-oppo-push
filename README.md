
# react-native-oppo-push

## 安装

### React Native 0.60 或以上

`$ npm install react-native-oppo-push --save`

### React Native 0.59 或以下

`$ react-native link react-native-oppo-push`

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

## `init`

初始化 OPPO PUSH 服务，创建默认通道。只需调用一次，而且应该首先调用，否则以下的接口将无法正常使用。

**定义**:

```js
init(): void
```

**Example**:

```js
OppoPush.init();
```

## `getRegister`

获取注册OPPO PUSH推送服务的注册ID

**定义**:

```js
getRegister(): void
```

**Example**:

```js
OppoPush.getRegister();
```

## `unRegister`

注销注册OPPO PUSH推送服务

**定义**:

```js
unRegister(): void
```

**Example**:

```js
OppoPush.unRegister();
```

## `requestNotificationPermission`

弹出通知栏权限弹窗（仅一次）

**定义**:

```js
requestNotificationPermission(): void
```

**Example**:

```js
OppoPush.requestNotificationPermission();
```

## `isSupportPush`

判断是否手机平台是否支持 OPPO PUSH 服务

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

## `openNotificationSettings`

打开通知栏设置界面

**定义**:

```js
openNotificationSettings(): void
```

**Example**:

```js
OppoPush.openNotificationSettings();
```

## `getPushStatus`

获取 OPPO PUSH 推送服务状态

**定义**:

```js
getPushStatus(): void
```

**Example**:

```js
OppoPush.getPushStatus();
```

## `getNotificationStatus`

获取通知栏状态

**定义**:

```js
getNotificationStatus(): void
```

**Example**:

```js
OppoPush.getNotificationStatus();
```

## `pausePush`

暂停接收 OPPO PUSH 服务推送的消息

**定义**:

```js
pausePush(): void
```

**Example**:

```js
OppoPush.pausePush();
```

## `resumePush`

恢复接收OPPO PUSH服务推送的消息，这时服务器会把暂停时期的推送消息重新推送过来

**定义**:

```js
resumePush(): void
```

**Example**:

```js
OppoPush.resumePush();
```

## `getPushVersionCode`

获取OPPO PUSH推送服务MCS版本（例如"1701"）

**定义**:

```js
getPushVersionCode(): Promise
```

**Returns**:

包含的 OPPO PUSH 的MCS版本的 `Promise` 对象。

**Example**:

```js
OppoPush.getPushVersionCode().then(code => {
    console.log(code);
});
```

## `getPushVersionName`

获取 OPPO PUSH 推送服务MCS名称（例如"1.7.1"）

**定义**:

```js
getPushVersionName(): Promise
```

**Returns**:

包含的 OPPO PUSH 的MCS名称的 `Promise` 对象。

**Example**:

```js
OppoPush.getPushVersionName().then(name => {
    console.log(name);
});
```

## `getSDKVersion`

获取 OPPO PUSH 推送服务SDK版本（例如"2.1.0"）

**定义**:

```js
getSDKVersion(): Promise
```

**Returns**:

包含的 OPPO PUSH 的 SDK 版本的 `Promise` 对象。

**Example**:

```js
OppoPush.getSDKVersion().then(sdk => {
    console.log(sdk);
});
```

## `setPushTime`

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
    days: [0, 1, 5],    // 周日为0，周一为1,以此类推
    startHour: 0,       // 开始小时，24小时制
    startMin: 0,        // 开始分钟
    endHour: 23,        // 结束小时，24小时制
    endMin: 59          // 结束分钟
};
OppoPush.setPushTime(params).catch(error => {
    console.log(error);
});
```

## `constants`

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
