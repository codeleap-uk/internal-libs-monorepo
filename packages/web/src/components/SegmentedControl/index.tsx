import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import {
  ComponentVariants,
  FormTypes,
  StylesOf,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { SegmentedControlProps } from './types'

export const SegmentedControl = (props: SegmentedControlProps) => {

  const { getItemWidth, label, options, styles, value } = props

  const variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof RadioInputPresets>('u:SegmentedControl', {
    variants,
    styles,
  })

  return (
    <View>
      {options.map((o, idx) => (
        <SegmentedControlOption
          label={o.label}
          value={o.value}
          // onPress={onPress(o.value, idx)}
          key={idx}
          // style={widthStyle}
          selected={value === o.value}
          variantStyles={variantStyles}
        />
      ))}
    </View>
  )
}
