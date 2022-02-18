import { createDefaultVariantFactory, mapVariants } from '@codeleap/common'
import { variantProvider } from '../theme'

export type MyComponentComposition = 'wrapper' | 'text'

const createMyComponentStyle  = createDefaultVariantFactory<MyComponentComposition>()

export const _MyComponentStyle = {
  default: createMyComponentStyle((theme) => ({
    wrapper: {
      backgroundColor: 'red',
    },
    text: {
      color: 'white',
    },
  })),
  abc: createMyComponentStyle((theme) => ({
    wrapper: {
      backgroundColor: 'blue',
    },
  })),
}
export const MyComponentStyle = mapVariants(variantProvider.theme, _MyComponentStyle)
