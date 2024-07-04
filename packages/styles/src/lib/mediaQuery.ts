import { IBreakpoints } from '../types'

export type Queries = {
  up: (breakpoint: keyof IBreakpoints) => string
  down: (breakpoint: keyof IBreakpoints) => string
  is: (breakpoint: keyof IBreakpoints) => string
  not: (breakpoint: keyof IBreakpoints) => string
}

export type MediaQueries = Queries & {
  renderToPlatformQuery: (props: Record<keyof Queries, keyof IBreakpoints>) => string
}

function getBreakpointValue(breakpoint: keyof IBreakpoints, breakpoints: IBreakpoints) {
  if (breakpoints[breakpoint]) {
    return breakpoints[breakpoint]
  }

  return Infinity
}

export function createMediaQueries<T extends IBreakpoints>(breakpoints: T): MediaQueries {
  function getBreakpoint(breakpoint: keyof IBreakpoints) {
    return getBreakpointValue(breakpoint, breakpoints)
  }

  const queries: Queries = {
    up: (breakpoint: keyof IBreakpoints) => {
      // Upwards of... (excluding)
      const min = getBreakpoint(breakpoint)
      return `@media screen and (minWidth:${min}px)`
    },
    down: (breakpoint: keyof IBreakpoints) => {
      // Downwards of... (excluding)
      const max = getBreakpoint(breakpoint)
      return `@media screen and (maxWidth:${max}px)`
    },
    is: (breakpoint: keyof IBreakpoints) => {
      // Is media... (exact)
      const value = getBreakpoint(breakpoint)
      return `@media screen and (minWidth:${value}px) and (maxWidth:${value}px)`
    },
    not: (breakpoint: keyof IBreakpoints) => {
      // Is NOT media... (exact)
      const value = getBreakpoint(breakpoint)
      return `@media not screen and (minWidth:${value}px) and (maxWidth:${value}px)`
    },
  }

  const renderToPlatformQuery = (props: Record<keyof Queries, keyof IBreakpoints>) => {
    let query = ''

    if (props?.is) {
      query = queries.not(props.is)
    } else if (props?.not) {
      query = queries.is(props.not)
    } else if (props?.up) {
      query = queries.down(props.up)
    } else if (props?.down) {
      query = queries.up(props.down)
    }

    return query
  }

  return {
    ...queries,
    renderToPlatformQuery,
  }
}
