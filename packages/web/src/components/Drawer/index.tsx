import {
  AnyFunction,
  ComponentVariants,
  IconPlaceholder,
  onUpdate,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { CSSObject } from '@emotion/react'
import React, { ReactNode } from 'react'
import { Overlay } from '../Overlay'
import { View } from '../View'
import { Text } from '../Text'
import { Button } from '../Button'
import { StylesOf } from '../../types/utility'
import { DrawerComposition, DrawerPresets } from './styles'

const axisMap = {
  top: [-1, 'Y'],
  bottom: [1, 'Y'],
  left: [-1, 'X'],
  right: [1, 'X'],
} as const

export type DrawerProps = React.PropsWithChildren<{
  open: boolean
  toggle: AnyFunction
  darkenBackground?: boolean
  size: string | number
  showCloseButton?: boolean
  title?: ReactNode
  footer?: ReactNode
  position?: keyof typeof axisMap
  styles?: StylesOf<DrawerComposition>
  animationDuration?: string
} & ComponentVariants<typeof DrawerPresets>
>
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

export const Drawer: React.FC<DrawerProps> = ({ ...rawProps }) => {
  const {
    open,
    toggle,
    children,
    size,
    title,
    footer,
    darkenBackground = true,
    showCloseButton,
    position = 'bottom',
    variants = [],
    responsiveVariants = {},
    styles,
    animationDuration = '0.3s',
  } = rawProps

  onUpdate(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  const [hiddenStyle, axis, positioning] =
    resolveHiddenDrawerPosition(position)

  const sizeProperty = axis === 'X' ? 'width' : 'height'
  const fullProperty = sizeProperty === 'height' ? 'width' : 'height'

  const variantStyles = useDefaultComponentStyle('Drawer', {
    styles,
    variants,
    responsiveVariants,
  })

  return (
    <View
      css={{
        ...variantStyles.wrapper,
        transition: 'visibility 0.01s ease',
        transitionDelay: open ? '0' : animationDuration,
        visibility: open ? 'visible' : 'hidden',
      }}
    >
      {darkenBackground && (
        <Overlay
          visible={open}
          css={variantStyles.overlay}
          onPress={() => toggle()}
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
          !TypeGuards.isNil(title) || showCloseButton && (
            <View
              component='header'
              variants={['justifySpaceBetween']}
              css={variantStyles.header}
            >
              {typeof title === 'string' ? <Text text={title} /> : title}
              {showCloseButton && (
                <Button
                  onPress={toggle}
                  icon={'close' as IconPlaceholder}
                  variants={['icon']}
                  css={variantStyles.headerCloseButton}
                />
              )}
            </View>
          )
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

export * from './styles'