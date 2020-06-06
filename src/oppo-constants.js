import { Platform } from 'react-native';
import { OppoPushModule } from './native-module'

export const OT_REGISTER = Platform.OS === "ios" ? null : OppoPushModule.OT_REGISTER;
export const OT_UN_REGISTER = Platform.OS === "ios" ? null : OppoPushModule.OT_UN_REGISTER;
export const OT_GET_PUSH_STATUS = Platform.OS === "ios" ? null : OppoPushModule.OT_GET_PUSH_STATUS;
export const OT_GET_NOTIFICATION_STATUS = Platform.OS === "ios" ? null : OppoPushModule.OT_GET_NOTIFICATION_STATUS;
export const OT_SET_PUSH_TIME = Platform.OS === "ios" ? null : OppoPushModule.OT_SET_PUSH_TIME;
export const OT_ERROR = Platform.OS === "ios" ? null : OppoPushModule.OT_ERROR;
