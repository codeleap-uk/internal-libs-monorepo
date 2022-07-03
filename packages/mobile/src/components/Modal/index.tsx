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
import { Text } from '../Text'
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
  keyboardAware?: boolean
}

export const Modal: React.FC<ModalProps> = (modalProps) => {
  const {
    variants = [],
    styles = {},
    visible,
    showClose,
    closable = true,
    title,
    footer,
    children,
    toggle = () => null,
    dismissOnBackdrop = true,
    closeIconName = 'close',
    debugName,
    scroll = true,
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
  return (
    <View style={[wrapperStyle, { zIndex: TypeGuards.isNumber(zIndex) ? zIndex : wrapperStyle?.zIndex }]} pointerEvents={visible ? 'auto' : 'none'}>

      <Backdrop visible={visible} debugName={`Modal ${debugName} backdrop`} styles={{
        'wrapper:hidden': variantStyles['backdrop:hidden'],
        'wrapper:visible': variantStyles['backdrop:visible'],
        wrapper: variantStyles.backdrop,
      }}
      wrapperProps={{
        transition: { ...variantStyles['backdrop:transition'] },
      }}
      />
      <Scroll
        style={getStyles('innerWrapper')}
        contentContainerStyle={getStyles('innerWrapperScroll')}
        scrollEnabled={scroll}
        keyboardAware={keyboardAware}
      >
        <Touchable
          feedbackVariant='none'
          onPress={(dismissOnBackdrop && closable) ? toggle : (() => {})}
          debugName={'Modal backdrop touchable'}
          style={variantStyles.backdropTouchable}
          android_ripple={null}
        />
        <View
          animated
          state={boxAnimation}
          style={getStyles('box')}
          transition={{ ...variantStyles['box:transition'] }}
          {...props}
        >
          {(title || showClose) && (
            <View style={getStyles('header')}>
              {typeof title === 'string' ? (
                <Text text={title} style={getStyles('title')} />
              ) : (
                title
              )}

              {(showClose && closable) && (
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
        </View>
      </Scroll>
    </View>

  )
}

export default Modal
