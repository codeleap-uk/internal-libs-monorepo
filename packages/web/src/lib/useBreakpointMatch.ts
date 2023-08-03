import React from 'react'
import { useCodeleapContext } from '@codeleap/common'
import { useMediaQuery } from './hooks'

export type BreakpointsMatch<T extends string = string> = Record<T, any>

export function useBreakpointMatch<T extends string = string>(values: BreakpointsMatch<T>) {
  const { Theme } = useCodeleapContext()

  const breakpoints: Record<string, number> = React.useMemo(() => {
    const breaks = Object.entries(Theme.breakpoints as Record<string, number>)

    breaks?.sort((a, b) => a?.[1] - b?.[1])

    const sortBreakpoints = Object.fromEntries(breaks)

    return sortBreakpoints
  }, [])

  const breakpointValues: Array<string> = React.useMemo(() => Object.keys(breakpoints), [])

  const breakpointMatches = {}

  for (const breakpoint in breakpoints) {
    const matchesDown = useMediaQuery(Theme.media.down(breakpoint), { getInitialValueInEffect: false })
    const matchesUp = useMediaQuery(Theme.media.up(breakpoint), { getInitialValueInEffect: false })

    breakpointMatches[breakpoint] = !matchesUp && matchesDown
  }

  const currentBreakpoint = Object.keys(breakpointMatches).find((key) => breakpointMatches[key])

  const breakpoint = React.useMemo(() => {
    const validBreakpointIndex = breakpointValues?.findIndex(_breakpoint => _breakpoint === currentBreakpoint)

    const validBreakpoints = breakpointValues.slice(validBreakpointIndex, 100)

    const validBreakpoint = validBreakpoints.find((currentValue) => {
      if (Object?.keys(values).includes(currentValue)) {
        return currentValue
      }
    })

    return validBreakpoint
  }, [currentBreakpoint])

  return values[breakpoint]
}
