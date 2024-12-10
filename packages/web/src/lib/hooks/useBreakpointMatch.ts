import { useMemo } from 'react'
import { TypeGuards } from '@codeleap/types'
import { AppTheme, Theme, useTheme } from '@codeleap/styles'
import { useMediaQuery } from './useMediaQuery'

export type BreakpointsMatch<T extends string = string> = Record<T, any>

export function useBreakpointMatch<T extends string = string>(values: Partial<BreakpointsMatch<T>>) {
  const theme = useTheme(store => store.current) as AppTheme<Theme>

  const themeBreakpoints: Record<string, number> = theme?.breakpoints ?? {}

  const breakpoints: Record<string, number> = useMemo(() => {
    let breaks = Object.entries(themeBreakpoints)

    breaks = breaks?.sort((a, b) => a?.[1] - b?.[1])

    const sortBreakpoints = Object.fromEntries(breaks)

    return sortBreakpoints
  }, [])

  const breakpointValues: Array<string> = useMemo(() => {
    const _breakpoints = Object.keys(breakpoints)

    return _breakpoints.sort((a, b) => breakpoints?.[a] - breakpoints?.[b])
  }, [])

  const breakpointMatches = {}

  for (const breakpoint in breakpoints) {
    const matchesDown = useMediaQuery(theme?.media?.down(breakpoint as never))
    const matchesUp = useMediaQuery(theme?.media?.up(breakpoint as never))

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
