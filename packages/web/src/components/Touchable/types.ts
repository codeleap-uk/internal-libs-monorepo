import { AnyFunction } from '@codeleap/common'
import { ComponentPropsWithRef, ElementType } from 'react'
import { TouchableComposition } from './styles'
import { StyledProp } from '@codeleap/styles'

export type TouchableProps<T extends ElementType = 'button'> =
  Omit<ComponentPropsWithRef<T>, 'style'> &
  {
    component?: T
    disabled?: boolean
    propagate?: boolean
    onPress?: AnyFunction
    debugName: string
    debugComponent?: string
    style?: StyledProp<TouchableComposition>
    debounce?: number
    leadingDebounce?: boolean
    setPressed?: (pressed: boolean) => void
    analyticsEnabled?: boolean
    analyticsName?: string
    analyticsData?: Record<string, any>
  }
