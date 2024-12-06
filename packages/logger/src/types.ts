import { FunctionType } from '@codeleap/common'
import { colors, foregroundColors } from './constants'

import type { SeverityLevel, Client, ClientOptions, Breadcrumb } from '@sentry/types'

export type LogType = 'info' | 'debug' | 'warn' | 'error' | 'log' | 'silent'

export type LogFunctionArgs = [
    description?: any,
    value?:any,
    category?:string
]
export type ConsoleColor = keyof typeof colors
export type DebugColors = {
  [Property in keyof typeof foregroundColors as `${Lowercase<
    string & Property
  >}`]: (...args: LogFunctionArgs) => void;
}
export type DebugColor = keyof DebugColors
export type LogToTerminalArgs = {
  logType: LogType
  args: LogFunctionArgs
  color?: keyof DebugColors
  deviceIdentifier?: string
  stringify?: boolean
  logKeys?: boolean
}
export type LogToTerminal = FunctionType<[LogToTerminalArgs], void>

export const SentrySeverityMap: Record<LogType, SeverityLevel> = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  log: 'log',
  warn: 'warning',
  silent: 'log',
}

export type SentryProvider = {
  addBreadcrumb: FunctionType<[Breadcrumb], void>
  init(options: ClientOptions): Client
  captureException(err: any): void
}

export type LoggerMiddleware = FunctionType<[arguments: LogToTerminalArgs, formattedContent: string[]], any>
