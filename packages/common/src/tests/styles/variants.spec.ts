import { expect } from 'chai'
import { createTheme, VariantProvider, includePresets } from '../..'
import { themeObj } from '../../mocks/theme'

const theme = createTheme(
  themeObj,
  {
    screenSize: () => screenSize,
  },
)
const variantProvider = new VariantProvider(theme)

const screenSize = [400, 500]

const defaultStyles = variantProvider.getDefaultVariants()

const createButtonVariant = variantProvider.createVariantFactory<
  'text' | 'wrapper' | 'innerWrapper'
>()

const presets = includePresets(s => createButtonVariant(() => ({ wrapper: s })))
const ButtonStyles = {
  ...presets,
  outline: createButtonVariant(() => ({
    ...defaultStyles.Button.centerRow,
    wrapper: {
      color: 'green',
    },
  })),
  fill: createButtonVariant(() => ({
    text: {},
    innerWrapper: {},
    wrapper: {
      color: 'blue',
      ...theme.spacing.margin(3),
    },
  })),
}

describe('Variants', () => {
  it('should say the color is green', () => {
    const styles = variantProvider.getStyles(
      ButtonStyles,
      {
        variants: ['outline'],
        rootElement: 'wrapper',
      },
    )

    expect(styles.wrapper.color).to.eq('green')
  })

  it('should use fill variant due to screen size', () => {
    const styles = variantProvider.getStyles(
      ButtonStyles,
      {
        variants: ['outline', 'marginBottom:1', 'marginBottom:11'],
        debugName: '',
        rootElement: 'wrapper',
        responsiveVariants: {
          xs: ['fill'],
        },
      },

    )

    expect(styles.wrapper.color).to.eq('blue')
  })

  it('should work with string', () => {
    const styles = variantProvider.getStyles(
      ButtonStyles,
      {
        variants: 'outline marginBottom:2.5',
        rootElement: 'wrapper',
        responsiveVariants: {
          xs: 'fill',
        },
      },
    )

    expect(styles.wrapper.color).to.eq('blue')
  })

  it('should accept variant from presets', () => {
    const styles = variantProvider.getStyles(
      ButtonStyles,
      {
        variants: ['alignStart'],
        rootElement: 'wrapper',
        responsiveVariants: {
          xs: 'fill',
        },
      },
    )

    expect(styles.wrapper.alignItems).to.eq('flex-start')
  })
})
