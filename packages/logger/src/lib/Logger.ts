import { SentryService } from './Sentry'
import { appSettings } from './Settings'
import { SlackService } from './Slack'
import { inspectRender } from './performance'

export class Logger {
  static initialized = false

  slack: SlackService

  sentry: SentryService

  perf = {
    inspectRender,
  }

  private overrideConsoleMethod(args: unknown[], originalConsole: Console['log']) {
    const ignoreLogs = appSettings.config.Logger.ignoreLogs
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

  initialize() {
    if (Logger.initialized) return

    Logger.initialized = true

    this.sentry = new SentryService()

    this.slack = new SlackService()
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