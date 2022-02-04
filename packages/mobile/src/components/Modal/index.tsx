import * as React from 'react' 
import { 
    View,
    ViewProps
} from '../View'
import {  Button, ButtonProps } from '../Button'
import { Scroll } from '../Scroll'
import { capitalize, ComponentVariants, IconPlaceholder, useComponentStyle, useStyle } from '@codeleap/common'
import { MobileModalComposition, MobileModalStyles, MobileModalParts } from './styles'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types/utility'
import { Text } from '../Text'
import posed from 'react-native-pose'
import { Overlay } from '../Overlay'
import { useLogStyles } from '../../utils/styles'
import { Animated } from '../Animated'

export * from './styles'

export type ModalProps = Omit<ViewProps, 'variants'|'styles'> & {
    onClose?: () => void
    visible?: boolean
    variants?: ComponentVariants<typeof MobileModalStyles>['variants']
    styles?: StylesOf<MobileModalComposition>
    dismissOnBackdrop?: boolean
    buttonProps?: ButtonProps
    accessible?:boolean
    showClose?: boolean
    closable?: boolean
    footer?: React.ReactNode
    title?: React.ReactNode;
    debugName?: string
    toggle?: () => void
}
 
export const Modal:React.FC<ModalProps> = (modalProps) => {

   const {
    variants = [], 
    styles = { }, 
    style, 
    visible,
    showClose,
    closable,
    title,
    footer,
    children,
    toggle,
    debugName,
    ...props
    } = modalProps
  
  const variantStyles = useComponentStyle('Modal', {
    variants:  variants as any,
    transform: StyleSheet.flatten,
    styles
  }) as ModalProps['styles']

  

  function getStyles(key:MobileModalParts){
    const s =  [
      variantStyles[key],
      visible ?  variantStyles[key + ':visible'] : {}
    ]

    return s
  }

  const buttonStyles = React.useMemo(() => {
    const buttonEntries = {}

    for(const [key,style] of Object.entries(variantStyles)){
        if(key.startsWith('button')){
            buttonEntries[capitalize(key.replace('button', ''), true)] = getStyles(key as MobileModalParts)
        }
    }

    return buttonEntries
  }, [variantStyles])


  const boxPoses = {
    visible: {...variantStyles['box:pose:visible']},
    hidden: {...variantStyles['box:pose']}
  }

  
  return (
    <Overlay   onPress={() => visible && toggle()} visible={visible} styles={variantStyles}> 
      <Scroll  style={getStyles('innerWrapper')} pointerEvents={visible ? 'auto' : 'none'} contentContainerStyle={getStyles('innerWrapperScroll')}>
        <Animated component='View' config={boxPoses} pose={ visible ?'visible' :'hidden' } style={getStyles('box')}>
            <View style={getStyles('header')}>
                {typeof title === 'string' ? <Text text={title} style={getStyles('title')}/> : title}
                
                {
                (showClose && closable) &&
                    <Button styles={buttonStyles} rightIcon={'close' as IconPlaceholder} variants={['icon']} onPress={toggle}/>
                }
            </View>
            <View style={getStyles('body')}>
                {children}
            </View>
            {
                footer && <View  css={getStyles('footer')}> 
                    {footer}
                </View>
            }
        </Animated>    
      </Scroll>
     </Overlay>
   
      
  )
}



export default Modal