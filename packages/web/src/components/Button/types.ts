import React from 'react'
import { AnyFunction, IconPlaceholder } from '@codeleap/common'
import { StyledProp } from '@codeleap/styles'
import { TouchableProps } from '../Touchable'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { ButtonComposition } from './styles'
import { ComponentCommonProps } from '../../types'

export type ButtonProps = Partial<TouchableProps<'button'>> & ComponentCommonProps & {
    text?: string
    rightIcon?: IconPlaceholder
    icon?: IconPlaceholder
    onPress?: AnyFunction
    style?: StyledProp<ButtonComposition>
    loading?: boolean
    loadingShowText?: boolean
    debugName: string
    debounce?: number
    selected?: boolean
    children?: React.ReactNode | ((props: Partial<Omit<ButtonProps, 'children'>>) => JSX.Element)
    loaderProps?: Partial<ActivityIndicatorProps>
  }
