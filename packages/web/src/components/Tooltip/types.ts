import React from 'react'
import {
  TooltipProps as PrimitiveTooltipProps,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipArrowProps,
  TooltipTriggerProps,
  TooltipProviderProps,
} from '@radix-ui/react-tooltip'
import { AnyFunction, StylesOf } from '@codeleap/types'
import { TooltipComposition } from './styles'
import { ViewProps } from '../View'
import { StyledProp } from '@codeleap/styles'

type TooltipComponentProps = {
  contentProps?: TooltipContentProps
  portalProps?: TooltipPortalProps
  arrowProps?: TooltipArrowProps
  triggerProps?: TooltipTriggerProps
  providerProps?: TooltipProviderProps
}

export type TooltipProps =
  Omit<PrimitiveTooltipProps, 'style'> &
  Omit<TooltipComponentProps, 'style'> &
  {
    toggle?: AnyFunction
    visible?: boolean
    content: React.ReactNode | ((props: TooltipProps & { variantsStyles: StylesOf<TooltipComposition> }) => JSX.Element)
    triggerWrapper?: React.ElementType
    triggerWrapperProps?: Partial<ViewProps>
    style?: StyledProp<TooltipComposition>
    side?: 'left' | 'right' | 'bottom' | 'top'
    openOnPress?: boolean
    openOnHover?: boolean
    disabled?: boolean
    delayDuration?: number
    closeOnClickOutside?: boolean
    onOpen?: AnyFunction
    onClose?: AnyFunction
    onValueChange?: (value: boolean) => void
    onHover?: (hoverType: 'enter' | 'leave', value: boolean) => void
    onPress?: (value: boolean) => void
    children?: React.ReactNode
    debugName?: string
  }
