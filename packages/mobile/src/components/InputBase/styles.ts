import { createDefaultVariantFactory, includePresets } from "@codeleap/common"
import { ActionIconParts } from "../ActionIcon"

type InputIcons = 'icon' | 'leftIcon' | 'rightIcon'

type IconParts = Exclude<ActionIconParts, 'icon' | 'icon:disabled'>

type InputIconComposition = `${InputIcons}${Capitalize<IconParts>}`

type InputBaseStates = 'error' | 'focus'

export type InputBaseParts = 
  'wrapper' |
  'innerWrapper' |
  'label' |
  'errorMessage' |
  'subtitle' |
  InputIconComposition 

export type InputBaseComposition = `${InputBaseParts}:${InputBaseStates}` | InputBaseParts

const createTextInputBaseComposition = createDefaultVariantFactory<InputBaseComposition>()

export const InputBasePresets = includePresets((styles) => createTextInputBaseComposition(() => ({ wrapper: styles })))

