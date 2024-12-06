import { inspect } from 'util'
import { AppSettings } from '@codeleap/common'
import { TypeGuards } from '@codeleap/types'
import { Analytics } from './Analytics'
import { SentryService } from './Sentry'
import { SlackService } from './Slack'
import {
  LogToTerminal,
  LogFunctionArgs,
  LogType,
  LogToTerminalArgs,
  LoggerMiddleware,
} from './types'

const logLevels: LogType[] = ['debug', 'info', 'log', 'warn', 'error']

const emptyFunction = () => { }

const hollowAnalytics = new Analytics({
  init: emptyFunction,
  onEvent: emptyFunction,
  onInteraction: emptyFunction,
  prepareData: () => ({}),
}, {})

export class Logger {
  static settings: AppSettings

  settings: AppSettings

  sentry: SentryService

  slack: SlackService

  middleware: LoggerMiddleware[] = []

  constructor(settings: AppSettings, middleware?: LoggerMiddleware[], public analytics?: Analytics) {
    this.settings = settings
    this.middleware = middleware || []
    if (settings.Logger.isMain) {
      Logger.settings = settings
    }

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

    this.slack = new SlackService(settings)

    if (!analytics) {
      this.analytics = hollowAnalytics
    }

    this.analytics.onError((err) => {
      this.logToTerminal({
        logType: 'error',
        args: ['Error on analytics event', err, 'Internal'],
      })
    })

  }

  static formatContent(logArgs: LogToTerminalArgs) {
    const { logType, args: content, deviceIdentifier: deviceId, stringify, logKeys = true } = logArgs

    const [descriptionOrValue, value, category] = content

    const nArgs = content.length
    let logContent = content

    const logValue = nArgs === 1 ? descriptionOrValue : value

    const shouldStringify = stringify && !!logValue && TypeGuards.isObject(logValue) && !(logValue instanceof Error)
    const inspectOptions = Logger?.settings?.Logger?.inspect || {}

    // @ts-expect-error interface merging sucks
    const displayValue = shouldStringify ? inspect(logValue, {
      depth: 5,
      showHidden: true,
      ...inspectOptions,
    }) : logValue

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
      const isObj = typeof descriptionOrValue === 'object' && !(descriptionOrValue instanceof Error)
      const keys = isObj ? Object.keys(descriptionOrValue) : null
      const title = isObj && keys.length && logKeys ?
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

    return logContent
  }

  static coloredLog: LogToTerminal = (logArgs) => {
    const { logType, args: content, deviceIdentifier: deviceId, stringify } = logArgs

    const logContent = Logger.formatContent(logArgs)

    const displayLog = logType === 'error' ? 'warn' : logType

    console[displayLog](deviceId, ...logContent)

    return logContent
  }

  private logToTerminal: LogToTerminal = (logArgs) => {
    const { logType, args, color } = logArgs

    if (this.settings.Logger.Level === 'silent') return

    const shouldLog = TypeGuards.isString(this.settings.Logger.Level) ?
      logLevels.indexOf(logType) >=
      logLevels.indexOf(this.settings.Logger.Level) : this.settings.Logger.Level.includes(logType)
    if (!shouldLog) return

    const content = Logger.formatContent(logArgs)

    if (this.settings.Environment.IsDev) {

      const deviceId = this.settings.Logger?.DeviceIdentifier ?
        `[${this.settings.Logger.DeviceIdentifier}]` : ''

      const stringify = this.settings.Logger?.StringifyObjects

      this.middleware.forEach(m => m(logArgs, content))

      Logger.coloredLog(
        {
          logType: logType as LogType,
          args,
          color,
          deviceIdentifier: deviceId,
          stringify,
        },
      )

    }

    if (!this.settings.Environment.IsDev || this.settings.Logger.alwaysSendToSentry) {
      try {

        this.middleware.forEach(m => m(logArgs, content))
        if (['info', 'log'].includes(logType)) {

          this.sentry.captureBreadcrumb(
            logType,
            content,
          )
        }
        if (['error'].includes(logType)) {
          this.sentry.sendLog(args?.[1] || args?.[0])
        }
      } catch (e) {
        // Nothing
      }
    }
  }

  info(...args: LogFunctionArgs) {
    this.logToTerminal({
      args,
      logType: 'info',
    })
  }

  error(...args: LogFunctionArgs) {
    this.logToTerminal({
      args,
      logType: 'error',
    })
  }

  warn(...args: LogFunctionArgs) {
    this.logToTerminal({
      args,
      logType: 'warn',
    })
  }

  log(...args: LogFunctionArgs) {
    this.logToTerminal({
      args,
      logType: 'log',
    })
  }

  debug(...args: LogFunctionArgs) {
    this.logToTerminal({
      args,
      logType: 'debug',
    })
  }
}
