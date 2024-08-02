import { Breakpoint } from '../types'

export type Queries = {
  up: (breakpoint: string) => string
  down: (breakpoint: Breakpoint) => string
  is: (breakpoint: string) => string
  not: (breakpoint: string) => string
}

export type MediaQueries = Queries & {
  renderToPlatformQuery: (props: Record<keyof Queries, any>) => string
}

function getBreakpointValue(breakpoint: any, breakpoints: any) {
  if (breakpoints[breakpoint]) {
    return breakpoints[breakpoint]
  }

  return Infinity
}

export function createMediaQueries<T extends any>(breakpoints: T): MediaQueries {
  function getBreakpoint(breakpoint: any) {
    return getBreakpointValue(breakpoint, breakpoints)
  }

  const queries: Queries = {
    up: (breakpoint: any) => {
      // Upwards of... (excluding)
      const min = getBreakpoint(breakpoint)
      return `@media screen and (min-width:${min}px)`
    },
    down: (breakpoint: any) => {
      // Downwards of... (excluding)
      const max = getBreakpoint(breakpoint)
      return `@media screen and (max-width:${max}px)`
    },
    is: (breakpoint: any) => {
      // Is media... (exact)
      const value = getBreakpoint(breakpoint)
      return `@media screen and (min-width:${value}px) and (max-width:${value}px)`
    },
    not: (breakpoint: any) => {
      // Is NOT media... (exact)
      const value = getBreakpoint(breakpoint)
      return `@media not screen and (min-width:${value}px) and (max-width:${value}px)`
    },
  }

  const renderToPlatformQuery = (props: Record<keyof Queries, any>) => {
    let query = ''

    if (props?.is) {
      query = queries.not(props.is as never)
    } else if (props?.not) {
      query = queries.is(props.not as never)
    } else if (props?.up) {
      query = queries.down(props.up as never)
    } else if (props?.down) {
      query = queries.up(props.down as never)
    }

    return query
  }

  return {
    ...queries,
    renderToPlatformQuery,
  }
}
