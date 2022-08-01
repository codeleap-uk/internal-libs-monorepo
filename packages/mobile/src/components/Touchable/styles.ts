import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { StylesOf } from '../../types'
import { TouchableFeedbackConfig } from '../../utils'

export type TouchableComposition = 'wrapper' | 'feedback' | 'pressable'

export type TouchableStylesGen<TCSS = any> = StylesOf<Exclude<TouchableComposition, 'feedback'>> & {
  feedback?: TouchableFeedbackConfig
}

const createTouchableStyle = createDefaultVariantFactory<
  TouchableComposition,
  TouchableStylesGen
>()

const presets = includePresets((styles) => createTouchableStyle(() => ({ wrapper: styles, pressable: styles })),
)

export const TouchableStyles = {
  ...presets,
  default: createTouchableStyle((t) => ({
    feedback: {
      type: 'opacity',
      value: 0.5,
    },
  })),

}
