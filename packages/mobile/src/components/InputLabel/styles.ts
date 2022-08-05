import { assignTextStyle, createDefaultVariantFactory } from '@codeleap/common'

export type InputLabelComposition = 'text' | 'wrapper' | 'asterisk'

const createInputLabelStyle = createDefaultVariantFactory<InputLabelComposition>()

export const InputLabelStyles = {
  default: createInputLabelStyle((theme) => ({
    asterisk: {
      color: theme.colors.negative,
    },
    wrapper: {
      ...theme.presets.row,
    },
    text: {
      ...assignTextStyle('h5')(theme).text,
    },
  })),
}
