import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { StylesOf } from '../../types'

export type TouchableComposition = 'wrapper'

const createTouchableStyle = createDefaultVariantFactory<
  TouchableComposition
>()

export const TouchablePresets = includePresets((styles) => createTouchableStyle(() => ({ wrapper: styles })))

