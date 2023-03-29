import * as React from 'react'
import { AnimatedView, View, ViewProps } from '../View'
import { ButtonProps } from '../Button'
import { Scroll } from '../Scroll'
import {
  ComponentVariants,
  getNestedStylesByKey,
  IconPlaceholder,
  PropsOf,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import {
  ModalComposition,
  ModalPresets,
  ModalParts,
} from './styles'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types/utility'

import { Backdrop } from '../Backdrop'
import { useAnimatedVariantStyles, useBackButton, useStaticAnimationStyles } from '../../utils/hooks'
import { Text, TextProps } from '../Text'
import { Touchable } from '../Touchable'
import { GetKeyboardAwarePropsOptions } from '../../utils'
import { ActionIcon } from '../ActionIcon'

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
  keyboardAware?: GetKeyboardAwarePropsOptions
  scrollProps?: PropsOf<typeof Scroll, 'ref'>
}

export type ModalHeaderProps = Omit<ModalProps, 'styles' | 'renderHeader'> & {
  styles: {
    wrapper: ViewProps['style']
    title: TextProps['style']
    closeButton: ButtonProps['styles']
  }
  description?: React.ReactElement
}

const DefaultHeader:React.FC<ModalHeaderProps> = (props) => {
  const { styles, title = null, showClose = false, description = null, closable, debugName, closeIconName = 'close', toggle } = props
  return <>
    {(title || showClose || description) && (
      <View style={styles.wrapper}>
        {typeof title === 'string' ? (
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
    )}</>
}

export const Modal: React.FC<ModalProps> = (modalProps) => {
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
  } = modalProps
  const variantStyles = useDefaultComponentStyle('u:Modal', {
    variants: variants as any,
    transform: StyleSheet.flatten,
    styles,
  }) as ModalProps['styles']

  function getStyles(key: ModalParts) {
    const s = [
      variantStyles[key],
      styles[key],
    ]

    return StyleSheet.flatten(s)
  }
  const buttonStyles = React.useMemo(() => getNestedStylesByKey('closeButton', variantStyles), [variantStyles])

  const boxAnimationStates = useStaticAnimationStyles(variantStyles, ['box:hidden', 'box:visible'])

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

  const headerProps:ModalHeaderProps = {

    ...modalProps,
    closable,
    styles: {
      wrapper: getStyles('header'),
      title: getStyles('title'),
      closeButton: buttonStyles,
    },
  }
  const Header = renderHeader || DefaultHeader

  useBackButton(() => {
    if (visible && closeOnHardwareBackPress) {
      toggle()
      return true
    }
  }, [visible, toggle, closeOnHardwareBackPress])

  return (
    <View
      style={[wrapperStyle, { zIndex: TypeGuards.isNumber(zIndex) ? zIndex : wrapperStyle?.zIndex }]}
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
        keyboardAware= {{
          adapt: 'maxHeight',
          baseStyleProp: 'style',
          animated: true,
          enabled: visible,
          // enableOnAndroid: true,
        }}
        animated
        // ref={scrollRef}
        { ...scrollProps}
      >
        {dismissOnBackdrop &&
          <Touchable
            onPress={ closable ? toggle : (() => {})}
            debounce={400}
            debugName={'Modal backdrop touchable'}
            style={variantStyles.backdropTouchable}
            android_ripple={null}
            noFeedback
          />}

        <AnimatedView

          style={[getStyles('box'), boxAnimationStyles]}
          // transition={{ ...variantStyles['box:transition'] }}

          {...props}
        >

          {header ? header : <Header {...headerProps}/>}

          <View style={getStyles('body')}>{children}</View>
          {footer && (
            <View style={getStyles('footer')}>
              {typeof footer === 'string' ? <Text text={footer} /> : footer}
            </View>
          )}
        </AnimatedView>

      </ScrollComponent>
    </View>

  )
}

export default Modal
