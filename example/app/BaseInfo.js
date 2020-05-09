import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import {OppoPush, OPPOPushEmitter, OT_REGISTER} from "react-native-oppo-push";

export default class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0
        }
        this.register = this._register.bind(this);
        this.unRegister = this._unRegister.bind(this);
        this.isSupportPush = this._isSupportPush.bind(this);
        this.getRegister = this._getRegister.bind(this);
        this.openNotificationSettings = this._openNotificationSettings.bind(this);
        this.getPushStatus = this._getPushStatus.bind(this);
        this.getNotificationStatus = this._getNotificationStatus.bind(this);
        this.getVersion = this._getVersion.bind(this);
    }

    _register() {
        this.showLog("【点击Button】应用注册");
        OppoPush.getRegister();
    }

    _unRegister() {
        this.showLog("【点击Button】应用注销");
        OppoPush.unRegister();
    }

    _isSupportPush() {
        this.showLog("【点击Button】检查OPUSH");
        OppoPush.isSupportPush().then(data => {
            this.showLog("【isSupportPush】" + data);
        });
    }

    _getRegister() {
        OppoPush.getRegister();
        this.showLog("【点击Button】检查注册ID");
    }

    _openNotificationSettings() {
        OppoPush.openNotificationSettings();
        this.showLog("【点击Button】通知栏设置");
    }

    _getPushStatus() {
        OppoPush.getPushStatus();
        this.showLog("【点击Button】推送服务状态");
    }

    _getNotificationStatus() {
        OppoPush.getNotificationStatus();
        this.showLog("【点击Button】通知栏状态");
    }

    async _getVersion() {
        this.showLog("【点击Button】版本信息");
        try {
            let code = await OppoPush.getPushVersionCode()
            let name = await OppoPush.getPushVersionName()
            let sdk = await OppoPush.getSDKVersion()
            let str = `McsVerCode:${code},McsVerName:${name},SdkVer:${sdk}`;
            this.showLog(`【Version】${str}`);
        } catch (error) {
            this.showLog(error.message);
        };
    }

    showLog(data) {
        let {showLog} = this.props;
        showLog && showLog(data);
    }

    showBtn(key, label, action) {
        return (
            <TouchableHighlight key={key} style={styles.touchableHighlight} onPress={action}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>{label}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        if (this.state.position) {
            return 
        }
        let key = 0;
        let views = [
            this.showBtn(key++, "应用注册", this.register),
            this.showBtn(key++, "应用注销", this.unRegister),
            this.showBtn(key++, "检查OPUSH", this.isSupportPush),
            this.showBtn(key++, "检查注册ID", this.getRegister),
            this.showBtn(key++, "通知栏设置", this.openNotificationSettings),
            this.showBtn(key++, "推送服务状态", this.getPushStatus),
            this.showBtn(key++, "通知栏状态", this.getNotificationStatus),
            this.showBtn(key++, "版本信息", this.getVersion),
            this.showBtn(key++, "清空控制台", this.props.clearLog),
        ];
        return (
            <View style={{flexDirection: 'row', flexWrap: "wrap", paddingTop: 8, paddingLeft: 10, paddingRight: 10}}>
                {views}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    touchableHighlight: {marginRight: 8, marginBottom: 8},
    btn: {paddingLeft: 10, paddingRight: 10, height: 40, justifyContent: "center", backgroundColor: "#f2f2f2", margin: 0},
    btnText: {fontSize: 15, color: "#15a659"},
});