import { IBreakpoints } from '../types'

function getBreakpointValue(breakpoint: keyof IBreakpoints, breakpoints: IBreakpoints) {
  if (breakpoints[breakpoint]) {
    return breakpoints[breakpoint]
  }

  return Infinity
}

export type Queries = {
  up: (breakpoint: keyof IBreakpoints) => string
  down: (breakpoint: keyof IBreakpoints) => string
  is: (breakpoint: keyof IBreakpoints) => string
  not: (breakpoint: keyof IBreakpoints) => string
}

export type MediaQueries = Queries & {
  renderToPlatformQuery: (props: Record<keyof Queries, keyof IBreakpoints>) => string
}

export function buildMediaQueries<T extends IBreakpoints>(breakpoints: T): MediaQueries {
  function getBreakpoint(breakpoint: keyof IBreakpoints) {
    return getBreakpointValue(breakpoint, breakpoints)
  }

  const queries: Queries = {
    up: (breakpoint: keyof IBreakpoints) => {
      // Upwards of... (excluding)
      const min = getBreakpoint(breakpoint)
      return `@media screen and (min-width:${min}px)`
    },
    down: (breakpoint: keyof IBreakpoints) => {
      // Downwards of... (excluding)
      const max = getBreakpoint(breakpoint)
      return `@media screen and (max-width:${max}px)`
    },
    is: (breakpoint: keyof IBreakpoints) => {
      // Is media... (exact)
      const value = getBreakpoint(breakpoint)
      return `@media screen and (min-width:${value}px) and (max-width:${value}px)`
    },
    not: (breakpoint: keyof IBreakpoints) => {
      // Is NOT media... (exact)
      const value = getBreakpoint(breakpoint)
      return `@media not screen and (min-width:${value}px) and (max-width:${value}px)`
    },
  }

  const renderToPlatformQuery = (props: Record<keyof Queries, keyof IBreakpoints>) => {
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
  }

  return {
    ...queries,
    renderToPlatformQuery,
  }
}
