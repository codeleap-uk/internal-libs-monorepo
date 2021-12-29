/* eslint-disable no-unused-vars */
import { AppTheme } from '.'
import { FunctionType } from '..'

type ThemeBreakpoints = AppTheme['breakpoints'];
type Breakpoint = keyof ThemeBreakpoints | number;
export type BreakpointHooks<B, R> = Record<'up' | 'down' | 'is' | 'not', FunctionType<[test:B], R>>;

export function buildMediaQueries<T extends ThemeBreakpoints>(breakpoints: T): BreakpointHooks<keyof T, string> {
  function getBreakpoint(breakpoint) {
    return getBreakpointValue(breakpoint, breakpoints)
  }

  return {
    up: (test) => {
      // Upwards of... (excluding)
      const min = getBreakpoint(test)

      return `@media screen and (min-width:${min}px)`
    },
    down: (test) => {
      // Downwards of... (excluding)
      const max = getBreakpoint(test)
      return `@media screen and (max-width:${max}px)`
    },
    is: (test) => {
      // Is media... (exact)
      const value = getBreakpoint(test)
      return `@media screen and (min-width:${value}px) and (max-width:${value}px)`
    },
    not: (test) => {
      // Is NOT media... (exact)
      const value = getBreakpoint(test)
      return `@media not screen and (min-width:${value}px) and (max-width:${value}px)`
    },
  }
}

function getBreakpointValue(breakpoint: Breakpoint, breakpoints: ThemeBreakpoints) {
  if (breakpoints[breakpoint]) {
    return breakpoints[breakpoint]
  }

  return breakpoint
}

export function breakpointHooksFactory<T extends ThemeBreakpoints>(
  breakpoints: T,
  getCurrentSize: () => number[],
): BreakpointHooks<keyof T, boolean> {
  function getBreakpoint(breakpoint) {
    return getBreakpointValue(breakpoint, breakpoints)
  }

  return {
    up: (test) => {
      // Upwards of... (excluding)
      const currentSize = getCurrentSize()
      const min = getBreakpoint(test)

      return currentSize[0] > min
    },
    down: (test) => {
      // Downwards of... (excluding)
      const max = getBreakpoint(test)
      const currentSize = getCurrentSize()
      return currentSize[0] < max
    },
    is: (test) => {
      // Is media... (exact)
      const value = getBreakpoint(test)
      const currentSize = getCurrentSize()
      return currentSize[0] === value
    },
    not: (test) => {
      // Is NOT media... (exact)
      const value = getBreakpoint(test)
      const currentSize = getCurrentSize()
      return currentSize[0] !== value
    },
  }
}
