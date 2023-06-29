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
  toggle?: AnyFunction
  visible?: boolean
  content: React.ReactNode | ((props: TooltipProps) => JSX.Element)
  styles?: StylesOf<TooltipComposition>
  side?: 'left' | 'right' | 'bottom' | 'top'
  openOnPress?: boolean
  openOnHover?: boolean
  disabled?: boolean
  delayDuration?: number
  onOpen?: AnyFunction
  onClose?: AnyFunction
  onValueChange?: (value: boolean) => void
  onHover?: (value: boolean) => void
  onPress?: (value: boolean) => void
} & ComponentVariants<typeof TooltipPresets>

const defaultProps: Partial<TooltipProps> = {
  openOnPress: true,
  openOnHover: true,
  disabled: false,
  delayDuration: 0,
  side: 'bottom',
}

export const Tooltip: ComponentWithDefaultProps<TooltipProps> = (props: TooltipProps) => {
  const allProps = {
    ...Tooltip.defaultProps,
    ...props,
  }

  const {
    toggle: _toggle = null,
    visible: _visible = null,
    children,
    content: Content,
    side,
    disabled,
    delayDuration,
    openOnPress,
    openOnHover,
    onOpen,
    onClose,
    onValueChange,
    onHover,
    onPress,
    contentProps = {},
    portalProps = {},
    arrowProps = {},
    triggerProps = {},
    providerProps = {},
    variants = [],
    responsiveVariants = {},
    styles = {},
    ...rest
  } = allProps

  const variantsStyles = useDefaultComponentStyle<'u:Tooltip', typeof TooltipPresets>('u:Tooltip', {
    responsiveVariants,
    variants,
    styles,
  })

  const hasStateProps = !TypeGuards.isNil(_visible) && TypeGuards.isFunction(_toggle)

  const [visible, toggle] = hasStateProps ? [_visible, _toggle] : useState(false)

  const tooltipDirectionStyle = React.useMemo(() => {
    return side ? variantsStyles[`wrapper:${side}`] : variantsStyles.wrapper
  }, [side, variantsStyles])

  function handleToggle(_value: boolean, isToggle = true) {
    if (_value === true) {
      onOpen?.()
    } else {
      onClose?.()
    }

    if (isToggle) toggle(_value)

    if (TypeGuards.isFunction(onValueChange)) onValueChange?.(_value)
  }

  function onOpenChange(_open: boolean) {
    handleToggle(_open, false)
  }

  const _onHover = (type: 'enter' | 'leave') => {
    if (!openOnHover) return

    const value = !visible

    if (type === 'leave' && visible === false) return

    handleToggle(value)
    onHover?.(value)
  }
  
  const _onPress = () => {
    if (!openOnPress) return

    const value = !visible

    handleToggle(value)
    onPress?.(value)
  }

  return (
    <TooltipContainer {...providerProps}>
      <TooltipWrapper
        delayDuration={delayDuration} 
        open={visible} 
        onOpenChange={onOpenChange}
        {...rest}
      >
        <TooltipTrigger 
          onClick={_onPress}
          onMouseEnter={() => _onHover('enter')}
          onMouseLeave={() => _onHover('leave')}
          asChild
          {...triggerProps}
        >
          {children}
        </TooltipTrigger>
        <TooltipPortal {...portalProps}>
          <TooltipContent css={[tooltipDirectionStyle, variantsStyles.wrapper]} sideOffset={2} side={side} {...contentProps}>
            {
              TypeGuards.isFunction(Content) ? <Content {...allProps} /> : Content
            }
            <TooltipArrow {...arrowProps} />
          </TooltipContent>
        </TooltipPortal>
      </TooltipWrapper>

    </TooltipContainer>
  )
}

Tooltip.defaultProps = defaultProps

export * from './styles'
