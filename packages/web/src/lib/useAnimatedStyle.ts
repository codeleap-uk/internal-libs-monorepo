import React, { useRef } from 'react'
import { onUpdate, useState } from '@codeleap/common'
import { AnimationProps } from 'framer-motion'

type UpdaterReturn = Omit<AnimationProps['animate'], 'transition'> & {
  transition: AnimationProps['transition']
}

type UseAnimatedStyleReturn = Partial<AnimationProps>

export const useAnimatedStyle = (updater: () => UpdaterReturn, deps: Array<any>): UseAnimatedStyleReturn => {
  const initialStyle = updater()
  
  const [animatedStyle, setAnimatedStyle] = useState(initialStyle)
  const transition = useRef(initialStyle.transition)

  onUpdate(() => {
    const animatedStyleUpdated = updater()

    setAnimatedStyle(animatedStyleUpdated)
  }, deps)

  return {
    animate: animatedStyle,
    transition: transition.current,
    initial: false,
  }
}
