import { TargetAndTransition } from 'motion/react'
import { SelectProperties } from '../../types'
import { useStaticAnimationStyles } from './useStaticAnimationStyles'
import { useState, useEffect } from 'react'

type UseAnimatedVariantStylesConfig<T extends Record<string | number | symbol, any>, K extends keyof T> = {
  variantStyles: T
  animatedProperties: K[]
  updater: (states: SelectProperties<T, K>) => TargetAndTransition
  dependencies?: any[]
}

export function useAnimatedVariantStyles<T extends Record<string | number | symbol, any>, K extends keyof T>(config: UseAnimatedVariantStylesConfig<T, K>) {
  const { animatedProperties, updater, variantStyles, dependencies = [] } = config

  const staticStyles = useStaticAnimationStyles(variantStyles, animatedProperties)

  const initialState = updater(staticStyles)

  const [animated, setAnimated] = useState(initialState)

  useEffect(() => {
    const nextState = updater(staticStyles)

    setAnimated(nextState)
  }, dependencies)

  return animated
}
