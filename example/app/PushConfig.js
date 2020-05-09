import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import {OppoPush, OPPOPushEmitter, OT_REGISTER} from "react-native-oppo-push";
import DateTimePicker from '@react-native-community/datetimepicker';

export default class PushConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0
        }
        this.pausePush = this._pausePush.bind(this);
        this.resumePush = this._resumePush.bind(this);
        this.onTimeChange = this._onTimeChange.bind(this);
    }

    _pausePush() {
        this.showLog("【点击Button】暂停推送");
        OppoPush.pausePush();
    }

    _resumePush() {
        this.showLog("【点击Button】恢复推送");
        OppoPush.resumePush();
    }

    _onTimeChange(data) {
        console.log(data);
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
            this.showBtn(key++, "暂停推送", this.pausePush),
            this.showBtn(key++, "恢复推送", this.resumePush),
            this.showBtn(key++, "清空控制台", this.props.clearLog),
        ];
        return (
            <View style={{paddingTop: 8}}>
                <Text style={styles.label}>每周可接受消息时间</Text>
                <View style={{flexDirection: 'row', flexWrap: "wrap", paddingTop: 8, paddingLeft: 8, paddingRight: 8}}>
                    <WeekBtn title="周一" />
                    <WeekBtn title="周二" />
                    <WeekBtn title="周三" />
                    <WeekBtn title="周四" />
                    <WeekBtn title="周五" />
                    <WeekBtn title="周六" />
                    <WeekBtn title="周七" />
                </View>
                <Text style={[styles.label, {paddingTop: 8, paddingBottom: 8}]}>每天可接受消息时间</Text>
                <View style={{borderWidth: 1, borderRadius: 5, flexDirection: "row", height: 40, alignItems: "center"}}>
                    <TouchableHighlight style={{flex: 1, alignItems: "flex-end", paddingRight: 10}} onPress={() => {
                        
                    }}>
                        <Text style={[styles.weekLabel]}>title</Text>
                    </TouchableHighlight>
                    <Text style={{fontSize: 20, color: "#696868"}}>-</Text>
                    <TouchableHighlight style={{flex: 1, paddingLeft: 10}}>
                        <Text style={[styles.weekLabel]}>title</Text>
                    </TouchableHighlight>
                </View>
                <View style={{flexDirection: 'row', flexWrap: "wrap", paddingTop: 8, paddingLeft: 10, paddingRight: 10}}>
                    {views}
                </View>
                <DateTimePicker mode="time" value={new Date()} is24Hour={true} display="default" onChange={this.onTimeChange} />
            </View>
        );
    }
}

class WeekBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    render() {
        let {title} = this.props;
        let {selected} = this.state;
        let color = selected ? "#15a659" : "#696868";
        return (
            <TouchableHighlight style={{marginLeft: 6}} onPress={() => {
                this.setState({
                    selected: !selected
                });
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

const styles = StyleSheet.create({
    touchableHighlight: {marginRight: 8, marginBottom: 8},
    btn: {paddingLeft: 10, paddingRight: 10, height: 40, justifyContent: "center", backgroundColor: "#f2f2f2", margin: 0},
    btnText: {fontSize: 15, color: "#15a659"},
    label: {color: "#8c8b8b", textAlign: "center"},
    weekWrap: {backgroundColor: "#f2f2f2", width: 40, height: 60, alignItems: "center"},
    weekLabel: {fontSize: 15, fontSize: 15},
    weekBtn: {width: 18, paddingTop: 8, flex: 1, justifyContent: "center"},
});