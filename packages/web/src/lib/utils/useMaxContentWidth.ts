import { useCodeleapContext } from '@codeleap/common'
import { useWindowSize } from '../hooks'

export const useMaxContentWidth = () => {

  // all of these values are being based upon the center wrapper component

  // returns the max width a component can take up in the screen
  // also returns the amount of padding that is being applied

  const { Theme } = useCodeleapContext()
  const [width, height] = useWindowSize()

  const safeHorizontalPaddings = Theme.safeHorizontalPaddings()
  const entries = Object.keys(safeHorizontalPaddings)

  let currentBreakpoint = null
  let maxContentWidth = Theme.values.maxContentWidth

  const desktopHugeEntryName = 'desktopHuge'

  const isUpDesktopHuge = width >= Theme.breakpoints[desktopHugeEntryName]
  const hasScreenReachedMaxWidth = width >= Theme.values.maxContentWidth

  const isHorizontalPaddingApplied = currentBreakpoint !== desktopHugeEntryName

  entries.forEach(breakpoint => {
    if (Theme.hooks.down(breakpoint)) {
      currentBreakpoint = breakpoint
    }
  })

  if (isUpDesktopHuge) {
    maxContentWidth = Theme.values.maxContentWidth - (safeHorizontalPaddings.desktopHuge * 2)
  } else {
    if (!isHorizontalPaddingApplied) {
      maxContentWidth = Theme.values.maxContentWidth
    } else {
      maxContentWidth = (hasScreenReachedMaxWidth ? Theme.values.maxContentWidth : width) - (safeHorizontalPaddings[currentBreakpoint] * 2)
    }
  }

  const padding = (width - maxContentWidth) / 2

  console.table({
    maxContentWidth,
    padding,
  })

  return {
    width: `${maxContentWidth}px`,
    padding,
  }

}
