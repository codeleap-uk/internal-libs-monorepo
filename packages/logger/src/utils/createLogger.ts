
type Level = 'info' | 'debug' | 'error' | 'warn' | 'log'

export type TransportFunction = (level: Level, ...args: unknown[]) => void

type LoggerOptions = {
  transport: TransportFunction[]
}

class CustomLogger {
  static transport: TransportFunction[]

  static applyTransport(level: Level, ...args: unknown[]) {
    CustomLogger.transport.map(fn => {
      fn(level, ...args)
    })
  }

  info(...args: unknown[]) {
    console.info(...args)
    CustomLogger.applyTransport('info', ...args)
  }

  error(...args: unknown[]) {
    console.error(...args)
    CustomLogger.applyTransport('error', ...args)
  }

  warn(...args: unknown[]) {
    console.warn(...args)
    CustomLogger.applyTransport('warn', ...args)
  }

  log(...args: unknown[]) {
    console.log(...args)
    CustomLogger.applyTransport('log', ...args)
  }

  debug(...args: unknown[]) {
    console.debug(...args)
    CustomLogger.applyTransport('debug', ...args)
  }
}

export const createLogger = (options: LoggerOptions) => {
  CustomLogger.transport = options.transport

  return new CustomLogger()
}