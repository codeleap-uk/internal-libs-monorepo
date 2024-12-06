import { TypeGuards } from '@codeleap/types'
import { useMemo } from '@codeleap/hooks'
import { Overlay } from '../Overlay'
import { View } from '../View'
import { Text } from '../Text'
import { ActionIcon } from '../ActionIcon'
import ReactDOM from 'react-dom'
import { useAnimatedStyle, usePopState } from '../../lib'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { DrawerProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

export * from './styles'
export * from './types'

const axisMap = {
  'left': ['top', 'left'],
  'right': ['top', 'right'],
  'top': ['top', 'right', 'left'],
  'bottom': ['bottom', 'right', 'left']
}

const getInsetPath = (position: DrawerProps['position'], value: number) => {
  let inset = ''

  switch (position) {
    case 'left':
      inset = `inset(0 ${value}% 0 0)`
      break
    case 'right':
      inset = `inset(0 0 0 ${value}%)`
      break
    case 'top':
      inset = `inset(0 0 ${value}% 0)`
      break
    case 'bottom':
      inset = `inset(${value}% 0 0 0)`
      break
  }

  return inset
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
    debugName,
    closeIcon,
  } = {
    ...Drawer.defaultProps,
    ...props,
  }

  usePopState(open, toggle)

  const styles = useStylesFor(Drawer.styleRegistryName, style)

  const closeButtonStyles = useNestedStylesByKey('closeButton', styles)

  const pose = useMemo(() => {
    const pose = {}

    for (const p of axisMap[position]) {
      pose[p] = 0
    }

    return pose
  }, [])

  const expansionProperty = ['left', 'right'].includes(position) ? 'width': 'height'
  const fixedProperty = expansionProperty == 'width' ? 'height' : 'width'
  const fixedValue = fixedProperty == 'width' ? '100vw' : '100vh'
  const measureProperty = expansionProperty == 'width' ? 'svw' : 'svh'

  const animatedStyle = useAnimatedStyle(() => {
    const value = open ? 0 : 100

    return {
      clipPath: getInsetPath(position, value),
      transition: {
        duration: 0.25,
      }
    }
  }, [open])

  const wrapperAnimatedStyle = useAnimatedStyle(() => ({
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none',
    transition: {
      duration: open ? 0.2 : 1.5,
    }
  }), [open])

  const boxStyles = [
    styles.box,
    pose,
    {
      zIndex: 999,
      position: 'fixed',
      [fixedProperty]: fixedValue,
      [expansionProperty]: `${size}${measureProperty}`
    }
  ]

  const showHeader = (!TypeGuards.isNil(title) || showCloseButton)

  const content = (
    <View 
      debugName={debugName} 
      animated
      animatedProps={wrapperAnimatedStyle}
      style={styles.wrapper}
    >
      {darkenBackground ? (
        <Overlay
          debugName={debugName}
          visible={open}
          style={[
            styles.overlay,
            open ? styles['overlay:visible'] : styles['overlay:hidden'],
          ]}
          onPress={toggle}
        />
      ) : null}

      <View animated animatedProps={animatedStyle} style={boxStyles}>
        {
          showHeader ? (
            <View component='header' style={styles.header}>
              {TypeGuards.isString(title) ? <Text style={styles.title} text={title} /> : title}
              
              {showCloseButton ? (
                <ActionIcon
                  debugName={debugName}
                  icon={closeIcon as AppIcon}
                  onPress={toggle}
                  propagate={false}
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

  if (typeof window === 'undefined') return content

  return ReactDOM.createPortal(
    content,
    document.body,
  )
}

Drawer.styleRegistryName = 'Drawer'
Drawer.elements = ['wrapper', 'overlay', 'header', 'footer', 'closeButton', 'body', 'box', 'title']
Drawer.rootElement = 'wrapper'

Drawer.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Drawer as (props: StyledComponentProps<DrawerProps, typeof styles>) => IJSX
}

Drawer.defaultProps = {
  position: 'left',
  showCloseButton: false,
  darkenBackground: true,
  size: 75,
  closeIcon: 'x' as AppIcon,
} as Partial<DrawerProps>

WebStyleRegistry.registerComponent(Drawer)
