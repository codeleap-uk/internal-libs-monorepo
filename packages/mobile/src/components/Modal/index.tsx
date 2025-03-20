import React, { Fragment } from 'react'
import { View } from '../View'
import { Scroll } from '../Scroll'
import { TypeGuards } from '@codeleap/types'
import { Backdrop } from '../Backdrop'
import { useBackButton } from '../../utils/hooks'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { ActionIcon } from '../ActionIcon'
import { ModalHeaderProps, ModalProps } from './types'
import { AnyRecord, AppIcon, useNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { Portal } from '@gorhom/portal'

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
      <View style={styles.header}>
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
    header,
    debugName,
    scroll,
    renderHeader: Header,
    scrollProps = {},
    closeOnHardwareBackPress,
    style,
    boxExiting,
    boxEntering,
    withPortal,
    ...props
  } = {
    ...Modal.defaultProps,
    ...modalProps,
  }

  const styles = useStylesFor(Modal.styleRegistryName, style)

  const buttonStyles = useNestedStylesByKey('closeButton', styles)

  const ScrollComponent = scroll ? Scroll : View
  const scrollStyle = scroll ? styles?.scroll : styles?.innerWrapper

  const Wrapper = withPortal ? Portal : Fragment

  useBackButton(() => {
    if (visible && closeOnHardwareBackPress) {
      toggle()
      return true
    }
  }, [visible, toggle, closeOnHardwareBackPress])

  return (
    <Wrapper>
      <View style={styles?.wrapper} pointerEvents={visible ? 'auto' : 'none'}>
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

        <ScrollComponent
          contentContainerStyle={styles?.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardAware
          animated
          {...scrollProps}
          style={scrollStyle}
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
          {
            visible ? (
              <View
                animated
                // @ts-ignore
                entering={boxEntering}
                exiting={boxExiting}
                {...props}
                style={styles?.box}
              >
                {header ? header : (
                  <Header
                    {...modalProps}
                    closable={closable}
                    styles={styles}
                    buttonStyles={buttonStyles}
                  />
                )}

                <View style={styles?.body}>{children}</View>

                {footer ? (
                  <View style={styles?.footer}>
                    {typeof footer === 'string' ? <Text text={footer} /> : footer}
                  </View>
                ) : null}
              </View>
            ) : null
          }
        </ScrollComponent>
      </View>
    </Wrapper>
  )
}

Modal.styleRegistryName = 'Modal'
Modal.elements = ['wrapper', 'box', 'backdrop', 'innerWrapper', 'scroll', 'body', 'footer', 'header', 'title', 'description', 'closeButton']
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
  boxEntering: FadeIn.duration(100).delay(150).build(),
  boxExiting: FadeOut.duration(100).build(),
  withPortal: true,
  renderHeader: DefaultHeader,
} as Partial<ModalProps>

MobileStyleRegistry.registerComponent(Modal)