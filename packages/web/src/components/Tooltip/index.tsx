import React, { useState } from 'react'
import {
  Provider as TooltipContainer,
  Root as TooltipWrapper,
  Trigger as TooltipTrigger,
  Portal as TooltipPortal,
  Content as TooltipContent,
  Arrow as TooltipArrow,
  TooltipProps as PrimitiveTooltipProps,

  TooltipContentProps,
  TooltipPortalProps,
  TooltipArrowProps,
  TooltipTriggerProps,
  TooltipProviderProps,
} from '@radix-ui/react-tooltip'

import { AnyFunction, ComponentVariants, StylesOf, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { TooltipComposition, TooltipPresets } from './styles'
import { ComponentWithDefaultProps } from '../../types/utility'

export type TooltipProps = PrimitiveTooltipProps & {
  content: React.ReactNode | ((props: TooltipProps) => JSX.Element)
  styles?: StylesOf<TooltipComposition>
  side?: 'left' | 'right' | 'bottom' | 'top'
  openOnPress?: boolean

  disabled?: boolean
  delayDuration?: number

  onOpen?: AnyFunction
  onClose?: AnyFunction
  onOpenChange?: (open: boolean) => void
  toggle?: AnyFunction

  contentProps?: TooltipContentProps
  portalProps?: TooltipPortalProps
  arrowProps?: TooltipArrowProps
  triggerProps?: TooltipTriggerProps
  providerProps?: TooltipProviderProps
} & ComponentVariants<typeof TooltipPresets>

export const Tooltip: ComponentWithDefaultProps<TooltipProps> = (props: TooltipProps) => {
  const {
    children,
    content: Content,
    side,
    disabled,
    delayDuration,
    openOnPress,
    onOpen,
    onClose,
    onOpenChange,

    contentProps,
    portalProps,
    arrowProps,
    triggerProps,
    providerProps,
    variants,
    responsiveVariants,
    styles,
    ...rest
  } = {
    ...Tooltip.defaultProps,
    ...props,
  }

  const [visible, toggle] = useState(false)

  const variantsStyles = useDefaultComponentStyle<'u:Tooltip', typeof TooltipPresets>('u:Tooltip', {
    responsiveVariants,
    variants,
    styles,
  })

  let open = !visible ? undefined : true

  if (disabled) {
    open = false
  }

  const tooltipDirectionStyle = side ? variantsStyles[`wrapper:${side}`] : variantsStyles.wrapper

  console.log('open', visible)
  console.log('disabled', disabled)

  function handleIsTooltipOpen() {
    if (disabled || !openOnPress) return

    toggle((prev) => !prev)
  }

  function handleOpenState(_open:boolean) {
    console.log('testetestetste', _open)
    console.log('testetestetste', _open)
    console.log('testetestetste', _open)

    if (_open) {
      console.log('testeando open')
      onOpen?.()
    } else {
      console.log('testeando closed')
      onClose?.()
    }
    onOpenChange(_open)
  }

  return (
    <TooltipContainer {...providerProps}>
      <TooltipWrapper delayDuration={delayDuration} open={open} onOpenChange={() => handleOpenState(visible)} {...rest}>
        <TooltipTrigger onClick={handleIsTooltipOpen} asChild {...triggerProps}>
          {children}
        </TooltipTrigger>
        <TooltipPortal {...portalProps} >
          <TooltipContent css={[tooltipDirectionStyle, variantsStyles.wrapper]} sideOffset={2} side={side} {...contentProps}>
            {
              TypeGuards.isFunction(Content) ? <Content {...props} /> : Content
            }
            <TooltipArrow {...arrowProps} />
          </TooltipContent>
        </TooltipPortal>
      </TooltipWrapper>

    </TooltipContainer>
  )
}

Tooltip.defaultProps = {
  openOnPress: true,
  disabled: false,
  delayDuration: 0,
  side: 'bottom',
}

export * from './styles'
