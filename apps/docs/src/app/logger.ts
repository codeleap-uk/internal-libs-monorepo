import { Logger, LoggerTypes } from '@codeleap/common'
import { Settings } from './Settings'
// import crashlytics from '@react-native-firebase/crashlytics'
import { AppAnalytics } from '../services/analytics'

const middlewares:LoggerTypes.LoggerMiddleware[] = [
  // async (type, args) => {
  //   if (type === 'error' && Settings?.Environment?.Type !== 'development'){
  //     const errString = `${args[2]} Error -> ${args[0]} -> ${String(args[1])}`
  //     console.log(errString)
  //     crashlytics().recordError(new Error(errString))
  //   }
  // },
]

export const logger = new Logger(Settings, middlewares, AppAnalytics)
