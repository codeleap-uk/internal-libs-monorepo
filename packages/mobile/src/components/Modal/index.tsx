import React from 'react'
import { View } from '../View'
import { Scroll } from '../Scroll'
import { TypeGuards } from '@codeleap/common'
import { Backdrop } from '../Backdrop'
import { useAnimatedVariantStyles, useBackButton } from '../../utils/hooks'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { ActionIcon } from '../ActionIcon'
import { useState } from 'react'
import { ModalHeaderProps, ModalProps } from './types'
import { AnyRecord, AppIcon, getNestedStylesByKey, IJSX, StyledComponentProps, themeStore } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

export * from './styles'
export * from './types'

const DefaultHeader = (props: ModalHeaderProps) => {
  const {
    styles,
    buttonStyles,
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

          {(showClose && closable) ? (
            <ActionIcon
              debugName={`${debugName} modal close button`}
              icon={closeIconName as AppIcon}
              onPress={toggle}
              style={buttonStyles}
            />
          ) : null}
        </View>

        {TypeGuards.isString(description) ? (
          <Text text={description} style={styles.description} />
        ) : (
          description
        )}
      </View>
    )}
  </>
}

export const Modal = (modalProps: ModalProps) => {
  const {
    visible,
    closable,
    footer,
    children,
    toggle = () => null,
    dismissOnBackdrop,
    header = null,
    debugName,
    scroll,
    renderHeader,
    zIndex = null,
    scrollProps = {},
    closeOnHardwareBackPress,
    style,
    ...props
  } = {
    ...Modal.defaultProps,
    ...modalProps,
  }

  const theme = themeStore(store => store?.current) as any

  const [modalHeight, setModalHeight] = useState(0)

  const styles = MobileStyleRegistry.current.styleFor(Modal.styleRegistryName, style)

  const buttonStyles = getNestedStylesByKey('closeButton', styles)

  const boxAnimationStyles = useAnimatedVariantStyles({
    updater: (states) => {
      'worklet'
      return visible ? states['box:visible'] : states['box:hidden']
    },
    animatedProperties: ['box:hidden', 'box:visible'],
    variantStyles: styles,
    transition: styles['box:transition'],
    dependencies: [visible],
  })

  const ScrollComponent = scroll ? Scroll : View
  const scrollStyle = scroll ? styles?.scroll : styles?.innerWrapper

  const heightThreshold = theme?.values?.height * 0.75
  const topSpacing = modalHeight > heightThreshold ? styles?.topSpacing : 0

  const headerProps: ModalHeaderProps = {
    ...modalProps,
    closable,
    styles,
    buttonStyles,
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
      style={[
        styles?.wrapper,
        // @ts-expect-error
        { zIndex: TypeGuards.isNumber(zIndex) ? zIndex : styles?.wrapper?.zIndex, ...topSpacing }
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Backdrop
        visible={visible}
        debugName={`Modal ${debugName} backdrop`}
        style={{
          'wrapper:hidden': styles['backdrop:hidden'],
          'wrapper:visible': styles['backdrop:visible'],
          'wrapper': styles?.backdrop,
        }}
        wrapperProps={{
          // @ts-expect-error
          transition: styles['backdrop:transition'],
        }}
      />

      {/* @ts-expect-error */}
      <ScrollComponent
        style={scrollStyle}
        contentContainerStyle={styles?.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardAware
        animated
        {...scrollProps}
      >
        {dismissOnBackdrop ? (
          <Touchable
            onPress={closable && visible ? toggle : (() => { })}
            debounce={400}
            debugName={'Modal backdrop touchable'}
            style={styles?.backdropTouchable}
            android_ripple={null}
            noFeedback
          />) : null}

        <View
          animated
          style={styles?.box}
          animatedStyle={boxAnimationStyles}
          {...props}
          onLayout={onModalLayout}
        >
          {header ? header : <Header {...headerProps} />}

          <View style={styles?.body}>{children}</View>

          {footer ? (
            <View style={styles?.footer}>
              {typeof footer === 'string' ? <Text text={footer} /> : footer}
            </View>
          ) : null}
        </View>
      </ScrollComponent>
    </View >
  )
}

Modal.styleRegistryName = 'Modal'
Modal.elements = ['box', 'backdrop', 'innerWrapper', 'scroll', 'body', 'footer', 'header', 'title', 'description', 'closeButton', 'topSpacing']
Modal.rootElement = 'wrapper'

Modal.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Modal as (props: StyledComponentProps<ModalProps, typeof styles>) => IJSX
}

Modal.defaultProps = {
  closeIconName: 'close' as AppIcon,
  closable: true,
  dismissOnBackdrop: true,
  scroll: true,
  closeOnHardwareBackPress: true,
}

MobileStyleRegistry.registerComponent(Modal)

export default Modal
