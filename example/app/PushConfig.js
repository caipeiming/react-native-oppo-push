import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableHighlight, ToastAndroid} from 'react-native';
import {OppoPush, OPPOPushEmitter, OT_REGISTER} from "react-native-oppo-push";
import DateTimePicker from '@react-native-community/datetimepicker';
import PushTimeData, {KEY_PUSH_DAYS_IN_WEEK, KEY_PUSH_TIME_SLOT} from './PushTimeData';

export default class PushConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0
        }
        this.pausePush = this._pausePush.bind(this);
        this.resumePush = this._resumePush.bind(this);
        this.onWeekdayPress = this._onWeekdayPress.bind(this);
        this.onStartTimeChange = this._onStartTimeChange.bind(this);
        this.onEndTimeChange = this._onEndTimeChange.bind(this);
    }

    componentDidMount() {
    }

    _pausePush() {
        this.showLog("【点击Button】暂停推送");
        OppoPush.pausePush();
    }

    _resumePush() {
        this.showLog("【点击Button】恢复推送");
        OppoPush.resumePush();
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

    _onWeekdayPress(day, selected) {
        let days = PushTimeData.getDays();
        if (!selected && days.length == 1 && days.indexOf(day) != -1) {
            ToastAndroid.show("请至少选择1天", ToastAndroid.LONG);
            return;
        }
        this.toggleWeekday(day, selected);
        selected ? PushTimeData.pushWeekday(day) : PushTimeData.removeWeekday(day);
        this.setPushTime();
    }

    toggleWeekday(day, flag) {
        this.refs["weekBtn" + day] && this.refs["weekBtn" + day].toggleSelected(flag);
    }

    _onStartTimeChange(hour, min) {
        let times = PushTimeData.getTimes();
        let {endHour, endMin} = times;
        let res = this.checkTime(hour, min, endHour, endMin);
        if (!res) {
            return;
        }
        times.startHour = hour;
        times.startMin = min;
        let text = this.getTimeText(hour, min);
        this._startTime && this._startTime.setText(text);
        PushTimeData.saveTime(times);
        this.setPushTime();
    }

    _onEndTimeChange(hour, min) {
        let times = PushTimeData.getTimes();
        let {startHour, startMin} = times;
        let res = this.checkTime(startHour, startMin, hour, min);
        if (!res) {
            return;
        }
        times.endHour = hour;
        times.endMin = min;
        let text = this.getTimeText(hour, min);
        this._endTime && this._endTime.setText(text);
        PushTimeData.saveTime(times);
        this.setPushTime();
    }

    checkTime(startHour, startMin, endHour, endMin) {
        let start = "" + startHour + this.pad(startMin);
        let end = "" + endHour + this.pad(endMin);
        if (parseInt(start) >= parseInt(end)) {
            ToastAndroid.show("结束时间不能大于开始时间", ToastAndroid.LONG);
            return false;
        }
        return true;
    }

    getDate(hour, min) {
        let date = new Date();
        date.setHours(hour, min);
        return date
    }

    pad(n) {
        return n < 10 ? '0' + n : n;
    }

    getTimeText(hour, min) {
        return this.pad(hour) + ":" + this.pad(min);
    }

    isWeekBtnSelected(day) {
        return PushTimeData.getDays().indexOf(day) != -1;
    }

    setPushTime() {
        let days = PushTimeData.getDays();
        let times = PushTimeData.getTimes();
        if (days.length == 0) {
            ToastAndroid.show("请至少选择1天", ToastAndroid.LONG);
            return;
        }
        let {startHour, startMin, endHour, endMin} = times;
        if (!this.checkTime(startHour, startMin, endHour, endMin)) {
            return;
        }
        this.showLog("【点击Button】设置推送时间");
        let params = {
            days,
            startHour,
            startMin,
            endHour,
            endMin
        };
        // return;
        OppoPush.setPushTime(params);
    }

    render() {
        if (this.state.position) {
            return 
        }
        let key = 0;
        let views = [
            this.showBtn(key++, "暂停推送", this.pausePush),
            this.showBtn(key++, "恢复推送", this.resumePush),
            this.showBtn(key++, "清空控制台", this.props.clearLog),
        ];
        let {startHour, startMin, endHour, endMin} = PushTimeData.getTimes();
        return (
            <View style={{paddingTop: 8, paddingLeft: 8, paddingRight: 8}}>
                <Text style={styles.label}>每周可接受消息时间</Text>
                <View style={{flexDirection: 'row', flexWrap: "wrap", paddingTop: 8}}>
                    <WeekBtn ref="weekBtn1" title="周一" value={1} selected={this.isWeekBtnSelected(1)} onWeekdayPress={this.onWeekdayPress} />
                    <WeekBtn ref="weekBtn2" title="周二" value={2} selected={this.isWeekBtnSelected(2)} onWeekdayPress={this.onWeekdayPress} />
                    <WeekBtn ref="weekBtn3" title="周三" value={3} selected={this.isWeekBtnSelected(3)} onWeekdayPress={this.onWeekdayPress} />
                    <WeekBtn ref="weekBtn4" title="周四" value={4} selected={this.isWeekBtnSelected(4)} onWeekdayPress={this.onWeekdayPress} />
                    <WeekBtn ref="weekBtn5" title="周五" value={5} selected={this.isWeekBtnSelected(5)} onWeekdayPress={this.onWeekdayPress} />
                    <WeekBtn ref="weekBtn6" title="周六" value={6} selected={this.isWeekBtnSelected(6)} onWeekdayPress={this.onWeekdayPress} />
                    <WeekBtn ref="weekBtn0" title="周日" value={0} selected={this.isWeekBtnSelected(0)} onWeekdayPress={this.onWeekdayPress} />
                </View>
                <Text style={[styles.label, {paddingTop: 8, paddingBottom: 8}]}>每天可接受消息时间</Text>
                <View style={{borderWidth: 1, borderRadius: 5, flexDirection: "row", height: 40, alignItems: "center"}}>
                    <TouchableHighlight underlayColor="transparent" style={{flex: 1, alignItems: "flex-end", paddingRight: 10}} onPress={() => {
                        let {startHour, startMin} = PushTimeData.getTimes();
                        let date = this.getDate(startHour, startMin);
                        this._timePicker && this._timePicker.show(date, this.onStartTimeChange);
                    }}>
                        <TextView ref={ele => this._startTime = ele} text={this.getTimeText(startHour, startMin)} />
                    </TouchableHighlight>
                    <Text style={{fontSize: 20, color: "#696868"}}>-</Text>
                    <TouchableHighlight underlayColor="transparent" style={{flex: 1, paddingLeft: 10}} onPress={() => {
                        let {endHour, endMin} = PushTimeData.getTimes();
                        let date = this.getDate(endHour, endMin);
                        this._timePicker && this._timePicker.show(date, this.onEndTimeChange);
                    }}>
                        <TextView ref={ele => this._endTime = ele} text={this.getTimeText(endHour, endMin)} />
                    </TouchableHighlight>
                </View>
                <View style={{flexDirection: 'row', flexWrap: "wrap", paddingTop: 8}}>
                    {views}
                </View>
                <TimePickerView ref={ele => this._timePicker = ele} value={new Date()} />
            </View>
        );
    }
}

