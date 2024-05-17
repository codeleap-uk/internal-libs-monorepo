import { AnimationProps } from 'framer-motion'
import { SelectProperties } from '.'
import { useStaticAnimationStyles } from '../hooks'
import { useState } from 'react'
import { onUpdate } from '@codeleap/common'

type UseAnimatedVariantStylesConfig<T extends Record<string|number|symbol, any>, K extends keyof T > = {
    variantStyles: T
    animatedProperties: K[]
    updater: (states: SelectProperties<T, K>) => AnimationProps
    dependencies?: any[]
  }

export function useAnimatedVariantStyles<T extends Record<string|number|symbol, any>, K extends keyof T >(config: UseAnimatedVariantStylesConfig<T, K>) {
  const { animatedProperties, updater, variantStyles, dependencies = [] } = config

  const staticStyles = useStaticAnimationStyles(variantStyles, animatedProperties)

  const initialState = updater(staticStyles)

  const [animated, setAnimated] = useState(initialState)

  onUpdate(() => {
    const nextState = updater(staticStyles)

    setAnimated(nextState)
  }, dependencies)

  return animated
}
