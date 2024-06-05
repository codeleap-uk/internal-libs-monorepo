import {
  AnyFunction,
  IconPlaceholder,
} from '@codeleap/common'
import React from 'react'
import { ComponentCommonProps } from '../../types/utility'
import { DrawerComposition } from './styles'
import { ActionIconProps } from '../ActionIcon'
import { axisMap } from '.'
import { StyledProp } from '@codeleap/styles'

export type DrawerProps = {
    open: boolean
    toggle: AnyFunction
    darkenBackground?: boolean
    size?: string | number
    showCloseButton?: boolean
    title?: React.ReactNode | string
    footer?: React.ReactNode
    position?: keyof typeof axisMap
    style?: StyledProp<DrawerComposition>
    animationDuration?: string
    closeButtonProps?: Partial<ActionIconProps>
    closeIcon?: IconPlaceholder
    children?: React.ReactNode
  } & ComponentCommonProps
