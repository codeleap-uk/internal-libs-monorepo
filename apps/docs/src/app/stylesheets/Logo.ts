import { createStyles } from '@codeleap/styles'
import { StyleRegistry } from '../styles'

export type LogoComposition = 'wrapper' | 'image'

const createLogoVariant = createStyles<LogoComposition>

const LOGO_SPLASH_SIZE = 230

export const LogoStyles = {
  default: createLogoVariant(() => ({
    wrapper: {
      userSelect: 'none',
    },
    image: {
      width: '100%',
      userSelect: 'none',
    },
  })),
  splash: createLogoVariant(() => ({
    wrapper: {
      width: LOGO_SPLASH_SIZE,
      cursor: 'default',
    },
    image: {
      width: LOGO_SPLASH_SIZE,
      objectFit: 'contain',
      cursor: 'default',
    },
  })),
}

StyleRegistry.registerVariants('Logo', LogoStyles)
