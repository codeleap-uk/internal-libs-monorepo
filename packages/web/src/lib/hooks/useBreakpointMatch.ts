import { useMemo } from 'react'
import { TypeGuards, useCodeleapContext } from '@codeleap/common'
import { useMediaQuery } from './useMediaQuery'

export type BreakpointsMatch<T extends string = string> = Record<T, any>

export function useBreakpointMatch<T extends string = string>(values: Partial<BreakpointsMatch<T>>) {
  const { Theme } = useCodeleapContext()

  const themeBreakpoints: Record<string, number> = Theme?.breakpoints

  const breakpoints: Record<string, number> = useMemo(() => {
    const breaks = Object.entries(themeBreakpoints)

    breaks?.sort((a, b) => a?.[1] - b?.[1])

    const sortBreakpoints = Object.fromEntries(breaks)

    return sortBreakpoints
  }, [])

  const breakpointValues: Array<string> = useMemo(() => {
    const _breakpoints = Object.keys(breakpoints)

    return _breakpoints.sort((a, b) => breakpoints?.[a] - breakpoints?.[b])
  }, [])

  const breakpointMatches = {}

  for (const breakpoint in breakpoints) {
    const matchesDown = useMediaQuery(Theme.media.down(breakpoint), { getInitialValueInEffect: false })
    const matchesUp = useMediaQuery(Theme.media.up(breakpoint), { getInitialValueInEffect: false })

    breakpointMatches[breakpoint] = !matchesUp && matchesDown
  }

  const currentBreakpoint = Object.keys(breakpointMatches)?.find((key) => breakpointMatches?.[key])

  const breakpoint = useMemo(() => {
    const validBreakpointIndex = breakpointValues?.findIndex(_breakpoint => _breakpoint === currentBreakpoint)

    const validBreakpoints = breakpointValues?.slice(validBreakpointIndex, 100)

    let validBreakpoint = null

    validBreakpoint = validBreakpoints?.find((currentValue) => {
      if (Object?.keys(values)?.includes(currentValue)) {
        return currentValue
      }
    })

    if (TypeGuards.isNil(validBreakpoint)) {
      validBreakpoint = breakpointValues?.reverse()?.find(_breakpoint => !!values?.[_breakpoint])
    }

    return validBreakpoint
  }, [currentBreakpoint])

  return values?.[breakpoint]
}
