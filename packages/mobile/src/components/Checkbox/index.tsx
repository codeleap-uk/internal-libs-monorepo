import * as React from 'react'
import { CheckboxStyles, CheckboxComposition, ComponentVariants, useComponentStyle, StylesOf, useStyle } from '@codeleap/common'
import { ComponentPropsWithRef, forwardRef, ReactNode } from 'react'
import { Switch as NativeCheckbox } from 'react-native'
import { InputLabel } from '../TextInput'
import { View } from '../View'
import { Touchable } from '../Touchable'

export * from './styles'

type NativeCheckboxProps = Omit<
    ComponentPropsWithRef<typeof NativeCheckbox>, 
    'thumbColor'|'trackColor'
>
type CheckboxProps = NativeCheckboxProps & {
    variants?: ComponentVariants<typeof CheckboxStyles>['variants']
    label?: ReactNode
    styles?: StylesOf<CheckboxComposition>
} 

export const Checkbox = forwardRef<NativeCheckbox,CheckboxProps>((checkboxProps,ref) => {
    const  {
        variants = [],
        style = {},
        styles = {},
        label,
        value,
        onValueChange,
        ...props
    } = checkboxProps

    const variantStyles = useComponentStyle('Checkbox', {
        variants,
        styles
    })

    function getStyles(key:CheckboxComposition){
        return [
            variantStyles[key],
            key === 'wrapper' ? style : {},
            value ? variantStyles[key + ':checked'] : {},
            checkboxProps.disabled ? variantStyles[key + ':disabled'] : {},
            
        ]
    }


    return <Touchable  style={getStyles('wrapper')} onPress={() => onValueChange(!value)}>
        <View style={getStyles('checkmarkWrapper')}>
            <View style={getStyles('checkmark')}/>
        </View>
        <InputLabel label={label} style={getStyles('label')}/>

    </Touchable>
})