import {
  AnyFunction,
  ComponentVariants,
  IconPlaceholder,
  TypeGuards,
  useDefaultComponentStyle,
  useNestedStylesByKey,
} from '@codeleap/common'
import { CSSObject } from '@emotion/react'
import React from 'react'
import { Overlay } from '../Overlay'
import { View } from '../View'
import { Text } from '../Text'
import { ComponentCommonProps, StylesOf } from '../../types/utility'
import { DrawerComposition, DrawerPresets } from './styles'
import { ActionIcon, ActionIconProps } from '../ActionIcon'
import { usePopState } from '../../lib'

const axisMap = {
  top: [-1, 'Y'],
  bottom: [1, 'Y'],
  left: [-1, 'X'],
  right: [1, 'X'],
} as const

export type DrawerProps = {
  open: boolean
  toggle: AnyFunction
  darkenBackground?: boolean
  size?: string | number
  showCloseButton?: boolean
  title?: React.ReactNode | string
  footer?: React.ReactNode
  position?: keyof typeof axisMap
  styles?: StylesOf<DrawerComposition>
  style?: React.CSSProperties
  animationDuration?: string
  closeButtonProps?: Partial<ActionIconProps>
  closeIcon?: IconPlaceholder
  children?: React.ReactNode
} & ComponentVariants<typeof DrawerPresets> & ComponentCommonProps

const resolveHiddenDrawerPosition = (
  position: DrawerProps['position'],
): [string, string, CSSObject] => {
  const [translateOrient, translateAxis] = axisMap[position]

  const translateValues = {
    X: 0,
    Y: 0,
  }

  translateValues[translateAxis] = 100 * translateOrient

  const css = `translate(${translateValues.X}%, ${translateValues.Y}%)`
  const positioningKeys =
    translateAxis === 'X' ? ['top', 'bottom'] : ['left', 'right']

  const positioning = Object.fromEntries(positioningKeys.map((k) => [k, 0]))
  return [css, translateAxis, positioning]
}

const defaultProps: Partial<DrawerProps> = {
  animationDuration: '0.3s',
  position: 'bottom',
  showCloseButton: false,
  darkenBackground: true,
  size: '75vw',
  title: null,
  closeIcon: 'x' as IconPlaceholder,
}

export const Drawer = (props: DrawerProps) => {
  const allProps = {
    ...Drawer.defaultProps,
    ...props,
  }

  const {
    open,
    toggle,
    children,
    size,
    title,
    footer,
    darkenBackground,
    showCloseButton,
    closeButtonProps = {},
    position,
    variants = [],
    responsiveVariants = {},
    styles,
    style,
    animationDuration,
    debugName,
    closeIcon,
  } = allProps as DrawerProps

  usePopState(open, toggle)

  const [hiddenStyle, axis, positioning] = resolveHiddenDrawerPosition(position)

  const sizeProperty = axis === 'X' ? 'width' : 'height'
  const fullProperty = sizeProperty === 'height' ? 'width' : 'height'

  const variantStyles = useDefaultComponentStyle<'u:Drawer', typeof DrawerPresets>('u:Drawer', {
    styles,
    variants,
    responsiveVariants,
  })

  const closeButtonStyles = useNestedStylesByKey('closeButton', variantStyles)

  const showHeader = (!TypeGuards.isNil(title) || showCloseButton)

  const wrapperStyles = React.useMemo(() => ([
    variantStyles.wrapper,
    {
      transition: 'visibility 0.01s ease',
      transitionDelay: open ? '0' : animationDuration,
      visibility: open ? 'visible' : 'hidden',
    },
    style,
  ]), [open, variantStyles])

  return (
    <View debugName={debugName} css={wrapperStyles}>
      {darkenBackground && (
        <Overlay
          debugName={debugName}
          visible={open}
          css={variantStyles.overlay}
          onPress={toggle}
        />
      )}

      <View
        variants={['fixed']}
        css={{
          transform: open ? `translate(0%, 0%)` : hiddenStyle,
          transition: `transform ${animationDuration} ease`,
          [sizeProperty]: size,
          [fullProperty]: '100%',
          ...positioning,
          [position]: 0,
          ...variantStyles.box,
        }}
      >
        {
          showHeader ? (
            <View
              component='header'
              css={[variantStyles.header]}
            >
              {TypeGuards.isString(title) ? <Text css={variantStyles.title} text={title} /> : title}
              {showCloseButton && (
                <ActionIcon
                  debugName={debugName}
                  onPress={toggle}
                  icon={closeIcon as IconPlaceholder}
                  {...closeButtonProps}
                  styles={closeButtonStyles}
                />
              )}
            </View>
          ) : null
        }

        <View css={variantStyles.body}>{children}</View>

        {footer && (
          <View component='footer' css={variantStyles.footer}>
            {footer}
          </View>
        )}
      </View>
    </View>
  )
}

Drawer.defaultProps = defaultProps

export * from './styles'
