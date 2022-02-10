import { DebugColors, LogToTerminal, LogFunctionArgs } from './types'

export function makeLogger(
  color: keyof DebugColors,
  log: LogToTerminal,
): DebugColors[keyof DebugColors] {
  function debugWithColor(...debugArgs: LogFunctionArgs) {
    log('debug', debugArgs, color)
  }

  return debugWithColor
}
