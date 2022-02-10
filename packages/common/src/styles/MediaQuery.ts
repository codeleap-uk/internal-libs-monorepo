/* eslint-disable no-unused-vars */
import { AppTheme } from '.'
import { FunctionType } from '..'
export type QueryKey = 'up' | 'down' | 'is' | 'not';

type ThemeBreakpoints = AppTheme['breakpoints'];
type Breakpoint = keyof ThemeBreakpoints | number;

export type BreakpointHooks<B, R> = Record<
  QueryKey,
  FunctionType<[test: B], R>
>;

export type MediaQueries<B, R> = BreakpointHooks<B, R> & {
  renderToPlatformQuery: (props: Record<QueryKey, B>) => any;
};

export type Hooks<B, R> = BreakpointHooks<B, R> & {
  shouldRenderToPlatform: (props: Record<QueryKey, B>) => boolean;
};

export function buildMediaQueries<T extends ThemeBreakpoints>(
  breakpoints: T,
): MediaQueries<keyof T, string> {
  function getBreakpoint(breakpoint) {
    return getBreakpointValue(breakpoint, breakpoints)
  }

  const queries = {
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
  const renderToPlatformQuery: MediaQueries<
    keyof T,
    string
  >['renderToPlatformQuery'] = (props) => {
    let mediaString = ''

    if (props?.is) {
      mediaString = queries.not(props.is)
    } else if (props?.not) {
      mediaString = queries.is(props.not)
    } else if (props?.up) {
      mediaString = queries.down(props.up)
    } else if (props?.down) {
      mediaString = queries.up(props.down)
    }
    return mediaString
      ? {
        [`${mediaString}`]: {
          display: 'none',
        },
      }
      : {}
  }

  return {
    ...queries,
    renderToPlatformQuery,
  }
}

function getBreakpointValue(
  breakpoint: Breakpoint,
  breakpoints: ThemeBreakpoints,
) {
  if (breakpoints[breakpoint]) {
    return breakpoints[breakpoint]
  }

  return breakpoint
}

export function breakpointHooksFactory<T extends ThemeBreakpoints>(
  breakpoints: T,
  getCurrentSize: () => number[],
): Hooks<keyof T, boolean> {
  function getBreakpoint(breakpoint) {
    return getBreakpointValue(breakpoint, breakpoints)
  }

  const hooks = {
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
  const shouldRenderToPlatform: Hooks<
    keyof T,
    boolean
  >['shouldRenderToPlatform'] = (props) => {
    let res = true
    if (props?.is) {
      res = hooks.is(props.is)
    } else if (props?.not) {
      res = hooks.not(props.not)
    } else if (props?.up) {
      res = hooks.up(props.up)
    } else if (props?.down) {
      res = hooks.down(props.down)
    }
    return res
  }
  return {
    ...hooks,
    shouldRenderToPlatform,
  }
}
