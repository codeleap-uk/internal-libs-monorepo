import { useCodeleapContext } from '@codeleap/common'
import { useWindowSize } from '../hooks'

export const useMaxContentWidth = () => {

  const { Theme } = useCodeleapContext()
  const [width, height] = useWindowSize()

  const safeHorizontalPaddings = Theme.safeHorizontalPaddings()

  const entries = Object.keys(safeHorizontalPaddings)
  const ThemeBreakpointsKeys = Object.keys(Theme.breakpoints)

  let currentBreakpoint = null
  let maxContentWidth = Theme.values.maxContentWidth

  const desktopHugeEntryName = ThemeBreakpointsKeys[ThemeBreakpointsKeys.length - 1]

  const isUpDesktopHuge = width >= Theme.breakpoints[desktopHugeEntryName]
  const hasScreenReachedMaxWidth = width >= Theme.values.maxContentWidth

  entries.forEach(breakpoint => {
    if (window?.innerWidth <= Theme.breakpoints[breakpoint]) {
      currentBreakpoint = breakpoint
    }
  })

  if (isUpDesktopHuge) {
    maxContentWidth = Theme.values.maxContentWidth - (safeHorizontalPaddings.desktopHuge * 2)
  } else {
    if (currentBreakpoint === desktopHugeEntryName) {
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
