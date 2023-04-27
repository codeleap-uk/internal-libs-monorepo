import chalk from "chalk"

let _logLevel: LogLevels = 'info'

const logLevels = ['silent','error', 'warning', 'info', 'verbose'] as const

export type LogLevels = typeof logLevels[number] 

export function LogLevel(level: LogLevels) {
  if (!logLevels.includes(level)) {
      throw new Error(`Invalid log level: "${level}"`)
  }

  return level
}

function log(level: LogLevels, ...args: any[]) {
  if(_logLevel === 'silent') return
  
  if (logLevels.indexOf(level) <= logLevels.indexOf(_logLevel)) {
      const applyColors = {
        error: chalk.red,
        warning: chalk.yellow,
        info: chalk.blue,
        verbose: chalk.green
      }[level]

      const consoleFn = {
        error: console.error,
        warning: console.warn,
        info: console.info,
        verbose: console.log
      }[level]
      const content = [`[CODELEAP ${level}]`,...args]
      consoleFn(
        applyColors(...content)
      )
  }
}
type LoggerOptions = {
  prefixes?: any[]
}

const defaultOptions: LoggerOptions = {
  prefixes: [],
}
export class Logger {
  options: LoggerOptions = defaultOptions

  constructor(options: LoggerOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  error(...args: any[]) {
    log('error', ...this.options.prefixes, ...args)
  }

  warning(...args: any[]) {
    log('warning', ...this.options.prefixes, ...args)
  }

  info(...args: any[]) {
    log('info', ...this.options.prefixes, ...args)
  }

  verbose(...args: any[]) {
    log('verbose', ...this.options.prefixes, ...args)
  }

  setLevel(level: LogLevels) {
    _logLevel = level
  }

  branch(options?: LoggerOptions) {
    return new Logger({
      ...this.options,
      ...options,
      prefixes: [...this.options.prefixes, ...options?.prefixes || []],
    })
  }
}

export const logger = new Logger()
