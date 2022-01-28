import * as React from 'react'
import { SwitchStyles,SwitchComposition, ComponentVariants, useComponentStyle, StylesOf, useStyle } from '@codeleap/common'
import { ComponentPropsWithRef, forwardRef, ReactNode } from 'react'
import { StyleSheet, Switch as NativeSwitch } from 'react-native'
import { InputLabel } from './TextInput'
import { View } from './View'

type NativeSwitchProps = Omit<
    ComponentPropsWithRef<typeof NativeSwitch>, 
    'thumbColor'|'trackColor'
>
type SwitchProps = NativeSwitchProps & {
    variants?: ComponentVariants<typeof SwitchStyles>['variants']
    label?: ReactNode
    styles?: StylesOf<SwitchComposition> 
} 

export const Switch = forwardRef<NativeSwitch,SwitchProps>((switchProps,ref) => {
    const  {
        variants = [],
        style = {},
        styles = {},
        label,
        ...props
    } = switchProps

    const variantStyles = useComponentStyle('Switch', {
        variants,
        styles
    })

    function getStyles(key:SwitchComposition){
        return [
            variantStyles[key],
            key === 'wrapper' ? style : {},
            switchProps.value ? variantStyles[key + ':on'] : {},
            switchProps.disabled ? variantStyles[key + ':disabled'] : {},
         
        ]
    }

    const inputStyles = getStyles('input')

    const {color,backgroundColor} = StyleSheet.flatten(inputStyles)
    const {Theme} = useStyle()

    const thumbColor = color || Theme.colors.primary
    const trackColor =  backgroundColor || Theme.colors.gray
    return <View style={getStyles('wrapper')}>
        <NativeSwitch 
        //    style={inputStyles}
           thumbColor={thumbColor}
           trackColor={{ false:trackColor,  true: trackColor}}
           ios_backgroundColor="#3e3e3e"
            {...props}
        />
        <InputLabel label={label} style={getStyles('label')}/>

    </View>
})