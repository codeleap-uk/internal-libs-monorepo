import { AppSettings } from '../../config/Settings'
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

/**
 * [[include:Logger.md]]
 */
export class Logger {
  settings: AppSettings;

  debug: DebugColors;

  sentry: SentryService;

  middleware:LoggerMiddleware[] = []

  constructor(settings: AppSettings, middleware?: LoggerMiddleware[]) {
    this.settings = settings
    this.middleware = middleware || []
    this.debug = initializeDebugLoggers(this.logToTerminal, settings)
    this.sentry = new SentryService(settings)
  }

  static coloredLog: LogToTerminal = (...logArgs) => {
    const [logType, args, color, deviceIdentifier] = logArgs
    let cl = logColors[logType]
    let useColor = colors[cl]

    if (color) {
      cl = color as keyof typeof foregroundColors
      useColor = colors[color]
    }

    const useCSS = typeof window !== 'undefined'

    if (useCSS) {
      // eslint-disable-next-line no-console
      const logStr = `[${logType.toUpperCase()}]${deviceIdentifier} ${args?.[2]} - ${args?.[0]}`
      console[logType](logStr, args[1])
    } else {
      const logDescription = 
        [typeof args?.[0], typeof args?.[2]]
          .every(t => t === 'string') ? `${args?.[2]||''} - ${args?.[0]||''}` : args?.[0] || ''
      // eslint-disable-next-line no-console
      console[logType](
        useColor,
        `[${logType.toUpperCase()}]${deviceIdentifier} 
          ${logDescription}
        `,
        args[1],
        colors.Reset,
      )
    }
  };

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
      Logger.coloredLog(logType, args, color, deviceId)
      this.middleware.forEach(m => m(...logArgs))
    } else {
      try {
        // NOTE: For some reason, sentry throws here sometimes
        this.sentry.captureBreadcrumb(logType, args)
      } catch (e){

      }
      this.middleware.forEach(m => m(...logArgs))
      if (['error', 'warn'].includes(logType)) {
        this.sentry.sendLog()
      }
    }
  };

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
}
