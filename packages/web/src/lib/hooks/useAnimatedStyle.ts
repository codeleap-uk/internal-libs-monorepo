import { useRef, useEffect, useState } from 'react'
import { TargetAndTransition, Transition } from 'motion/react'

type UpdaterReturn = TargetAndTransition & {
  transition?: Transition
}

type UseAnimatedStyleReturn = {
  animate: TargetAndTransition
  initial: boolean
  transition: Transition | undefined
}

export const useAnimatedStyle = (updater: () => UpdaterReturn, deps: Array<any>): UseAnimatedStyleReturn => {
  const initialStyle = updater()

  const [animatedStyle, setAnimatedStyle] = useState<TargetAndTransition>(initialStyle)
  const transition = useRef<Transition | undefined>(initialStyle.transition)

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