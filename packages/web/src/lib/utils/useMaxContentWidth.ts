import { useCodeleapContext } from '@codeleap/common'
import { useWindowSize } from '../hooks'

export const useMaxContentWidth = () => {

  const { Theme } = useCodeleapContext()
  const [width, height] = useWindowSize()

  const safeHorizontalPaddings = Theme.safeHorizontalPaddings()
  const entries = Object.keys(safeHorizontalPaddings)

  let currentBreakpoint = null
  let maxContentWidth = 0

  entries.forEach(breakpoint => {
    if (Theme.hooks.down(breakpoint)) {
      currentBreakpoint = breakpoint
    }
  })

  maxContentWidth = width - (safeHorizontalPaddings[currentBreakpoint] * 2)
  const padding = (width - Theme.values.maxContentWidth) / 2

  return {
    width: `${maxContentWidth}px`,
    padding,
  }

}
