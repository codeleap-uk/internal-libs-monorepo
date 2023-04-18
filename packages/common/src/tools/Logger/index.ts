import { AppSettings } from '../../config/Settings'
import { TypeGuards } from '../../utils'
import { Analytics } from './Analytics'
import { SentryService } from './Sentry'
import {
  LogToTerminal,
  LogFunctionArgs,
  LogType,
  LoggerMiddleware,
} from './types'

export * as LoggerTypes from './types'
export * as LoggerAnalytics from './Analytics'

const logLevels: LogType[] = ['debug', 'info', 'log', 'warn', 'error']

const emptyFunction = () => {}

const hollowAnalytics = new Analytics({
  init: emptyFunction,
  onEvent: emptyFunction,
  onInteraction: emptyFunction,
  prepareData: () => ({}),
}, {})

/**
 * [[include:Logger.md]]
 */
export class Logger {
  settings: AppSettings

  sentry: SentryService

  middleware:LoggerMiddleware[] = []

  constructor(settings: AppSettings, middleware?: LoggerMiddleware[], public analytics?: Analytics) {
    this.settings = settings
    this.middleware = middleware || []

    if (settings?.Logger?.IgnoreWarnings?.length) {
      const newConsole = (args, oldConsole) => {
        const shouldIgnore = typeof args[0] === 'string' &&
          settings.Logger.IgnoreWarnings.some(ignoredWarning => args.join(' ').includes(ignoredWarning))
        if (shouldIgnore) return
        else return oldConsole.apply(console, args)
      }
      const consoles = ['log', 'warn', 'error']


      consoles.forEach(t => {
        const tmp = console[t]
        console[t] = (...args) => newConsole(args, tmp)
      })
    }

    this.sentry = new SentryService(settings)

    if (!analytics) {
      this.analytics = hollowAnalytics
    }

    this.analytics.onError((err) => {
      this.logToTerminal('error', [
        'Error on analytics event',
        err,
        'Internal',
      ])
    })

  }

  static coloredLog:LogToTerminal = (...logArgs) => {
    const [logType, content, _ig_color, deviceId, stringify] = logArgs

    const [descriptionOrValue, value, category] = content

    const nArgs = logArgs[1].length
    let logContent = logArgs[1]

    const logValue = nArgs === 1 ? descriptionOrValue : value
    const displayValue = stringify && !!logValue && typeof logValue === 'object' ? JSON.stringify(logValue, null, 2) : logValue

    if (nArgs === 3) {
      logContent = [
        `(${category}) ${descriptionOrValue}${displayValue ? ' ->' : ''}`,
        displayValue,
      ]
    }

    if (nArgs === 2) {
      logContent = [
        `${descriptionOrValue}${displayValue ? ' ->' : ''}`,
        displayValue,
      ]
    }

    if (nArgs === 1) {
      const isObj = typeof descriptionOrValue === 'object'
      const keys = isObj ? Object.keys(descriptionOrValue) : null
      const title = isObj && keys.length ?
        `${keys.filter(i => !!i).slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''} ->`
        : null

      if (title) {
        logContent = [
          title,
          displayValue,
        ]
      } else {
        logContent = [
          displayValue,
        ]
      }
    }

    // console[logType](`[${logType.toUpperCase()}] ${deviceId ? `${deviceId}` : ''}`, ...logContent)
    const displayLog = logType === 'error' ? 'warn' : logType
    console[displayLog](`${deviceId ? `${deviceId}` : ''}`, ...logContent)
  }

  private logToTerminal: LogToTerminal = (...logArgs) => {
    const [logType, args, color] = logArgs
    if (this.settings.Logger.Level === 'silent') return
    const shouldLog = TypeGuards.isString(this.settings.Logger.Level) ?
      logLevels.indexOf(logType) >=
      logLevels.indexOf(this.settings.Logger.Level) : this.settings.Logger.Level.includes(logType)
    if (!shouldLog) return

    if (this.settings.Environment.IsDev) {

      const deviceId = this.settings.Logger?.DeviceIdentifier ?
        `[${this.settings.Logger.DeviceIdentifier}]` : ''

      const stringify = this.settings.Logger?.StringifyObjects

      this.middleware.forEach(m => m(...logArgs))

      Logger.coloredLog(logType, args, color, deviceId, stringify)

    } else {
      try {
        this.middleware.forEach(m => m(...logArgs))
        // if (['error', 'warn'].includes(logType)) {
        //   this.sentry.sendLog()
        // }
      } catch (e) {
        // Nothing
      }
    }
  }

  info(...args: LogFunctionArgs) {
    this.logToTerminal('info', args)
  }

  error(...args: LogFunctionArgs) {
    this.logToTerminal('error', args)
  }

  warn(...args: LogFunctionArgs) {
    this.logToTerminal('warn', args)
  }

  log(...args: LogFunctionArgs) {
    this.logToTerminal('log', args)
  }

  debug(...args: LogFunctionArgs) {
    this.logToTerminal('debug', args)
  }
}

