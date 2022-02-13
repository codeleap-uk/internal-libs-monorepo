import * as React from 'react'
import { View, ViewProps, AnimatedView } from '../View'
import { Button, ButtonProps } from '../Button'
import { Scroll } from '../Scroll'
import {
  capitalize,
  ComponentVariants,
  IconPlaceholder,
  onUpdate,
  useComponentStyle,
  useStyle,
} from '@codeleap/common'
import {
  MobileModalComposition,
  MobileModalStyles,
  MobileModalParts,
} from './styles'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types/utility'

import { Touchable } from '../Touchable'
import { Text } from '../Text'
import { Animated } from '../Animated'

export * from './styles'

export type ModalProps = Omit<ViewProps, 'variants' | 'styles'> & {
  variants?: ComponentVariants<typeof MobileModalStyles>['variants'];
  styles?: StylesOf<MobileModalComposition>;
  dismissOnBackdrop?: boolean;
  buttonProps?: ButtonProps;
  accessible?: boolean;
  showClose?: boolean;
  closable?: boolean;
  footer?: React.ReactNode;
  title?: React.ReactNode;
  debugName?: string;
  closeIconName?: IconPlaceholder;
  visible: boolean;
  toggle?: () => void;
  scroll: boolean;
};

export const Modal: React.FC<ModalProps> = (modalProps) => {
  const {
    variants = [],
    styles = {},
    style,
    visible,
    showClose,
    closable = true,
    title,
    footer,
    children,
    toggle,
    dismissOnBackdrop = true,
    closeIconName = 'close',
    debugName,
    scroll = true,
    ...props
  } = modalProps

  const variantStyles = useComponentStyle('Modal', {
    variants: variants as any,
    transform: StyleSheet.flatten,
    styles,
  }) as ModalProps['styles']

  function getStyles(key: MobileModalParts) {
    const s = [
      variantStyles[key],
      styles[key],
      visible ? variantStyles[key + ':visible'] : {},
      visible ? styles[key + ':visible'] : {},
    ]

    return s
  }

  const buttonStyles = React.useMemo(() => {
    const buttonEntries = {}

    for (const [key, style] of Object.entries(variantStyles)) {
      if (key.startsWith('closeButton')) {
        buttonEntries[capitalize(key.replace('closeButton', ''), true)] = style
      }
    }
    return buttonEntries
  }, [variantStyles])

  const boxAnimation = {
    hidden: {
      ...variantStyles['box:pose'],
      ...styles['box:pose'],
    },
    visible: {
      ...variantStyles['box:pose:visible'],
      ...styles['box:pose:visible'],
    },
  }

  return (
    <View
      style={getStyles('wrapper')}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <AnimatedView style={getStyles('overlay')} transition={'opacity'} />
      <Scroll
        style={getStyles('innerWrapper')}
        contentContainerStyle={getStyles('innerWrapperScroll')}
        scrollEnabled={scroll}
      >
        {dismissOnBackdrop && (
          <Touchable
            debugName={`${debugName} modal backdrop`}
            activeOpacity={1}
            onPress={() => toggle()}
            style={getStyles('touchableBackdrop')}
          />
        )}
        <Animated
          component='View'
          config={boxAnimation}
          pose={visible ? 'visible' : 'hidden'}
          style={getStyles('box')}
        >
          {(title || showClose) && (
            <View style={getStyles('header')}>
              {typeof title === 'string' ? (
                <Text text={title} style={getStyles('title')} />
              ) : (
                title
              )}

              {showClose && closable && (
                <Button
                  debugName={`${debugName} modal close button`}
                  icon={closeIconName as IconPlaceholder}
                  variants={['icon']}
                  onPress={toggle}
                  styles={buttonStyles}
                />
              )}
            </View>
          )}

          <View style={getStyles('body')}>{children}</View>
          {footer && (
            <View style={getStyles('footer')}>
              {typeof footer === 'string' ? <Text text={footer} /> : footer}
            </View>
          )}
        </Animated>
      </Scroll>
    </View>
  )
}

export default Modal
