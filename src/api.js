import { OppoPushModule } from './native-module';

class Api {
    /**
     * 初始化 oppo push
     */
    init() {
        OppoPushModule.init();
    }

    /**
     * 应用注册
     */
    getRegister() {
        OppoPushModule.getRegister();
    }

    /**
     * 应用注销
     */
    unRegister() {
        OppoPushModule.unRegister();
    }

    /**
     * 是否支持 OPPO PUSH
     * @return {[type]} Promise
     */
    isSupportPush() {
        return OppoPushModule.isSupportPush();
    }

    /**
     * 通知栏设置
     */
    openNotificationSettings() {
        OppoPushModule.openNotificationSettings();
    }

    /**
     * 获取OPPO PUSH推送服务状态
     */
    getPushStatus() {
        OppoPushModule.getPushStatus();
    }

    /**
     * 获取通知栏状态
     */
    getNotificationStatus() {
        OppoPushModule.getNotificationStatus();
    }

    /**
     * 暂停接收OPPO PUSH服务推送的消息
     */
    pausePush() {
        OppoPushModule.pausePush();
    }

    /**
     * 恢复接收OPPO PUSH服务推送的消息，这时服务器会把暂停时期的推送消息重新推送过来
     */
    resumePush() {
        OppoPushModule.resumePush();
    }

    /**
     * 获取OPPO PUSH推送服务MCS版本（例如"1701"）
     * @return {[type]} Promise
     */
    getPushVersionCode() {
        return OppoPushModule.getPushVersionCode();
    }

    /**
     * 获取OPPO PUSH推送服务MCS名称（例如"1.7.1"）
     * @return {[type]} Promise
     */
    getPushVersionName() {
        return OppoPushModule.getPushVersionName();
    }

    /**
     * 获取OPPO PUSH推送服务SDK版本（例如"2.1.0"）
     * @return {[type]} Promise
     */
    getSDKVersion() {
        return OppoPushModule.getSDKVersion();
    }
}

export const OppoPush = new Api();