import { useCodeleapContext, useMemo } from '@codeleap/common'
import { useMediaQuery } from './hooks'

export type BreakpointsMatch = Record<string, any> & {
  defaultMedia: string
}

export const useBreakpointMatch = (values: BreakpointsMatch) => {
  const { Theme } = useCodeleapContext()

  const breakpoints = useMemo(() => {
    const breaks = Object.entries(Theme.breakpoints as Record<string, number>)

    breaks?.sort((a, b) => a?.[1] - b?.[1])

    const sortBreakpoints = Object.fromEntries(breaks)

    return sortBreakpoints
  }, [])

  const breakpointMatches = {}

  for (const breakpoint in breakpoints) {
    const matchesDown = useMediaQuery(Theme.media.down(breakpoint))
    const matchesUp = useMediaQuery(Theme.media.up(breakpoint))

    breakpointMatches[breakpoint] = !matchesUp && matchesDown
  }

  const breakpoint = Object.keys(breakpointMatches).find((key) => breakpointMatches[key])

  return values[breakpoint] ?? values[values.defaultMedia]
}
