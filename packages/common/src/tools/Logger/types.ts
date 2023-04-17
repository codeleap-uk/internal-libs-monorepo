import { FunctionType } from '../..'
import { colors, foregroundColors } from './constants'
import { AppSettings } from '../../config/Settings'

import type { SeverityLevel } from '@sentry/browser'
import type * as Sentry from '@sentry/browser'

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
export type LogToTerminalArgs = [
  logType: LogType,
  args: LogFunctionArgs,
  color?: keyof DebugColors,
  deviceIdentifier?: string,
  stringify?: boolean
]
export type LogToTerminal = FunctionType<LogToTerminalArgs, void>

export const SentrySeverityMap: Record<LogType, SeverityLevel> = {
  debug: 'debug',
  error: 'error' ,
  info: 'info' ,
  log: 'log' ,
  warn: 'warning' ,
  silent: 'log' ,
}

export type SentryProvider = Pick<
  typeof Sentry,
  'addBreadcrumb' | 'captureException' | 'init' | 'captureMessage'
>

export type LoggerMiddleware = FunctionType<LogToTerminalArgs, any>
