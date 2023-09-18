import { variantProvider } from '../theme'
import { includePresets } from '@codeleap/common'

export type LogoComposition = 'wrapper' | 'image'

const createLogoStyle = variantProvider.createVariantFactory<LogoComposition>()

const presets = includePresets((s) => createLogoStyle(() => ({ wrapper: s })))

export const LogoStyles = {
  ...presets,
  default: createLogoStyle(() => ({
    image: {
      userSelect: 'none',
      textDecoration: 'none',
    },
  })),
  splash: createLogoStyle(() => ({
    wrapper: {
      width: '30%',
    },
    image: {
      width: '100%',
    },
  })),
}
