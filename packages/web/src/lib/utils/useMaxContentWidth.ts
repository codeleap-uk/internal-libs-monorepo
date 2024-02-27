import { useCodeleapContext } from '@codeleap/common'
import { useWindowSize } from '../hooks'

export const useMaxContentWidth = () => {

  const { Theme } = useCodeleapContext()
  const [width, height] = useWindowSize()

  const safeHorizontalPaddings = Theme.safeHorizontalPaddings()
  const entries = Object.keys(safeHorizontalPaddings)

  let currentBreakpoint = null
  let maxContentWidth = null

  entries.forEach(breakpoint => {

    if (width >= Theme.breakpoints.desktopHuge) {
      currentBreakpoint = 'desktopHuge'
      return
    }

    if (Theme.hooks.down(breakpoint)) {
      currentBreakpoint = breakpoint
    }
  })

  if (currentBreakpoint === 'desktopHuge') {
    maxContentWidth = Theme.values.maxContentWidth
  } else {
    maxContentWidth = (width >= Theme.values.maxContentWidth ? Theme.values.maxContentWidth : width) - (safeHorizontalPaddings[currentBreakpoint] * 2)
  }

  const padding = (width - Theme.values.maxContentWidth) / 2

  console.table({
    width,
    rigthMath: (safeHorizontalPaddings[currentBreakpoint] * 2),
    maxContentWidth,
    padding,
  })

  return {
    width: `${maxContentWidth}px`,
    padding,
  }

}
