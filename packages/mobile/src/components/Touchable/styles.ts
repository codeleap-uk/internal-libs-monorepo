import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { StylesOf } from '../../types'
import { TouchableFeedbackConfig } from '../../utils'

export type TouchableComposition = 'wrapper' | 'feedback'

export type TouchableStylesGen<TCSS = any> = StylesOf<Exclude<TouchableComposition, 'feedback'>> & {
  feedback?: TouchableFeedbackConfig
}

const createTouchableStyle = createDefaultVariantFactory<
  TouchableComposition,
  TouchableStylesGen
>()

export const TouchablePresets = includePresets((styles) => createTouchableStyle(() => ({ wrapper: styles })))

