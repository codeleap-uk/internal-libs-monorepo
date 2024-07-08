import { TypeGuards } from '@codeleap/common'
import React, { CSSProperties, useMemo } from 'react'
import { Overlay } from '../Overlay'
import { View } from '../View'
import { Text } from '../Text'
import { ActionIcon } from '../ActionIcon'
import { usePopState } from '../../lib'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { DrawerProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

export * from './styles'
export * from './types'

export const axisMap = {
  top: [-1, 'Y'],
  bottom: [1, 'Y'],
  left: [-1, 'X'],
  right: [1, 'X'],
} as const

const resolveHiddenDrawerPosition = (position: DrawerProps['position']): [string, string, CSSProperties] => {
  const [translateOrient, translateAxis] = axisMap[position]

  const translateValues = {
    X: 0,
    Y: 0,
  }

  translateValues[translateAxis] = 100 * translateOrient

  const css = `translate(${translateValues.X}%, ${translateValues.Y}%)`
  const positioningKeys = translateAxis === 'X' ? ['top', 'bottom'] : ['left', 'right']
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
    closeButtonProps,
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

  const wrapperStyles = useMemo(() => ([
    {
      ...styles.wrapper,
      transition: 'visibility 0.01s ease',
      transitionDelay: open ? '0' : animationDuration,
      visibility: open ? 'visible' : 'hidden',
    },
  ]), [open, styles.wrapper])

  const boxStyle = {
    transform: open ? `translate(0%, 0%)` : hiddenStyle,
    transition: `transform ${animationDuration} ease`,
    [sizeProperty]: size,
    [fullProperty]: '100%',
    ...positioning,
    [position]: 0,
    ...styles.box,
  }

  return (
    <View debugName={debugName} style={wrapperStyles}>
      {darkenBackground ? (
        <Overlay
          debugName={debugName}
          visible={open}
          style={styles.overlay}
          onPress={toggle}
        />
      ) : null}

      <View style={boxStyle}>
        {
          showHeader ? (
            <View component='header' style={styles.header}>
              {TypeGuards.isString(title) ? <Text style={styles.title} text={title} /> : title}
              {showCloseButton ? (
                <ActionIcon
                  debugName={debugName}
                  onPress={toggle}
                  icon={closeIcon as AppIcon}
                  {...closeButtonProps}
                  style={closeButtonStyles}
                />
              ) : null}
            </View>
          ) : null
        }

        <View style={styles.body}>{children}</View>

        {footer ? (
          <View component='footer' style={styles.footer}>
            {footer}
          </View>
        ) : null}
      </View>
    </View>
  )
}

Drawer.styleRegistryName = 'Drawer'
Drawer.elements = ['wrapper', 'overlay', 'header', 'footer', 'closeButton', 'body', 'box', 'title']
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
  closeIcon: 'x' as AppIcon,
} as Partial<DrawerProps>

WebStyleRegistry.registerComponent(Drawer)
