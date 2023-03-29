import * as React from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  StylesOf,
  Form,
  useValidate,
  GetRefType,
  PropsOf,
} from '@codeleap/common'
import { ComponentPropsWithRef, forwardRef, ReactNode } from 'react'
import { StyleSheet, Switch as NativeCheckbox } from 'react-native'
import { FormError } from '../TextInput'
import { View } from '../View'
import { Touchable } from '../Touchable'
import {
  CheckboxComposition, CheckboxPresets,
} from './styles'
import { InputLabel } from '../InputLabel'
export * from './styles'

type NativeCheckboxProps = Omit<
  ComponentPropsWithRef<typeof NativeCheckbox>,
  'thumbColor' | 'trackColor'
>
type CheckboxProps = NativeCheckboxProps & {
  variants?: ComponentVariants<typeof CheckboxPresets>['variants']
  label?: ReactNode
  styles?: StylesOf<CheckboxComposition>
  validate?: Form.ValidatorFunctionWithoutForm | string
  required?: boolean
}

export const Checkbox = forwardRef<GetRefType<PropsOf<typeof View>['ref']>, CheckboxProps>(
  (checkboxProps, ref) => {
    const {
      variants = [],
      style = {},
      styles = {},
      label,
      value,
      onValueChange,
      validate,
      required,
      ...props
    } = checkboxProps

    const variantStyles = useDefaultComponentStyle<'u:Checkbox', typeof CheckboxPresets>('u:Checkbox', {
      variants,
      styles,
      transform: StyleSheet.flatten,
    })

    const { error, showError } = useValidate(value, validate)

    function getStyles(key: CheckboxComposition, styleObj = variantStyles) {
      return [
        styleObj[key],
        value ? styleObj[key + ':checked'] : {},
        showError ? styleObj[key + ':error'] : {},
        checkboxProps.disabled ? styleObj[key + ':disabled'] : {},
      ]
    }

    return (
      <View style={[getStyles('wrapper'), style]} ref={ref} {...props}>
        <Touchable
          debugName={`Set checkbox value to ${!value}`}
          style={getStyles('input')}
          onPress={() => onValueChange(!value)}
          styles={{
            feedback: getStyles('inputFeedback'),
          }}
        >
          <View style={getStyles('checkmarkWrapper')}>
            <View style={getStyles('checkmark')} />
          </View>

          <InputLabel label={label} styles={{
            asterisk: getStyles('labelAsterisk'),
            wrapper: getStyles('labelWrapper'),
            text: getStyles('labelText'),
          }} required={required}/>

        </Touchable>
        <FormError text={error.message} style={getStyles('error')} />
      </View>
    )
  },
)
