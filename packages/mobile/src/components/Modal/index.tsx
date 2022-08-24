import * as React from 'react'
import { View, ViewProps } from '../View'
import { Button, ButtonProps } from '../Button'
import { Scroll } from '../Scroll'
import {
  ComponentVariants,
  getNestedStylesByKey,
  IconPlaceholder,
  onUpdate,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import {
  ModalComposition,
  ModalStyles,
  ModalParts,
} from './styles'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types/utility'

import { useDynamicAnimation } from 'moti'
import { Backdrop } from '../Backdrop'
import { useStaticAnimationStyles } from '../../utils/hooks'
import { Text, TextProps } from '../Text'
import { Touchable } from '../Touchable'

export * from './styles'

export type ModalProps = Omit<ViewProps, 'variants' | 'styles'> & {
  variants?: ComponentVariants<typeof ModalStyles>['variants']
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
  scroll?: boolean
  header?: React.ReactElement
  keyboardAware?: boolean
  renderHeader?: (props: ModalHeaderProps) => React.ReactElement
}

export type ModalHeaderProps = Omit<ModalProps, 'styles' | 'renderHeader'> & {
  styles: {
    wrapper: ViewProps['style']
    title: TextProps['style']
    closeButton: ButtonProps['styles']
  }
}

const DefaultHeader:React.FC<ModalHeaderProps> = (props) => {
  const { styles, title = null, showClose = false, closable, debugName, closeIconName = 'close', toggle } = props
  return <>
    {(title || showClose) && (
      <View style={styles.wrapper}>
        {typeof title === 'string' ? (
          <Text text={title} style={styles.title} />
        ) : (
          title
        )}

        {(showClose && closable) && (
          <Button
            debugName={`${debugName} modal close button`}
            icon={closeIconName as IconPlaceholder}
            variants={['icon']}
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
    keyboardAware = true,
    zIndex = null,
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

  const boxAnimation = useDynamicAnimation(() => {
    return visible ? boxAnimationStates['box:visible'] : boxAnimationStates['box:hidden']
  })

  onUpdate(() => {
    boxAnimation.animateTo(visible ? boxAnimationStates['box:visible'] : boxAnimationStates['box:hidden'])
  }, [visible])
  const wrapperStyle = getStyles('wrapper')
  const ScrollComponent = scroll ? Scroll : View
  const scrollStyle = scroll ? getStyles('innerWrapper') : [getStyles('innerWrapper'), getStyles('innerWrapperScroll')]

  const headerProps:ModalHeaderProps = {
    ...modalProps,
    styles: {
      wrapper: getStyles('header'),
      title: getStyles('title'),
      closeButton: buttonStyles,
    },
  }
  const Header = renderHeader || DefaultHeader

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
        contentContainerStyle={getStyles('innerWrapperScroll')}
        scrollEnabled={scroll}
        keyboardAware={keyboardAware}
      >
        {dismissOnBackdrop &&
          <Touchable
            onPress={ closable ? toggle : (() => {})}
            debugName={'Modal backdrop touchable'}
            style={variantStyles.backdropTouchable}
            android_ripple={null}
            noFeedback
          />}
        <View
          animated
          state={boxAnimation}
          style={getStyles('box')}
          transition={{ ...variantStyles['box:transition'] }}
          {...props}
        >

          {header ? header : <Header {...headerProps}/>}

          <View style={getStyles('body')}>{children}</View>
          {footer && (
            <View style={getStyles('footer')}>
              {typeof footer === 'string' ? <Text text={footer} /> : footer}
            </View>
          )}
        </View>
      </ScrollComponent>
    </View>

  )
}

export default Modal
