import { useCodeleapContext } from '@codeleap/common'
import { useWindowSize } from './useWindowSize'

export const useMaxContentWidth = () => {
  const { Theme } = useCodeleapContext()
  const [width, height] = useWindowSize()

  const breakpoints: Record<string, number> = Theme.breakpoints

  const safeHorizontalPaddings = Theme.safeHorizontalPaddings()

  const entries = Object.keys(safeHorizontalPaddings)

  const sortedBreakpointsValues = Object.entries(breakpoints).sort((a, b) => b?.[1] - a?.[1])
  const highestBreakpoint = sortedBreakpointsValues[0]

  let currentBreakpoint = null
  let maxContentWidth = Theme.values.maxContentWidth

  const maxBreakpointEntryName = highestBreakpoint[0]

  const maxPaddingApplied = width >= breakpoints[maxBreakpointEntryName]
  const hasScreenReachedMaxWidth = width >= Theme.values.maxContentWidth

  entries.forEach(breakpoint => {
    if (window?.innerWidth <= breakpoints[breakpoint]) {
      currentBreakpoint = breakpoint
    }
  })

  if (maxPaddingApplied) {
    maxContentWidth = Theme.values.maxContentWidth - (safeHorizontalPaddings[maxBreakpointEntryName] * 2)
  } else {
    if (currentBreakpoint === maxBreakpointEntryName) {
      maxContentWidth = Theme.values.maxContentWidth
    } else {
      maxContentWidth = (hasScreenReachedMaxWidth ? Theme.values.maxContentWidth : width) - (safeHorizontalPaddings[currentBreakpoint] * 2)
    }
  }

  const padding = (width - maxContentWidth) / 2

  return {
    width: maxContentWidth,
    padding,
  }
}
