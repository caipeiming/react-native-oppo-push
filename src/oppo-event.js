import EventEmitter from 'events';
import { OppoPushModule } from './native-module'

class MyEmitter extends EventEmitter {}

export const OPPOPushEmitter = new MyEmitter();