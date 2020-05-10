import AsyncStorage from '@react-native-community/async-storage';

export const KEY_PUSH_DAYS_IN_WEEK = "week_days";
export const KEY_PUSH_TIME_SLOT = "time_slot";

class PushTimeData {
    constructor() {
        this.days = [];
        this.times = {startHour: 0, startMin: 0, endHour: 23, endMin: 59};
        AsyncStorage.multiGet([KEY_PUSH_DAYS_IN_WEEK, KEY_PUSH_TIME_SLOT]).then((result, errors) => {
            if (errors) {
                return;
            }
            result != null && result.forEach(row => {
                let key = row[0]
                let value = row[1];
                if (value == null) {
                    return;
                }
                if (key == KEY_PUSH_DAYS_IN_WEEK) {
                    this.days = JSON.parse(value);
                } else if (key == KEY_PUSH_TIME_SLOT) {
                    this.times = JSON.parse(value);
                }
            });
            console.log({days: this.days, times: this.times});
        }).catch(err => {
            console.log(err);
        });
    }

    pushWeekday(day) {
        let index = this.days.indexOf(day);
        if (index != -1) {
            return;
        }
        this.days.push(day);
        this.save(KEY_PUSH_DAYS_IN_WEEK, this.days);
    }

    removeWeekday(day) {
        let index = this.days.indexOf(day);
        if (index == -1) {
            return;
        }
        this.days.splice(index, 1);
        this.save(KEY_PUSH_DAYS_IN_WEEK, this.days);
    }

    saveTime(data) {
        this.times = data;
        this.save(KEY_PUSH_TIME_SLOT, this.times);
    }

    async save(key, data) {
        try {
            let str = JSON.stringify(data)
            await AsyncStorage.setItem(key, str);
        } catch (error) {
            console.log(error);
        }
    }

    getDays() {
        return this.days;
    }

    getTimes() {
        return this.times;
    }
}

const d = new PushTimeData()
export default d;