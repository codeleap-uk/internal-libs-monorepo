import { Logger, LoggerTypes } from '@codeleap/common'
import { Settings } from './Settings'
// import crashlytics from '@react-native-firebase/crashlytics'

export const logger = new Logger(Settings, [], null)

// @ts-ignore
global.logger = logger
