import { FunctionType } from '../..'
import { colors, foregroundColors } from './constants'
import { AppSettings } from '../../config/Settings'

import * as Sentry from '@sentry/browser'

export type LogType = 'info' | 'debug' | 'warn' | 'error' | 'log' | 'silent';

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
};
export type DebugColor = keyof DebugColors;
export type LogToTerminalArgs = [
  logType: LogType,
  args: LogFunctionArgs,
  color?: keyof DebugColors,
  deviceIdentifier?: string
];
export type LogToTerminal = FunctionType<LogToTerminalArgs, void>;

export const SentrySeverityMap: Record<LogType, Sentry.Severity> = {
  debug: Sentry.Severity.Debug,
  error: Sentry.Severity.Error,
  info: Sentry.Severity.Info,
  log: Sentry.Severity.Log,
  warn: Sentry.Severity.Warning,
  silent: Sentry.Severity.Log,
}

export type SentryProvider = Pick<
  typeof Sentry,
  'addBreadcrumb' | 'captureException' | 'init' | 'captureMessage'
>;

export type LoggerMiddleware = FunctionType<LogToTerminalArgs, any>
