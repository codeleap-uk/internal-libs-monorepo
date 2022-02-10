import { onUpdate } from '@codeleap/common'
import React, { useRef } from 'react'

import posed from 'react-native-pose'
import { Touchable } from './Touchable'
import { View } from './View'
const Components = {
  Touchable,
  View,
}

const PosedComponents = Object.fromEntries(
  Object.entries(Components).map(([key, Render]) => [key, posed(Render)]),
)

type AnimatedComponents = typeof Components;
type CP = keyof AnimatedComponents;

type AnimatedProps<T extends CP, CFG = Record<string, any>> = {
  component: T;
  config: CFG;
  pose: keyof CFG;
  initialPose?: keyof CFG;
} & Omit<Parameters<AnimatedComponents[T]>[0], 'component'>;

export const Animated = <T extends CP, CFG = any>({
  config,
  component,
  ...props
}: AnimatedProps<T, CFG>) => {
  const Component = useRef(PosedComponents[component](config)).current

  return <Component {...props} />
}
