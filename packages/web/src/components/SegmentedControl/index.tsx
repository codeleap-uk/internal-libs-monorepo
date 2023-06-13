import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import {
  ComponentVariants,
  FormTypes,
  StylesOf,
  TypeGuards,
  useDefaultComponentStyle,
  useMemo,
} from '@codeleap/common'
// import { SegmentedControlProps } from './types'
// import { SegmentedControlPresets } from './styles'

export * from './styles'

import { PropsOf } from '@codeleap/common'
// import { StylesOf } from '../../types'
import { ActionIcon } from '../ActionIcon'
import { SegmentedControlPresets } from './styles'

export type SegmentedControlProps = {
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
  variants?: ComponentVariants<typeof SegmentedControlPresets>['variants']

  onValueChange?: (v: any) => void

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

  const { getItemWidth, label, options, styles = {}, value, variants = [], responsiveVariants, onValueChange } = props

  const widthStyle = useMemo(() => {
    const sizes = options.map(getItemWidth)
    const maxWidth = sizes.sort((a, b) => b - a)[0]

    return { width: maxWidth }
  }, [options])

  const variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlPresets>(
    'u:SegmentedControl',
    {
      variants, styles, rootElement: 'wrapper',
    },
  )

  return (
    <View>
      <View style={variantStyles.innerWrapper}>
        <View css={variantStyles} style={[variantStyles.selectedBubble, props?.touchableProps?.disabled && variantStyles['selectedBubble:disabled'], widthStyle, bubbleAnimation]}>
          {options.map((o, idx) => (
            <SegmentedControlOption
              label={o.label}
              value={o.value}
              onPress={onValueChange}
              key={idx}
              style={widthStyle}
              selected={value === o.value}
              variantStyles={variantStyles}
            />
          ))}
        </View>
      </View>
    </View>
  )
}
