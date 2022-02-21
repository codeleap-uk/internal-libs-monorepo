import { createDefaultVariantFactory } from '@codeleap/common'

export type MyComponentComposition = 'wrapper' | 'text'

const createMyComponentStyle  = createDefaultVariantFactory<MyComponentComposition>()

export const MyComponentStyle = {
  default: createMyComponentStyle(() => ({
    wrapper: {
      backgroundColor: 'red',
    },
    text: {
      color: 'white',
    },
  })),
  abc: createMyComponentStyle(() => ({
    wrapper: {
      backgroundColor: 'blue',
    },
  })),
}

