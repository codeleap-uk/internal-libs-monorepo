import { AnyFunction } from '@codeleap/types'
import { ComponentPropsWithRef, ElementType, ReactNode } from 'react'
import { TouchableComposition } from './styles'
import { AnyRecord, StyledProp } from '@codeleap/styles'

export type TouchableProps<T extends ElementType = 'button'> =
  Omit<ComponentPropsWithRef<T>, 'style'> &
  {
    component?: ElementType<AnyRecord>
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
    children?: ReactNode
  }
