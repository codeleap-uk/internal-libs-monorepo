import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'

export interface SegmentedControlProps {
  options?: {label: string; value: any }[]
  /**
   * Determine if the modal is visible
  */
  value?: any
  /**
   * Determine if the modal is visible
  */
  styles?: React.ReactNode
  /**
    * Determine if the modal is visible
  */
  label?: React.ReactNode
  /**
    * Determine if the modal is visible
  */
  getItemWidth?: (item:{label: string; value: any }, idx: number, arr: {label: string; value: any }[]) => number
  /**
    * Determine if the modal is visible
  */
}

export const SegmentedControl = (props: SegmentedControlProps) => {

  const { getItemWidth, label, options, styles, value } = props

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
