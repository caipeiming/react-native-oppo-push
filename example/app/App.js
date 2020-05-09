import React, { Component } from 'react';
import {SafeAreaView, StyleSheet, FlatList, View, Text, Platform, TouchableHighlight, StatusBar, Dimensions} from 'react-native';
import {OppoPush, OPPOPushEmitter, OT_REGISTER, OT_UN_REGISTER, OT_GET_PUSH_STATUS, OT_GET_NOTIFICATION_STATUS, OT_SET_PUSH_TIME, OT_ERROR} from "react-native-oppo-push";
import BottomNavigationView from './bottom_navigation';
import BaseInfo from './BaseInfo';
import PushConfig from './PushConfig';

const {width: deviceWidth} = Dimensions.get('window');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.isMount = true;
        this.clearLog = this._clearLog.bind(this);
        this.onOPPOPushListener = this._onOPPOPushListener.bind(this);
    }

    componentDidMount() {
        OPPOPushEmitter.on("OPPO_Push_Response", this.onOPPOPushListener);
        OppoPush.init();
    }

    componentWillUnmount() {
        this.isMount = false;
        OPPOPushEmitter.removeListener('OPPO_Push_Response', this.onOPPOPushListener);
    }

    _onOPPOPushListener(data) {
        this.showLog(data);
    }

    showLog(msg) {
        console.log(msg);
        let text;
        if (typeof msg == "string") {
            text = msg;
        } else {
            text = JSON.stringify(msg);
            if (msg.type != null) {
                let {code, data, status, message} = msg;
                switch(msg.type) {
                    case OT_REGISTER:
                        if (code == 0) {
                            text = "【注册成功】registerId：" + data;
                            OppoPush.requestNotificationPermission();
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

                        break;
                    case OT_ERROR:
                        text = message;
                        break;
                }
            }
        }
        this._list && this._list.addLog(text);
    }

    _clearLog() {
        this._list && this._list.clear();
    }

    onMenuItemPress({position}) {
        this._flagment && this._flagment.setPosition(position);
    }

    render() {
        return (
            <SafeAreaView style={styles.fill}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={[styles.fill, {paddingLeft: 5, paddingRight: 5, }]}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.logText}>控制台：</Text>
                    </View>
                    <ResultView ref={ele => this._list = ele} />
                    <FlagmentView ref={ele => this._flagment = ele} showLog={this.showLog.bind(this)} clearLog={this.clearLog} />
                </View>
                <BottomNavigationView style={{height: 50, width: "100%"}} onMenuItemPress={this.onMenuItemPress.bind(this)} />
            </SafeAreaView>
        );
    }
}

class FlagmentView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0
        }
    }

    setPosition(position) {
        if (position == this.state.position) {
            return;
        }
        this.setState({position});
    }

    render() {
        let view = null;
        let {position} = this.state;
        switch (position) {
            case 0:
                view = <BaseInfo {...this.props} />
                break;
            case 1:
                view = <PushConfig {...this.props} />
                break;
        }
        return view;
    }
}

class ResultView extends Component {
    constructor(props) {
        super(props);
        this.keyPrefix = 0;
        this.dataSource = [];
        this.state = {
            reload: 0
        };
        this.timer = null;
        this.isMount = true;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.reload != nextState.reload;
    }

    componentDidUpdate() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.isMount && this._root && this._root.scrollToEnd({ animated: true, duration: 100 });
        }, 100);
    }

    componentWillUnmount() {
        this.isMount = false;
    }

    updateView() {
        this.setState({
            reload: this.state.reload + 1
        });
    }

    clear() {
        this.dataSource = [];
        this.keyPrefix ++;
        this.updateView();
    }

    addLog(text) {
        this.dataSource.push(this.formatDate("yyyy-MM-dd HH:mm:ss") + `\n` + text);
        this.updateView();
    }

    formatDate (format) {
        let date = new Date();
        var pad = function(n) {
            return n < 10 ? '0' + n : n;
        }
        var year = date.getFullYear();
        var yearShort = year.toString().substring(2);
        var month = date.getMonth() + 1;
        var monthPad = pad(month);
        var dateInMonth = date.getDate();
        var dateInMonthPad = pad(dateInMonth);
        var hour = date.getHours();
        var hourPad = pad(hour);
        var minute = date.getMinutes();
        var minutePad = pad(minute);
        var second = date.getSeconds();
        var secondPad = pad(second);
        return format.replace(/yyyy/g, year).replace(/yy/g, yearShort)
                    .replace(/MM/g, monthPad).replace(/M/g, month)
                    .replace(/dd/g, dateInMonthPad).replace(/d/g, dateInMonth)
                    .replace(/HH/g, hourPad).replace(/H/g, hour)
                    .replace(/mm/g, minutePad).replace(/m/g, minute)
                    .replace(/ss/g, secondPad).replace(/s/g, second);
    }

    render() {
        return (
            <FlatList ref={ele => this._root = ele} style={{flex: 1, backgroundColor: "#eee"}} 
                data={this.dataSource}
                keyExtractor={(item, index) => (index + "_" + this.keyPrefix)}
                renderItem={({item}) => {
                    return <Item item={item} />
                }}
            />
        );
    }
}

class Item extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        let {item} = this.props;
        return (
            <Text style={styles.logText}>{item}</Text>
        );
    }
}

const styles = StyleSheet.create({
    fill: {flex: 1, backgroundColor: "#fff"},
    logText: {padding: 5, color: "#333"},
});