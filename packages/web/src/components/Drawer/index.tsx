import {
  IconPlaceholder,
  TypeGuards,
} from '@codeleap/common'
import { CSSObject } from '@emotion/react'
import React from 'react'
import { Overlay } from '../Overlay'
import { View } from '../View'
import { Text } from '../Text'
import { ActionIcon } from '../ActionIcon'
import { WebStyleRegistry, usePopState } from '../../lib'
import { DrawerProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

export const axisMap = {
  top: [-1, 'Y'],
  bottom: [1, 'Y'],
  left: [-1, 'X'],
  right: [1, 'X'],
} as const

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

export const Drawer = (props: DrawerProps) => {

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
    style,
    animationDuration,
    debugName,
    closeIcon,
  } = {
    ...Drawer.defaultProps,
    ...props,
  }

  usePopState(open, toggle)

  const styles = useStylesFor(Drawer.styleRegistryName, style)

  const [hiddenStyle, axis, positioning] = resolveHiddenDrawerPosition(position)

  const sizeProperty = axis === 'X' ? 'width' : 'height'
  const fullProperty = sizeProperty === 'height' ? 'width' : 'height'

  const closeButtonStyles = useNestedStylesByKey('closeButton', styles)

  const showHeader = (!TypeGuards.isNil(title) || showCloseButton)

  const wrapperStyles = React.useMemo(() => ([
    styles.wrapper,
    {
      transition: 'visibility 0.01s ease',
      transitionDelay: open ? '0' : animationDuration,
      visibility: open ? 'visible' : 'hidden',
    },
    style,
  ]), [open, styles])

  return (
    <View debugName={debugName} style={wrapperStyles}>
      {darkenBackground && (
        <Overlay
          debugName={debugName}
          visible={open}
          css={styles.overlay}
          onPress={toggle}
        />
      )}

      <View
        variants={['fixed']}
        style={{
          transform: open ? `translate(0%, 0%)` : hiddenStyle,
          transition: `transform ${animationDuration} ease`,
          [sizeProperty]: size,
          [fullProperty]: '100%',
          ...positioning,
          [position]: 0,
          ...styles.box,
        }}
      >
        {
          showHeader ? (
            <View
              component='header'
              style={[styles.header]}
            >
              {TypeGuards.isString(title) ? <Text style={styles.title} text={title} /> : title}
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

        <View style={styles.body}>{children}</View>

        {footer && (
          <View component='footer' style={styles.footer}>
            {footer}
          </View>
        )}
      </View>
    </View>
  )
}

Drawer.styleRegistryName = 'Drawer'

Drawer.elements = [
  'wrapper',
  'overlay',
  'header',
  'footer',
  'closeButton',
  'body',
  'box',
  'title',
]

Drawer.rootElement = 'wrapper'

Drawer.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Drawer as (props: StyledComponentProps<DrawerProps, typeof styles>) => IJSX
}

Drawer.defaultProps = {
  animationDuration: '0.3s',
  position: 'bottom',
  showCloseButton: false,
  darkenBackground: true,
  size: '75vw',
  title: null,
  closeIcon: 'x' as IconPlaceholder,
} as Partial<DrawerProps>

WebStyleRegistry.registerComponent(Drawer)

export * from './styles'
export * from './types'
