import * as React from 'react'
import { View, ViewProps } from '../View'
import { ButtonProps } from '../Button'
import { Scroll } from '../Scroll'
import {
  ComponentVariants,
  getNestedStylesByKey,
  IconPlaceholder,
  PropsOf,
  TypeGuards,
  useDefaultComponentStyle,
  useRef,
  useCodeleapContext,
} from '@codeleap/common'
import {
  ModalComposition,
  ModalPresets,
  ModalParts,
} from './styles'
import { ScrollView, StyleSheet } from 'react-native'
import { StylesOf } from '../../types/utility'

import { Backdrop } from '../Backdrop'
import { useAnimatedVariantStyles, useBackButton } from '../../utils/hooks'
import { Text, TextProps } from '../Text'
import { Touchable } from '../Touchable'
import { ActionIcon } from '../ActionIcon'
import { useState } from 'react'

export * from './styles'

export type ModalProps = Omit<ViewProps, 'variants' | 'styles'> & {
  variants?: ComponentVariants<typeof ModalPresets>['variants']
  styles?: StylesOf<ModalComposition>
  dismissOnBackdrop?: boolean
  buttonProps?: ButtonProps
  accessible?: boolean
  showClose?: boolean
  closable?: boolean
  footer?: React.ReactNode
  title?: React.ReactNode
  debugName: string
  closeIconName?: IconPlaceholder
  visible: boolean
  toggle?: () => void
  zIndex?: number
  description?: React.ReactElement
  scroll?: boolean
  header?: React.ReactElement
  closeOnHardwareBackPress?: boolean
  renderHeader?: (props: ModalHeaderProps) => React.ReactElement
  keyboardAware?: boolean
  scrollProps?: PropsOf<typeof Scroll, 'ref'>
}

export type ModalHeaderProps = Omit<ModalProps, 'styles' | 'renderHeader'> & {
  styles: {
    wrapper: ViewProps['style']
    titleWrapper: ViewProps['style']
    title: TextProps['style']
    description: TextProps['style']
    closeButton: ButtonProps['styles']
  }
  description?: React.ReactElement
}

const DefaultHeader = (props: ModalHeaderProps) => {
  const {
    styles,
    title = null,
    showClose = false,
    description = null,
    closable, debugName,
    closeIconName = 'x',
    toggle,
  } = props
  return <>
    {(title || showClose || description) && (
      <View style={styles.wrapper}>
        <View style={styles.titleWrapper}>
          {TypeGuards.isString(title) ? (
            <Text text={title} style={styles.title} />
          ) : (
            title
          )}

          {(showClose && closable) && (
            <ActionIcon
              debugName={`${debugName} modal close button`}
              icon={closeIconName as IconPlaceholder}
              onPress={toggle}
              styles={styles.closeButton}
            />
          )}
        </View>

        {TypeGuards.isString(description) ? (
          <Text text={description} style={styles.description} />
        ) : (
          description
        )}
      </View>
    )}</>
}

export const Modal = (modalProps: ModalProps) => {
  const {
    variants = [],
    styles = {},
    visible,

    closable = true,

    footer,
    children,
    toggle = () => null,
    dismissOnBackdrop = true,
    header = null,
    debugName,
    scroll = true,
    renderHeader,
    zIndex = null,
    scrollProps = {},
    closeOnHardwareBackPress = true,
    ...props
  } = {
    ...Modal.defaultProps,
    ...modalProps,
  }
  const [modalHeight, setModalHeight] = useState(0)
  const { Theme } = useCodeleapContext()

  const variantStyles = useDefaultComponentStyle('u:Modal', {
    variants: variants as any,
    transform: StyleSheet.flatten,
    styles,
  }) as ModalProps['styles']
  const scrollRef = useRef<ScrollView>(null)
  function getStyles(key: ModalParts) {
    const s = [
      variantStyles[key],
      styles[key],
    ]

    return StyleSheet.flatten(s)
  }
  const buttonStyles = React.useMemo(() => getNestedStylesByKey('closeButton', variantStyles), [variantStyles])

  const boxAnimationStyles = useAnimatedVariantStyles({
    updater: (states) => {
      'worklet'
      return visible ? states['box:visible'] : states['box:hidden']
    },
    animatedProperties: ['box:hidden', 'box:visible'],
    variantStyles,
    transition: variantStyles['box:transition'],
    dependencies: [visible],
  })

  const wrapperStyle = getStyles('wrapper')

  const ScrollComponent = scroll ? Scroll : View
  const scrollStyle = scroll ? getStyles('scroll') : getStyles('innerWrapper')

  const heightThreshold = Theme.values.height * 0.75
  const topSpacing = modalHeight > heightThreshold ? variantStyles.topSpacing : Theme.spacing.paddingTop(0)

  const headerProps: ModalHeaderProps = {

    ...modalProps,
    closable,
    styles: {
      wrapper: getStyles('header'),
      title: getStyles('title'),
      description: getStyles('description'),
      closeButton: buttonStyles,
      titleWrapper: getStyles('titleWrapper'),
    },
  }
  const Header = renderHeader || DefaultHeader

  useBackButton(() => {
    if (visible && closeOnHardwareBackPress) {
      toggle()
      return true
    }
  }, [visible, toggle, closeOnHardwareBackPress])

  const onModalLayout = (event) => {
    const { height } = event.nativeEvent.layout
    setModalHeight(height)
    props?.onLayout?.(event)
  }

  return (
    <View
      style={[wrapperStyle, {
        zIndex: TypeGuards.isNumber(zIndex) ? zIndex : wrapperStyle?.zIndex, ...topSpacing,
      }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >

      <Backdrop visible={visible} debugName={`Modal ${debugName} backdrop`} styles={{
        'wrapper:hidden': variantStyles['backdrop:hidden'],
        'wrapper:visible': variantStyles['backdrop:visible'],
        wrapper: variantStyles.backdrop,
      }}
        wrapperProps={{
          transition: { ...variantStyles['backdrop:transition'] },
        }}
      />
      <ScrollComponent
        style={scrollStyle}
        contentContainerStyle={getStyles('scrollContent')}
        showsVerticalScrollIndicator={false}
        keyboardAware
        animated

        {...scrollProps}
      >
        {dismissOnBackdrop &&
          <Touchable
            onPress={closable && visible ? toggle : (() => { })}
            debounce={400}
            debugName={'Modal backdrop touchable'}
            style={variantStyles.backdropTouchable}
            android_ripple={null}
            noFeedback
          />}

        <View
          animated
          style={[getStyles('box'), boxAnimationStyles]}
          {...props}
          onLayout={onModalLayout}
        >

          {header ? header : <Header {...headerProps} />}

          <View style={getStyles('body')}>{children}</View>
          {footer && (
            <View style={getStyles('footer')}>
              {typeof footer === 'string' ? <Text text={footer} /> : footer}
            </View>
          )}
        </View>

      </ScrollComponent>
    </View >

  )
}

Modal.defaultProps = {
  closeIconName: 'close' as IconPlaceholder,
}

export default Modal
