import { useRef, useEffect, useState } from 'react'
import { AnimationProps } from 'framer-motion'

type UpdaterReturn = Omit<AnimationProps['animate'], 'transition'> & {
  transition: AnimationProps['transition']
}

type UseAnimatedStyleReturn = Pick<AnimationProps, 'animate' | 'initial' | 'transition'>

export const useAnimatedStyle = (updater: () => UpdaterReturn, deps: Array<any>): UseAnimatedStyleReturn => {
  const initialStyle = updater()

  const [animatedStyle, setAnimatedStyle] = useState(initialStyle)
  const transition = useRef(initialStyle.transition)

  useEffect(() => {
    const animatedStyleUpdated = updater()

    setAnimatedStyle(animatedStyleUpdated)
  }, deps)

  return {
    animate: animatedStyle,
    transition: transition.current,
    initial: false,
  }
}
