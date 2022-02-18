import { FileInputComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createFileInputStyle =
  variantProvider.createVariantFactory<FileInputComposition>()
const defaultStyles = variantProvider.getDefaultVariants('FileInput')

export const AppFileInputStyles = {
  ...defaultStyles,
  default: createFileInputStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