class TimePickerView extends Component {
    constructor(props) {
        super(props);
        this.value = props.value;
        this.onChange = props.onChange;
        this.state = {
            show: false,
        };
    }

    show(value, onChange) {
        this.value = value;
        this.onChange = onChange;
        this.setState({
            show: true
        });
    }

    render() {
        if (!this.state.show) {
            return null;
        }
        return (
            <DateTimePicker mode="time" value={this.value} is24Hour={true} display="default" onChange={event => {
                let {timestamp} = event.nativeEvent;
                if (timestamp == null) {
                    return;
                }
                let date = new Date();
                date.setTime(timestamp);
                this.onChange && this.onChange(date.getHours(), date.getMinutes());
            }} />
        );
    }
}

class WeekBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected ? true : false,
        };
    }

    toggleSelected(selected) {
        this.setState({selected});
    }

    render() {
        let {title, onWeekdayPress, value} = this.props;
        let {selected} = this.state;
        let color = selected ? "#15a659" : "#696868";
        return (
            <TouchableHighlight style={{marginRight: 6}} onPress={() => {
                onWeekdayPress && onWeekdayPress(value, !selected);
            }}>
                <View style={styles.weekWrap}>
                    <View style={styles.weekBtn}>
                        <Text style={[styles.weekLabel, {color}]}>{title}</Text>
                    </View>
                    <View style={{backgroundColor: color, height: 3, width: 40}} />
                </View>
            </TouchableHighlight>
        );
    }
}

class TextView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text
        }
    }

    setText(text){
        this.setState({text});
    }

    render() {
        let {text} = this.state;
        if (text == null) {
            return null;
        }
        return (
            <Text style={[styles.weekLabel]}>{text}</Text>
        );
    }
}

const styles = StyleSheet.create({
    touchableHighlight: {marginRight: 8, marginBottom: 8},
    btn: {paddingLeft: 10, paddingRight: 10, height: 40, justifyContent: "center", backgroundColor: "#f2f2f2", margin: 0},
    btnText: {fontSize: 15, color: "#15a659"},
    label: {color: "#8c8b8b", textAlign: "center"},
    weekWrap: {backgroundColor: "#f2f2f2", width: 40, height: 60, alignItems: "center"},
    weekLabel: {fontSize: 15, fontSize: 15},
    weekBtn: {width: 18, paddingTop: 8, flex: 1, justifyContent: "center"},
});