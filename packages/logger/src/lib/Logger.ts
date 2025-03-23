import { LoggerConfig } from '../types'
import { SentryService } from './Sentry'
import { SlackService } from './Slack'
import { PerformanceService } from './performance'

export class Logger {
  static initialized = false

  private config: LoggerConfig

  slack: SlackService

  sentry: SentryService

  perf: PerformanceService

  private overrideConsoleMethod(args: unknown[], originalConsole: Console['log']) {
    if (!Logger.initialized) return

    const ignoreLogs = this.config.Logger.ignoreLogs
    const shouldIgnore = typeof args[0] === 'string' && ignoreLogs.some(ignoredWarning => args.join(' ').includes(ignoredWarning))

    if (shouldIgnore) return

    return originalConsole.apply(console, args)
  }

  constructor() {
    const consoles = ['log', 'warn', 'error']

    consoles.forEach(level => {
      const consoleRef = console[level]
      console[level] = (...args: unknown[]) => this.overrideConsoleMethod(args, consoleRef)
    })
  }

  initialize<T extends LoggerConfig>(config: T) {
    if (Logger.initialized) return

    this.config = config

    this.sentry = new SentryService(config)

    this.slack = new SlackService(config)

    this.perf = new PerformanceService(config)

    Logger.initialized = true
  }

  info(...args: unknown[]) {
    throw new Error('Logger: implement the method "info"')
  }

  error(...args: unknown[]) {
    throw new Error('Logger: implement the method "error"')
  }

  warn(...args: unknown[]) {
    throw new Error('Logger: implement the method "warn"')
  }

  log(...args: unknown[]) {
    throw new Error('Logger: implement the method "log"')
  }

  debug(...args: unknown[]) {
    throw new Error('Logger: implement the method "debug"')
  }
}

export const logger = new Logger()