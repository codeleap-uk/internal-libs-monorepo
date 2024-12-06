import React from 'react'
import {
  Provider as TooltipContainer,
  Root as TooltipWrapper,
  Trigger as TooltipTrigger,
  Portal as TooltipPortal,
  Content as TooltipContent,
  Arrow as TooltipArrow,
} from '@radix-ui/react-tooltip'
import { useConditionalState } from '@codeleap/hooks'
import { TypeGuards } from '@codeleap/types'
import { View } from '../View'
import { useClickOutsideElement } from '../../lib'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { TooltipProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

export * from './styles'
export * from './types'

export const Tooltip = (props: TooltipProps) => {
  const allProps = {
    ...Tooltip.defaultProps,
    ...props,
  }

  const {
    toggle: _toggle,
    visible: _visible,
    children,
    content: Content,
    triggerWrapperProps,
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
    contentProps,
    portalProps,
    arrowProps,
    triggerProps,
    providerProps,
    closeOnClickOutside,
    style,
    ...rest
  } = allProps

  const styles = useStylesFor(Tooltip.styleRegistryName, style)

  const [visible, toggle] = useConditionalState(_visible, _toggle, { initialValue: false })

  const tooltipDirectionStyle = React.useMemo(() => {
    return side ? styles[`content:${side}`] : styles.content
  }, [side, styles])

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

  const contentRef = useClickOutsideElement((isOutside) => {
    if (isOutside && closeOnClickOutside && !openOnHover && visible) {
      handleToggle(false)
    }
  }, [triggerRef])

  return (
    <TooltipContainer {...providerProps}>
      <TooltipWrapper
        delayDuration={delayDuration}
        open={visible}
        onOpenChange={onOpenChange}
        {...rest}
        // @ts-ignore
      >
        <TooltipTrigger
          onClick={_onPress}
          onMouseEnter={() => _onHover('enter')}
          onMouseLeave={() => _onHover('leave')}
          asChild
          ref={triggerRef}
          {...triggerProps}
          //@ts-expect-error
          css={styles.triggerWrapper}
        >
          <TriggerWrapper
            {...allProps as any}
            {...triggerWrapperProps}
            css={styles.triggerInnerWrapper}
          >
            {children}
          </TriggerWrapper>
        </TooltipTrigger>
        <TooltipPortal {...portalProps}>
          {/* @ts-expect-error icss type */}
          <TooltipContent ref={contentRef} css={[tooltipDirectionStyle, styles.content]} sideOffset={2} side={side} {...contentProps}>
            {
              TypeGuards.isFunction(Content)
                ? <Content
                  {...allProps}
                  visible={visible}
                  toggle={toggle}
                  variantsStyles={styles}
                />
                : Content
            }
            <TooltipArrow
              {...arrowProps}
              //@ts-expect-error icss type
              css={styles.arrow}
            />
          </TooltipContent>
        </TooltipPortal>
      </TooltipWrapper>

    </TooltipContainer>
  )
}

Tooltip.styleRegistryName = 'Tooltip'

Tooltip.elements = [
  'content',
  'arrow',
  'triggerWrapper',
  'triggerInnerWrapper',
]

Tooltip.rootElement = 'content'

Tooltip.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Tooltip as (props: StyledComponentProps<TooltipProps, typeof styles>) => IJSX
}

Tooltip.defaultProps = {
  openOnPress: true,
  openOnHover: true,
  disabled: false,
  delayDuration: 0,
  closeOnClickOutside: false,
  side: 'bottom',
  triggerWrapper: View as unknown as React.ElementType,
} as Partial<TooltipProps>

WebStyleRegistry.registerComponent(Tooltip)
