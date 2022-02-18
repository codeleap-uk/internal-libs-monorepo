import { SliderComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createSliderStyle =
  variantProvider.createVariantFactory<SliderComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Slider')

export const AppSliderStyles = {
  ...defaultStyles,
  default: createSliderStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
