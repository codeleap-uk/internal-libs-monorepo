import React from 'react'
import { PropsOf } from "@codeleap/common"
import { StylesOf } from "../../types"
import { useAnimatedVariantStyles } from "../../utils"
import { AnimatedText } from "../Text"
import { Touchable } from "../Touchable"
import { SegmentedControlComposition } from "./styles"

export type SegmentedControlOptionProps = PropsOf<typeof Touchable> & {
  selected?: boolean
  label: string
  value: string
  variantStyles?: StylesOf<SegmentedControlComposition>
  textProps?: Omit<PropsOf<typeof AnimatedText>, 'key'>
}

export const SegmentedControlOption = (props: SegmentedControlOptionProps) => {
  const { selected, onPress, debugName,  style, variantStyles, label, value, textProps, ...touchableProps } = props

  const animatedTextStyle = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: ['text', 'text:selected'],
    updater: (styles) => {
      'worklet';

      return selected ? styles["text:selected"] : styles.text
    },
    transition: {
      duration: 10000,
      type: 'timing'
    },
    dependencies: [selected]
  })

  return <Touchable
    debugName={`Segmented Control ${debugName}, option ${label}`}
    noFeedback={selected}
    key={touchableProps.key}
    styles={{
      feedback: variantStyles.buttonFeedback,
    }}
    style={[variantStyles.button, selected && variantStyles['button:selected'], style ]}
    onPress={onPress}
  >
    <AnimatedText
      text={label}
      style={[ animatedTextStyle]}
      {...textProps}
    />

  </Touchable>
}