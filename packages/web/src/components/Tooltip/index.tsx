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

type TooltipComponentProps = {
  contentProps?: TooltipContentProps
  portalProps?: TooltipPortalProps
  arrowProps?: TooltipArrowProps
  triggerProps?: TooltipTriggerProps
  providerProps?: TooltipProviderProps
}

export type TooltipProps = PrimitiveTooltipProps & TooltipComponentProps & {
  content: React.ReactNode | ((props: TooltipProps) => JSX.Element)
  styles?: StylesOf<TooltipComposition>
  side?: 'left' | 'right' | 'bottom' | 'top'
  openOnPress?: boolean
  openOnHover?: boolean

  disabled?: boolean
  delayDuration?: number

  onOpen?: AnyFunction
  onClose?: AnyFunction
} & ComponentVariants<typeof TooltipPresets>

export const Tooltip: ComponentWithDefaultProps<TooltipProps> = (props: TooltipProps) => {
  const {
    children,
    content: Content,
    side,
    disabled,
    delayDuration,
    openOnPress,
    openOnHover,
    onOpen,
    onClose,

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

  const variantsStyles = useDefaultComponentStyle<'u:Tooltip', typeof TooltipPresets>('u:Tooltip', {
    responsiveVariants,
    variants,
    styles,
  })

  const [visible, toggle] = useState(false)
  const isNotVisible = !visible
  const notOpenOnPress = !openOnPress
  const notOpenOnHover = !openOnHover

  let open = isNotVisible ? undefined : true

  const tooltipDirectionStyle = side ? variantsStyles[`wrapper:${side}`] : variantsStyles.wrapper

  if (disabled) {
    open = false
  }

  if (notOpenOnHover) {
    open = visible
  }

  function handleIsTooltipOpen() {
    if (disabled || notOpenOnPress) return

    toggle((prev) => !prev)
  }

  function handleOpenState(_open:boolean) {
    if (_open === true) {
      onOpen?.()
    } else {
      onClose?.()
    }
  }

  const onOpenChange = notOpenOnHover ? () => null : handleOpenState

  return (
    <TooltipContainer {...providerProps}>
      <TooltipWrapper delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}
        {...rest}>
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
  openOnHover: true,
  disabled: false,
  delayDuration: 0,
  side: 'bottom',
}

export * from './styles'
