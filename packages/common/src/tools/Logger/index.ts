import { AppSettings } from '../../config/Settings'
import { foregroundColors, colors, logColors } from './constants'
import { SentryService } from './Sentry'
import { DebugColors, DebugColor, LogToTerminal, LogFunctionArgs, LogType } from './types'
import { makeLogger } from './utils'

function initializeDebugLoggers(logToTerminal:LogToTerminal) {
  const logFunctions = []
  for (const logConfig of Object.keys(foregroundColors)) {
    logFunctions.push([logConfig.toLowerCase(), makeLogger(logConfig as DebugColor, logToTerminal)])
  }
  return Object.fromEntries(logFunctions) as DebugColors
}

const logLevels:LogType[] = [
  'debug',
  'info',
  'log',
  'warn',
  'error',
]

/**
 * [[include:Logger.md]]
 */
export class Logger {
  settings:AppSettings

  debug:DebugColors

  sentry:SentryService

  constructor(settings:AppSettings) {
    this.settings = settings


    this.debug = initializeDebugLoggers(this.logToTerminal)
    this.sentry = new SentryService(settings)
  }

  static coloredLog:LogToTerminal = (...logArgs) => {
    const [logType, args, color] = logArgs
    let cl = logColors[logType]
    let useColor = colors[cl]


    if (color) {
      cl = color as keyof typeof foregroundColors
      useColor = colors[color]
    }

    const useCSS = typeof window !== 'undefined'

    if (useCSS) {
   
      // eslint-disable-next-line no-console
      console[logType](`[${logType.toUpperCase()}] ${args[2]} - ${args[0]}`,  args[1])
    } else {
      // eslint-disable-next-line no-console
      console[logType](useColor, `[${logType.toUpperCase()}] ${args[2]} - ${args[0]}`, args[1], colors.Reset)
    }
  }

  private logToTerminal: LogToTerminal= (...logArgs) => {
    const [logType, args] = logArgs
    if (this.settings.Logger.Level === 'silent') return
    const shouldLog = logLevels.indexOf(logType) >= logLevels.indexOf(this.settings.Logger.Level)
    if (!shouldLog) return


    if (this.settings.Environment.IsDev) {
      Logger.coloredLog(...logArgs)

    } else {

      this.sentry.captureBreadcrumb(logType, args)

      if (['error', 'warn'].includes(logType)) {
        this.sentry.sendLog()
      }
    }

  }

  info(...args:LogFunctionArgs) {
    this.logToTerminal('info', args)
  }

  error(...args:LogFunctionArgs) {
    this.logToTerminal('error', args)
  }

  warn(...args:LogFunctionArgs) {
    this.logToTerminal('warn', args)
  }


  log(...args:LogFunctionArgs) {
    this.logToTerminal('log', args)
  }
}
