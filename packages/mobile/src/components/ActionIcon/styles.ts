import { createDefaultVariantFactory, DeepPartial, IconComposition, includePresets } from '@codeleap/common'
import { TCSS } from '../../types'
import { TouchableComposition } from '../Touchable'

export type ActionIconParts = 'icon' | `touchable${Capitalize<TouchableComposition>}`
export type ActionIconStates = ':disabled' | ''
export type ActionIconComposition = `${ActionIconParts}${ActionIconStates}`

export type StyleRecord<T extends string> = DeepPartial<Record<T, TCSS>>


type ActionIconStyles = {
  icon?: StyleRecord<IconComposition>
  touchable?: StyleRecord<TouchableComposition>
}

const createActionIconStyle = createDefaultVariantFactory<ActionIconComposition, ActionIconStyles>()

export const ActionIconPresets = includePresets(
  (style) => {
    return createActionIconStyle(() => ({ 
      touchable: {
        wrapper: style
      }
    }))
  }
)
