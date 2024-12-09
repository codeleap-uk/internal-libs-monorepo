import { AnyFunction } from '@codeleap/types'
import React from 'react'
import { ComponentCommonProps } from '../../types/utility'
import { DrawerComposition } from './styles'
import { ActionIconProps } from '../ActionIcon'
import { AppIcon, StyledProp } from '@codeleap/styles'

export type DrawerProps =
  ComponentCommonProps &
  {
    open: boolean
    toggle: AnyFunction
    darkenBackground?: boolean
    size?: number
    showCloseButton?: boolean
    title?: React.ReactNode | string
    footer?: React.ReactNode
    position?: 'left' | 'right' | 'top' | 'bottom'
    style?: StyledProp<DrawerComposition>
    closeButtonProps?: Partial<ActionIconProps>
    closeIcon?: AppIcon
    children?: React.ReactNode
  }
