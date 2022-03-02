import { Logger, LoggerTypes } from '@codeleap/common'
import { Settings } from './Settings'
// import crashlytics from '@react-native-firebase/crashlytics'
import { AppAnalytics } from '../services/analytics'

export const logger = new Logger(Settings, [], AppAnalytics)

// @ts-ignore
global.logger = logger
