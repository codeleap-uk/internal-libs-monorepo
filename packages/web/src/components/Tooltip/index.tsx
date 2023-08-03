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
import { ComponentCommonProps, ComponentWithDefaultProps } from '../../types/utility'
import { View, ViewProps } from '../View'
import { useClickOutsideElement } from '../../lib'

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
  content: React.ReactNode | ((props: TooltipProps & { variantsStyles: StylesOf<TooltipComposition> }) => JSX.Element)
  triggerWrapper?: React.ReactNode
  triggerWrapperProps?: Partial<ViewProps<'div'>>
  styles?: StylesOf<TooltipComposition>
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
} & ComponentVariants<typeof TooltipPresets> & ComponentCommonProps

const defaultProps: Partial<TooltipProps> = {
  openOnPress: true,
  openOnHover: true,
  disabled: false,
  delayDuration: 0,
  closeOnClickOutside: false,
  side: 'bottom',
  triggerWrapper: View,
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
    triggerWrapperProps = {},
    triggerWrapper: TriggerWrapper,
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
    closeOnClickOutside,
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
    if (disabled) return

    if (_value === true) {
      onOpen?.()
    } else {
      onClose?.()
    }

    if (isToggle) toggle(_value)

    if (TypeGuards.isFunction(onValueChange)) onValueChange?.(_value)
  }

  const onOpenChange = React.useCallback((_open: boolean) => {
    handleToggle(_open, false)
  }, [handleToggle])

  const _onHover = (type: 'enter' | 'leave') => {
    if (!openOnHover || disabled) return

    const value = !visible

    if (type === 'leave' && visible === false) return

    handleToggle(value)
    if (TypeGuards.isFunction(onHover)) onHover?.(type, value)
  }

  const _onPress = () => {
    if (!openOnPress || disabled) return

    const value = !visible

    handleToggle(value)
    if (TypeGuards.isFunction(onPress)) onPress?.(value)
  }

  const triggerRef = React.useRef(null)

  const clickOutside = useClickOutsideElement((isOutside) => {
    if (isOutside) handleToggle(false)
  }, [closeOnClickOutside, visible, !openOnHover], [triggerRef])

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
          ref={triggerRef}
          {...triggerProps}
        >
          <TriggerWrapper {...allProps as any} {...triggerWrapperProps}>
            {children}
          </TriggerWrapper>
        </TooltipTrigger>
        <TooltipPortal {...portalProps}>
          <TooltipContent ref={clickOutside?.ref} css={[tooltipDirectionStyle, variantsStyles.wrapper]} sideOffset={2} side={side} {...contentProps}>
            {
              TypeGuards.isFunction(Content)
                ? <Content
                  {...allProps}
                  visible={visible}
                  toggle={toggle}
                  variantsStyles={variantsStyles}
                />
                : Content
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
