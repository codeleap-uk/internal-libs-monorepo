import callsites from 'callsites'
import { AppSettings } from '../../config/Settings'
import { Analytics } from './Analytics'
import { foregroundColors, colors, logColors } from './constants'
import { SentryService } from './Sentry'
import {
  DebugColors,
  DebugColor,
  LogToTerminal,
  LogFunctionArgs,
  LogType,
  LoggerMiddleware,
} from './types'
import { makeLogger } from './utils'

export * as LoggerTypes from './types'
export * as LoggerAnalytics from './Analytics'

function initializeDebugLoggers(logToTerminal: LogToTerminal, settings: AppSettings) {
  const logFunctions = []
  for (const logConfig of Object.keys(foregroundColors)) {
    logFunctions.push([
      logConfig.toLowerCase(),
      makeLogger(logConfig as DebugColor, logToTerminal),
    ])
  }
  // ignores some warnings to make shit less annoying
  if (settings?.Environment?.Type !== 'production' && settings?.Logger?.IgnoreWarnings?.length) {
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
  return Object.fromEntries(logFunctions) as DebugColors
}

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

  debug: DebugColors

  sentry: SentryService

  middleware:LoggerMiddleware[] = []

  constructor(settings: AppSettings, middleware?: LoggerMiddleware[], public analytics?: Analytics) {
    this.settings = settings
    this.middleware = middleware || []
    this.debug = initializeDebugLoggers(this.logToTerminal, settings)
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
    const [logType, content, _ig_color, deviceId] = logArgs

    const [descriptionOrValue, value, category] = content

    const nArgs = logArgs[1].length
    let logContent = logArgs[1]

    if (nArgs === 3) {
      logContent = [
        `${category} -> ${descriptionOrValue}`,
        value,
      ]
    }

    console[logType](`[${logType.toUpperCase()}] ${deviceId ? `[${deviceId}]` : ''} - `, ...logContent)
  }

  private logToTerminal: LogToTerminal = (...logArgs) => {
    const [logType, args, color] = logArgs
    if (this.settings.Logger.Level === 'silent') return
    const shouldLog =
      logLevels.indexOf(logType) >=
      logLevels.indexOf(this.settings.Logger.Level)
    if (!shouldLog) return

    if (this.settings.Environment.IsDev) {

      const deviceId = this.settings.Logger?.DeviceIdentifier ?
        `[${this.settings.Logger.DeviceIdentifier}]` : ''

      args[1] = typeof args[1] === 'object' && this.settings.Logger?.StringifyObjects ? JSON.stringify(args[1], null, 2) : args[1]

      Logger.coloredLog(logType, args, color, deviceId)

      this.middleware.forEach(m => m(...logArgs))
    } else {
      try {
        // NOTE: For some reason, sentry throws here sometimes
        this.sentry.captureBreadcrumb(logType, args)
      } catch (e) {

      }
      this.middleware.forEach(m => m(...logArgs))
      if (['error', 'warn'].includes(logType)) {
        this.sentry.sendLog()
      }
    }
  }

  info(...args: LogFunctionArgs) {
    this.logToTerminal('info', args)
  }

  error(...args: LogFunctionArgs) {
    this.logToTerminal('error', args)
    try {
      console.log(callsites())
    } catch (err) {
      console.log(err)
    }
  }

  warn(...args: LogFunctionArgs) {
    this.logToTerminal('warn', args)
  }

  log(...args: LogFunctionArgs) {
    this.logToTerminal('log', args)
  }
}

