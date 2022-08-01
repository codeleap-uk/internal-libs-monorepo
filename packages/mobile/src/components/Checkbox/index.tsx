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
import { Switch as NativeCheckbox } from 'react-native'
import { InputLabel, FormError } from '../TextInput'
import { View } from '../View'
import { Touchable } from '../Touchable'
import {
  CheckboxStyles,
  CheckboxComposition,
} from './styles'
export * from './styles'

type NativeCheckboxProps = Omit<
  ComponentPropsWithRef<typeof NativeCheckbox>,
  'thumbColor' | 'trackColor'
>
type CheckboxProps = NativeCheckboxProps & {
  variants?: ComponentVariants<typeof CheckboxStyles>['variants']
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

    const variantStyles = useDefaultComponentStyle('Checkbox', {
      // @ts-ignore
      variants,
    })

    const { error, showError } = useValidate(value, validate)

    function getStyles(key: CheckboxComposition) {
      return [
        variantStyles[key],
        variantStyles[key],
        key === 'wrapper' ? style : {},
        value ? variantStyles[key + ':checked'] : {},
        value ? styles[key + ':checked'] : {},
        showError ? variantStyles[key + ':error'] : {},
        showError ? styles[key + ':error'] : {},
        checkboxProps.disabled ? variantStyles[key + ':disabled'] : {},
        checkboxProps.disabled ? styles[key + ':disabled'] : {},
      ]
    }

    return (
      <View style={getStyles('wrapper')} ref={ref} {...props}>
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
          <View style={getStyles('labelWrapper')}>
            <InputLabel label={label} style={getStyles('label')} required={required}/>
          </View>
        </Touchable>
        <FormError text={error.message} style={getStyles('error')} />
      </View>
    )
  },
)
