import { NativeEventEmitter } from 'react-native'
import EventEmitter from 'events';
import { OppoPushModule } from './native-module'

class MyEmitter extends EventEmitter {}

export const OPPOPushEmitter = new MyEmitter();

const nativeEventEmitter = new NativeEventEmitter(OppoPushModule);

nativeEventEmitter.addListener('OPPO_Push_Response', (data) => {
    OPPOPushEmitter.emit('OPPO_Push_Response', data);
});